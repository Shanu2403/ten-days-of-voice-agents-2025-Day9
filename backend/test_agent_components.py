import os
import logging
from livekit.plugins import murf, google, deepgram
from dotenv import load_dotenv
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test_components")

# Load env
env_path = Path(__file__).parent / ".env.local"
load_dotenv(dotenv_path=env_path)

def test_components():
    # Test Deepgram STT
    try:
        stt = deepgram.STT(model="nova-3")
        logger.info("Deepgram STT instantiated successfully")
    except Exception as e:
        logger.error(f"Failed to instantiate Deepgram STT: {e}")

    # Test Google LLM
    try:
        llm = google.LLM(model="gemini-2.5-flash")
        logger.info("Google LLM instantiated successfully")
    except Exception as e:
        logger.error(f"Failed to instantiate Google LLM: {e}")

    # Test Murf TTS (already verified, but good to have)
    try:
        tts = murf.TTS(model="GEN2", voice="Matthew", style="Promo")
        logger.info("Murf TTS instantiated successfully")
    except Exception as e:
        logger.error(f"Failed to instantiate Murf TTS: {e}")

if __name__ == "__main__":
    test_components()
