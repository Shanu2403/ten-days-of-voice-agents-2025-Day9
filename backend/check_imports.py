try:
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
    print("livekit.agents imports successful")
except ImportError as e:
    print(f"livekit.agents import failed: {e}")

try:
    from livekit.plugins import silero, google, deepgram, noise_cancellation, murf
    print("livekit.plugins imports successful")
except ImportError as e:
    print(f"livekit.plugins import failed: {e}")
