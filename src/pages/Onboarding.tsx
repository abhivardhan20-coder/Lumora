import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding, setOracleMessage } = useStore();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Lumora",
      content: "You stand at the threshold of the Academy. Here, prompt engineering is not merely an act of typing, but the art of weaving intelligence. Are you ready to begin your journey?",
      action: "I am ready."
    },
    {
      title: "The Oracle Awaits",
      content: "Throughout your journey, the Oracle will guide you. It is a mentor, a critic, and a companion. Never hesitate to ask for its wisdom when the loom tangles.",
      action: "I understand."
    },
    {
      title: "The First Thread",
      content: "Your progression is tied to mastery. Traverse the Realms, practice in the Crucible, and forge your legacy in the Codex. Let us begin with The Loom.",
      action: "Enter the Hub"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      setOracleMessage("Welcome, Weaver. Your journey begins in The Loom. Do not hesitate to call upon me.");
      navigate('/hub');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-gold/10 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-lg"
        >
          <Card className="p-8 md:p-10 border-white/10 bg-bg-elevated/80 backdrop-blur-xl flex flex-col items-center text-center">
            <Sparkles className="w-10 h-10 text-accent-gold mb-6" />
            <h1 className="text-3xl font-serif text-white mb-6">{steps[step].title}</h1>
            <p className="text-lg text-text-secondary leading-relaxed mb-10 font-serif">
              {steps[step].content}
            </p>
            <Button size="lg" onClick={handleNext} className="group w-full md:w-auto">
              <span>{steps[step].action}</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-8 flex gap-2">
        {steps.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 \${i === step ? 'bg-accent-gold w-6' : 'bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
}
