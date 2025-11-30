import { motion } from 'motion/react';
import {
  Basket,
  Carrot,
  Coffee,
  Egg,
  Microphone,
  Lightning,
  Pizza,
} from '@phosphor-icons/react/dist/ssr';

interface WelcomeViewProps {
  onStart: () => void;
}

export function WelcomeView({ onStart }: WelcomeViewProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#F8CB46] font-sans text-slate-900 selection:bg-[#0C831F] selection:text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8CB46] via-[#f9d462] to-[#F8CB46]" />

      {/* Animated Mesh Gradient Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: 'radial-gradient(at 0% 0%, rgba(12, 131, 31, 0.2) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 255, 255, 0.5) 0px, transparent 50%)'
        }}
      />

      {/* Floating 3D Elements (Parallax Illusion) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement icon={Carrot} className="top-[15%] left-[10%] text-[#0C831F]" delay={0} size={80} />
        <FloatingElement icon={Egg} className="top-[25%] right-[15%] text-white" delay={1.5} size={100} />
        <FloatingElement icon={Coffee} className="bottom-[20%] left-[15%] text-white" delay={0.8} size={90} />
        <FloatingElement icon={Pizza} className="bottom-[15%] right-[10%] text-[#0C831F]" delay={2.2} size={85} />
        <FloatingElement icon={Lightning} className="top-[40%] left-[5%] text-white/40" delay={3} size={60} />
      </div>

      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-4 flex max-w-4xl flex-col items-center rounded-[3rem] border border-white/40 bg-white/30 px-6 py-20 text-center shadow-2xl backdrop-blur-xl md:px-20 md:py-24"
      >
        {/* Glowing Logo Container */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          className="mb-10 flex h-32 w-32 items-center justify-center rounded-full bg-[#0C831F] shadow-[0_0_50px_rgba(12,131,31,0.3)]"
        >
          <Basket size={64} weight="fill" className="text-[#F8CB46]" />
        </motion.div>

        {/* Hero Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-6 text-6xl font-black tracking-tighter text-[#0C831F] md:text-9xl italic drop-shadow-sm"
        >
          NOVA <span className="text-white text-stroke-green">AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-12 max-w-lg text-lg font-bold text-slate-800/80 md:text-2xl leading-relaxed"
        >
          Groceries delivered in minutes. <br />
          <span className="text-[#0C831F]">Just ask, and it's done.</span>
        </motion.p>

        {/* Pulsing CTA Button */}
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(12, 131, 31, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="group relative flex items-center gap-4 overflow-hidden rounded-full bg-[#0C831F] px-12 py-6 text-xl font-black tracking-wide text-white shadow-xl transition-all"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
          <span className="relative z-10 flex items-center gap-3">
            START ORDERING <Microphone weight="fill" className="animate-pulse" size={24} />
          </span>
        </motion.button>
      </motion.div>

      {/* Footer Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 text-xs font-bold tracking-[0.2em] text-slate-800/50 uppercase"
      >
        Powered by LiveKit Agents • NOVA Protocol v2.0
      </motion.div>
    </div>
  );
}

function FloatingElement({ icon: Icon, className, delay, size }: { icon: any, className: string, delay: number, size: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: [0, 0.4, 0.4, 0],
        y: [50, -50],
        rotate: [0, 10, -10, 0]
      }}
      transition={{
        duration: 10,
        delay: delay,
        repeat: Infinity,
        ease: "linear",
        repeatType: "mirror"
      }}
      className={`absolute ${className} blur-[1px]`}
    >
      <Icon size={size} weight="duotone" />
    </motion.div>
  );
}
