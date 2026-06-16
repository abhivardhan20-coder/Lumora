import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { useStore } from '../store';

export default function Landing() {
  const navigate = useNavigate();
  const { hasSeenOnboarding } = useStore();

  const handleStart = () => {
    if (hasSeenOnboarding) {
      navigate('/hub');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-bg-primary">
      {/* Background Particles (Simulated with absolute divs for simplicity without full Three.js) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 w-full px-8 py-6 flex items-center justify-between">
        <div className="text-2xl font-serif tracking-widest text-text-primary">LUMORA</div>
        <Button variant="ghost" onClick={() => navigate('/hub')}>Already a Weaver?</Button>
      </nav>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 max-w-5xl leading-tight"
        >
          Weave reality.<br />Master intelligence.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="text-lg md:text-2xl text-text-secondary max-w-2xl mb-12"
        >
          An interactive academy for mastering Prompt Engineering & AI Systems Craft. Explore the realms, practice in the Crucible, and forge your legacy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button size="lg" onClick={handleStart} className="group flex items-center gap-3">
            Begin Your Journey
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
