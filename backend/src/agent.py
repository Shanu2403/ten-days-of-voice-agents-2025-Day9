import logging
from pathlib import Path
from dotenv import load_dotenv
import os
import json
from datetime import datetime
from typing import Annotated, Dict, Any, Optional, List

# Load env vars
env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(dotenv_path=env_path)

from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    WorkerOptions,
    cli,
    metrics,
    function_tool,
    RunContext,
    llm,
)
from livekit.plugins import silero, google, deepgram, noise_cancellation, murf
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from . import blinkit_merchant as merchant

logger = logging.getLogger("blinkit-agent")

class BlinkitAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=self._get_instructions(),
        )

    def _get_instructions(self) -> str:
        return """
        You are **NOVA**, a witty, futuristic, and hyper-intelligent shopping assistant.
        
        **YOUR GOAL:**
        Deliver groceries in 10 minutes while being charming, funny, and context-aware.
        
        **PERSONA:**
        - **Witty:** Make small jokes. "Chips? Excellent choice for a movie marathon!"
        - **Futuristic:** Use terms like "initiating warp speed delivery" or "quantum-packing your order".
        - **Smart:** Remember user preferences. If they say "I'm vegan", respect it.
        
        **CAPABILITIES:**
        1.  **Smart Search:** `list_products(query="healthy")` finds fruits/veggies automatically.
        2.  **Personalization:** 
            - If user says "I'm vegan" or "I hate spicy", call `update_preferences(key="diet", value="vegan")`.
            - Then search again to show filtered results.
        3.  **Place Order:** `create_order` as usual.
        
        **INTERACTION FLOW:**
        - **User:** "I'm vegan, what do you have?"
        - **You:** Call `update_preferences(key="diet", value="vegan")` then `list_products()`.
        - **You:** "Acknowledged. Filtering out the cow juice. Here are some cruelty-free options: Almond Milk, Tofu..."
        
        - **User:** "I need chips."
        - **You:** `list_products("chips")`. "Found Lays and Kurkure. Shall I beam them into your cart?"
        """

    @function_tool
    async def update_preferences(self, key: str, value: str):
        """
        Update user preferences (e.g., diet='vegan', likes='spicy').
        """
        logger.info(f"update_preferences: {key}={value}")
        merchant.update_user_context(key, value)
        return f"Updated context: {key} is now {value}."

    @function_tool
    async def list_products(self, query: Annotated[str, "The search query or category name"] = ""):
        """
        Search for products (smart vector search).
        """
        logger.info(f"list_products called with query='{query}'")
        products = merchant.list_products(query)
        logger.info(f"list_products found {len(products)} items")
        
        if not products:
            return "No matching products found in this sector, Captain."
        
        result_str = "Found the following items:\n"
        for p in products:
            result_str += f"- {p['name']} (ID: {p['id']}): ₹{p['price']}\n"
        return result_str

    @function_tool
    async def create_order(self, 
                           items: Annotated[List[Dict[str, Any]], "List of items to order. Each item must have 'product_id' and optionally 'quantity'."]):
        """
        Place a grocery order.
        """
        logger.info(f"create_order called with items={items}")
        result = merchant.create_order(items)
        if "error" in result:
            return f"Failed to place order: {result['error']}"
        
        return f"Order placed successfully! Order ID: {result['id']}. Total: ₹{result['total_amount']}."

    @function_tool
    async def get_last_order(self):
        """
        Retrieve details of the most recent order.
        """
        logger.info("get_last_order called")
        order = merchant.get_last_order()
        if not order:
            return "No recent orders found."
        
        items_str = ", ".join([f"{i['quantity']}x {i['name']}" for i in order['items']])
        return f"Last order ({order['id']}) placed on {order['created_at']}:\nTotal: ₹{order['total_amount']}\nItems: {items_str}"

def prewarm(proc: JobProcess):
    try:
        logger.info("Starting prewarm...")
        proc.userdata["vad"] = silero.VAD.load()
        proc.userdata["stt"] = deepgram.STT(model="nova-3")
        
        if not os.getenv("DEEPGRAM_API_KEY"):
            logger.error("DEEPGRAM_API_KEY is missing")
        if not os.getenv("GOOGLE_API_KEY"):
            logger.error("GOOGLE_API_KEY is missing")
            
        logger.info("Prewarm completed")
    except Exception as e:
        logger.error(f"Prewarm failed: {e}", exc_info=True)
        raise e

async def entrypoint(ctx: JobContext):
    try:
        logger.info("Entrypoint started")
        ctx.log_context_fields = {"room": ctx.room.name}
        
        agent = BlinkitAgent()
        
        session = AgentSession(
            stt=ctx.proc.userdata.get("stt") or deepgram.STT(model="nova-3"),
            llm=google.LLM(model="gemini-2.5-flash"),
            tts=murf.TTS(
                model="FALCON",
                voice="Matthew",
                style="Promo",
            ),
            turn_detection=ctx.proc.userdata.get("turn_detection") or MultilingualModel(),
            vad=ctx.proc.userdata["vad"],
            preemptive_generation=True,
        )
        
        usage_collector = metrics.UsageCollector()
        
        @session.on("metrics_collected")
        def _on_metrics_collected(ev: MetricsCollectedEvent):
            metrics.log_metrics(ev.metrics)
            usage_collector.collect(ev.metrics)

        async def log_usage():
            summary = usage_collector.get_summary()
            logger.info(f"Usage: {summary}")

        ctx.add_shutdown_callback(log_usage)

        logger.info("Starting session...")
        await session.start(
            agent=agent,
            room=ctx.room,
            room_input_options=RoomInputOptions(
                noise_cancellation=noise_cancellation.BVC(),
            ),
        )
        
        logger.info("Connecting to room...")
        await ctx.connect()
        logger.info("Connected to room")
        
        # Initial greeting
        await session.say("Hi! I'm NOVA, your quantum shopping assistant. What groceries do you need today?", add_to_chat_ctx=True)
        logger.info("Initial greeting sent")

    except Exception as e:
        logger.error(f"Error in entrypoint: {e}")
        raise e

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint, 
            prewarm_fnc=prewarm,
            agent_name="blinkit-agent",
            ws_url=os.getenv("LIVEKIT_URL"),
            api_key=os.getenv("LIVEKIT_API_KEY"),
            api_secret=os.getenv("LIVEKIT_API_SECRET"),
        )
    )
