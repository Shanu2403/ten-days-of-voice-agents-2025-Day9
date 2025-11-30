import os
import logging
from livekit.plugins import murf
from dotenv import load_dotenv
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test_murf")

# Load env
env_path = Path(__file__).parent / ".env.local"
load_dotenv(dotenv_path=env_path)

def test_murf():
    api_key = os.getenv("MURF_API_KEY")
    logger.info(f"MURF_API_KEY present: {bool(api_key)}")
    
    try:
        tts = murf.TTS(
            model="FALCON",
            voice="Matthew",
            style="Promo",
        )
        logger.info("Murf TTS instantiated successfully")
    except Exception as e:
        logger.error(f"Failed to instantiate Murf TTS: {e}")

if __name__ == "__main__":
    test_murf()
