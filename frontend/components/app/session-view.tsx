'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from 'livekit-client';
import { motion } from 'motion/react';
import { useRoomContext } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { ChatTranscript } from '@/components/app/chat-transcript';
import { ImageViewer } from '@/components/app/image-viewer';
import { PreConnectMessage } from '@/components/app/preconnect-message';
import { TileLayout } from '@/components/app/tile-layout';
import {
  AgentControlBar,
  type ControlBarControls,
} from '@/components/livekit/agent-control-bar/agent-control-bar';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useConnectionTimeout } from '@/hooks/useConnectionTimout';
import { useDebugMode } from '@/hooks/useDebug';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../livekit/scroll-area/scroll-area';
import { Button } from '@/components/livekit/button';
import {
  ArrowClockwise,
  CaretDown,
  MagnifyingGlass,
  Microphone,
  PaperPlaneRight,
  ShoppingCart,
  SpeakerHigh,
  SpeakerSlash,
  X,
  Basket,
} from '@phosphor-icons/react/dist/ssr';

/* eslint-disable @typescript-eslint/no-explicit-any */

const MotionBottom = motion.create('div');

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const BOTTOM_VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
      translateY: '0%',
    },
    hidden: {
      opacity: 0,
      translateY: '100%',
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.3,
    delay: 0.5,
    ease: 'easeOut',
  } as any,
};

interface FadeProps {
  top?: boolean;
  bottom?: boolean;
  className?: string;
}

export function Fade({ top = false, bottom = false, className }: FadeProps) {
  return (
    <div
      className={cn(
        'from-background pointer-events-none h-4 bg-linear-to-b to-transparent',
        top && 'bg-linear-to-b',
        bottom && 'bg-linear-to-t',
        className
      )}
    />
  );
}
interface SessionViewProps {
  appConfig: AppConfig;
}

import { DealsCarousel } from '@/components/app/deals-carousel';

// ... imports

