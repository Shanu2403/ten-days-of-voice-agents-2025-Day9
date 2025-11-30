# Flipkart Voice Agent 🛍️

> **Day 6 Challenge: E-Commerce Voice Assistant**
> A premium, voice-enabled shopping experience mimicking the Flipkart ecosystem.

![Flipkart Voice](https://img.shields.io/badge/Flipkart-Voice-2874F0?style=for-the-badge&logo=flipkart&logoColor=FFE500)
![LiveKit](https://img.shields.io/badge/Powered%20By-LiveKit-black?style=for-the-badge)
![Murf AI](https://img.shields.io/badge/TTS-Murf%20Falcon-purple?style=for-the-badge)

## 🚀 Overview

**Flipkart Voice** is a next-generation e-commerce assistant that allows users to shop using natural voice commands. It features a stunning, "Next-Gen" user interface designed to match Flipkart's premium branding, complete with glassmorphism, 3D animations, and a seamless voice interaction model.

## ✨ Key Features

### 🎨 Premium Frontend (Next-Gen UI)
-   **Glassmorphism Landing Page**: A futuristic welcome screen (`welcome-view.tsx`) with deep blue gradients, frosted glass cards, and 3D floating icons (Mobile, Laptop, Sneaker).
-   **Flipkart Branding**: Authentic Blue (`#2874F0`) and Yellow (`#FFE500`) color scheme throughout the app.
-   **App-Like Session View**: A fully functional e-commerce layout (`session-view.tsx`) with a proper navbar, search bar, and cart integration.
-   **Banner-Style Deals**: A dynamic "Big Billion Days" carousel (`deals-carousel.tsx`) showcasing live offers.
-   **Interactive Visualizer**: A glowing, pulsing agent visualizer (`tile-layout.tsx`) that reacts to voice activity.

### 🧠 Intelligent Backend
-   **Smart Persona**: The agent acts as a professional "Flipkart Voice Assistant", guiding users through product discovery and purchase.
-   **Diverse Catalog**: A rich product database (`catalog.json`) featuring Mobiles (iPhone 15, S24 Ultra), Fashion (Nike, Levi's), and Home Essentials.
-   **Simplified Tools**: Optimized `list_products` tool for reliable LLM performance.
-   **Murf Falcon TTS**: Ultra-low latency text-to-speech for natural conversations.

## 🛠️ Tech Stack

-   **Frontend**: Next.js, React, Tailwind CSS, Framer Motion, Phosphor Icons
-   **Backend**: Python, LiveKit Agents, Google Gemini 2.5 Flash (LLM)
-   **Voice**: Murf Falcon (TTS), Deepgram (STT)
-   **Realtime**: LiveKit Cloud

## 🏃‍♂️ Getting Started

### Prerequisites
-   Node.js & npm
-   Python 3.10+ & uv
-   LiveKit Cloud Account
-   Murf AI API Key

### 1. Backend Setup
```bash
cd backend
uv sync
# Copy .env.example to .env.local and fill in keys
uv run python -m src.agent dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Copy .env.example to .env.local and fill in keys
npm run dev
```

### 3. Verification
-   Open `http://localhost:3000` (or the port shown in terminal).
-   Click **"Start Shopping"**.
-   Speak to the agent: *"Show me the latest iPhones"* or *"I want to buy Nike shoes"*.

## 🧪 Testing
Run the backend verification suite:
```bash
cd backend
uv run python -m src.test_merchant
```

---
*Built for the Murf AI Voice Agents Challenge 2025.*
