import os
from dotenv import load_dotenv
from pathlib import Path

# Load backend env
env_path = Path("backend/.env.local")
load_dotenv(dotenv_path=env_path)

def check_var(name):
    val = os.getenv(name)
    if val:
        print(f"{name}: '{val}' (Length: {len(val)})")
        print(f"  Repr: {repr(val)}")
        if val.strip() != val:
            print(f"  WARNING: {name} has leading/trailing whitespace!")
    else:
        print(f"{name}: NOT SET")

print("--- Backend .env.local Check ---")
check_var("LIVEKIT_URL")
check_var("LIVEKIT_API_KEY")
check_var("LIVEKIT_API_SECRET")