export const SessionView = ({
  appConfig,
  ...props
}: React.ComponentProps<'section'> & SessionViewProps) => {
  useConnectionTimeout(200_000);
  useDebugMode({ enabled: IN_DEVELOPMENT });

  const room = useRoomContext();
  const messages = useChatMessages();
  const [chatOpen, setChatOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [generatedImage, setGeneratedImage] = useState<{ url: string; prompt: string } | null>(
    null
  );

  const controls: ControlBarControls = {
    leave: true,
    microphone: true,
    chat: appConfig.supportsChatInput,
    camera: appConfig.supportsVideoInput,
    screenShare: appConfig.supportsVideoInput,
  };

  useEffect(() => {
    const lastMessage = messages.at(-1);
    const lastMessageIsLocal = lastMessage?.from?.isLocal === true;

    if (scrollAreaRef.current && lastMessageIsLocal) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const onDataReceived = (
      payload: Uint8Array,
      participant?: RemoteParticipant,
      kind?: DataPacket_Kind,
      topic?: string
    ) => {
      if (topic === 'agent_events') {
        try {
          const parsedPayload = JSON.parse(new TextDecoder().decode(payload));
          if (parsedPayload.type === 'image') {
            setGeneratedImage(parsedPayload.data);
          }
        } catch (e) {
          console.error('Failed to parse agent event:', e);
        }
      }
    };

    room.on(RoomEvent.DataReceived, onDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, onDataReceived);
    };
  }, [room]);

  const handleRestart = async () => {
    window.location.reload();
  };

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden bg-[#F4F6FB] font-sans text-slate-900 selection:bg-[#F8CB46] selection:text-[#0C831F]" {...props}>
      {/* NOVA Navbar (Blinkit Style) */}
      <nav className="relative z-20 flex h-16 items-center justify-between bg-[#F8CB46] px-4 shadow-sm md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0C831F] text-white shadow-sm">
            <Basket size={24} weight="fill" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-[#0C831F]">NOVA <span className="text-white">AI</span></span>
            <span className="text-[10px] font-bold tracking-wide text-slate-800 uppercase leading-none">Quantum Delivery</span>
          </div>
        </div>

        {/* Search Bar Placeholder */}
        <div className="hidden max-w-md flex-1 mx-6 md:flex">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlass size={18} className="text-slate-500" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border-none bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-500 shadow-sm focus:ring-2 focus:ring-[#0C831F]"
              placeholder="Search 'milk', 'chips'..."
              readOnly
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-lg bg-[#0C831F] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#0a6b19]">
            <ShoppingCart size={20} weight="fill" />
            <span className="hidden md:inline">My Cart</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-[#F4F6FB]">
        {/* Blinkit-style Header */}
        <div className="z-20 bg-white shadow-sm">
          {/* Top Bar: Location & Profile */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">DELIVERY IN</span>
                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">8 MINS</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                <span>Home - Sector 42, Gurgaon</span>
                <CaretDown size={12} weight="bold" />
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="text-xs font-bold">HJ</span>
            </div>
          </div>

          {/* Search Bar (Mobile) */}
          <div className="px-4 py-2 md:hidden">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlass size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] transition-all"
                placeholder="Search 'milk'..."
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-40 relative z-10">
          {/* Deals Banner */}
          <div className="p-4">
            <DealsCarousel />
          </div>

          {/* Quick Categories */}
          <div className="px-4 mb-6">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">Shop by Category</h3>
            <div className="grid grid-cols-4 gap-3">
              <CategoryItem icon="🥛" label="Dairy" color="bg-blue-50 border-blue-100 text-blue-600" />
              <CategoryItem icon="🍞" label="Bakery" color="bg-orange-50 border-orange-100 text-orange-600" />
              <CategoryItem icon="🥦" label="Veggies" color="bg-green-50 border-green-100 text-green-600" />
              <CategoryItem icon="🍟" label="Snacks" color="bg-yellow-50 border-yellow-100 text-yellow-600" />
              <CategoryItem icon="🍫" label="Sweets" color="bg-purple-50 border-purple-100 text-purple-600" />
              <CategoryItem icon="🧴" label="Care" color="bg-pink-50 border-pink-100 text-pink-600" />
              <CategoryItem icon="🧊" label="Frozen" color="bg-cyan-50 border-cyan-100 text-cyan-600" />
              <CategoryItem icon="⚡" label="Instant" color="bg-red-50 border-red-100 text-red-600" />
            </div>
          </div>

          {/* Chat Transcript Area */}
          <div className="px-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 min-h-[300px]">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                <div className="h-2 w-2 rounded-full bg-[#0C831F] animate-pulse" />
                <span className="text-xs font-bold text-slate-500 uppercase">NOVA Live Assistant</span>
              </div>
              <ChatTranscript
                hidden={!chatOpen}
                messages={messages}
                className="space-y-4"
              />
            </div>
          </div>
        </div>

        {/* Visualizer Container (Centered Overlay - High Z-Index) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto w-full h-full opacity-30">
            <TileLayout chatOpen={chatOpen} />
          </div>
        </div>

        {/* Image Viewer Overlay */}
        <ImageViewer
          imageUrl={generatedImage?.url ?? null}
          prompt={generatedImage?.prompt ?? null}
          onClose={() => setGeneratedImage(null)}
        />
      </div>

      {/* Control Bar */}
      <div className="relative z-50 bg-white border-t border-slate-100">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 pb-6">
          {appConfig.isPreConnectBufferEnabled && (
            <PreConnectMessage messages={messages} className="mx-auto" />
          )}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <AgentControlBar controls={controls} onChatOpenChange={setChatOpen} />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRestart}
              className="text-slate-500 hover:text-[#0C831F] hover:bg-green-50 rounded-full"
              title="Restart Session"
            >
              <ArrowClockwise className="h-6 w-6" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              NOVA AI • Powered by LiveKit
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

function CategoryItem({ icon, label, color }: { icon: string, label: string, color: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 rounded-xl ${color} border p-3 transition-transform hover:scale-105 cursor-pointer shadow-sm`}>
      <span className="text-2xl filter drop-shadow-sm">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-700">{label}</span>
    </div>
  );
}
