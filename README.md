# Blinkit Voice (NOVA) ⚡🛒

**"Groceries delivered in 10 minutes. Just ask."**

Welcome to **Blinkit Voice**, a next-generation voice commerce assistant powered by **NOVA** (Neural Online Voice Assistant). This project reimagines the grocery shopping experience with a hyper-intelligent, witty, and context-aware AI that makes ordering as simple as speaking.

## 🚀 Key Features

-   **NOVA Persona**: A witty, futuristic, and charming AI assistant that makes shopping fun ("Initiating warp speed delivery!").
-   **Quantum Delivery**: Simulates the promise of 10-minute delivery with real-time order tracking.
-   **Smart Search**:
    -   **Semantic Understanding**: Finds "healthy snacks" or "protein" even if those words aren't in the product name.
    -   **Personalization**: Remembers if you're vegan or hate spicy food and filters results accordingly.
-   **Voice-First Experience**:
    -   **Real-time Conversation**: Powered by **LiveKit** for sub-second latency.
    -   **Natural Interaction**: Interrupt the agent, change your mind, or ask complex queries naturally.
-   **Premium UI**:
    -   **Blinkit Aesthetics**: Clean Green & Yellow theme for a familiar, premium feel.
    -   **Visualizer**: Real-time voice wavelength visualization.
    -   **3D Elements**: Interactive deals carousel and floating 3D product icons.

## 🛠️ Tech Stack

-   **Backend**: Python, LiveKit Agents
-   **AI Models**:
    -   **LLM**: Google Gemini 2.5 Flash (The Brain)
    -   **STT**: Deepgram Nova-3 (The Ears)
    -   **TTS**: **Murf Falcon** (The Voice - Ultra-realistic & Fast)
-   **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, LiveKit Components

## 🚀 Quick Start

### Prerequisites
-   Python 3.9+ with `uv`
-   Node.js 18+ with `pnpm` or `npm`
-   LiveKit Server (local or cloud)

### 1. Backend Setup
```bash
cd backend
uv sync
cp .env.example .env.local
# Configure LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, DEEPGRAM_API_KEY, GOOGLE_API_KEY
./start_app.sh
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET
npm run dev
```

### 3. Start Shopping
Open `http://localhost:3000` and click **"START ORDERING"**.

## 🎮 Interaction Examples

-   **User**: "I need something for a movie night."
-   **NOVA**: "Excellent choice! I have Lays, Popcorn, and Coke. Shall I add the 'Movie Night Bundle'?"

-   **User**: "I'm vegan."
-   **NOVA**: "Understood. Filtering out the dairy. How about some Almond Milk and Tofu?"

## 📜 License
MIT
