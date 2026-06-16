import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Brain, Sparkles, Workflow, CheckCircle2 } from 'lucide-react';

const LoomVisual = () => {
  const sentence = "The quick brown fox".split(" ");
  return (
    <div className="flex gap-2 mb-8 flex-wrap">
      {sentence.map((word, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.2, duration: 0.5 }}
          className="px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg text-accent-cyan font-mono text-xs md:text-sm shadow-[0_0_15px_rgba(45,212,191,0.2)]"
        >
          {word}
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0.5, 1] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/40 rounded-lg text-accent-gold font-mono text-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]"
      >
        ...
      </motion.div>
    </div>
  );
};

const ThreadVisual = () => {
  return (
    <div className="flex flex-col items-center gap-2 mb-8 md:flex-row md:justify-start">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-10 h-10 rounded-full border border-accent-purple/50 flex items-center justify-center bg-accent-purple/10 text-accent-purple shadow-[0_0_15px_rgba(168,85,247,0.2)]"><Brain className="w-5 h-5"/></motion.div>
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 1 }} className="h-0.5 w-8 md:w-12 bg-accent-purple/30 origin-left" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="w-10 h-10 rounded-full border border-accent-cyan/50 flex items-center justify-center bg-accent-cyan/10 text-accent-cyan shadow-[0_0_15px_rgba(45,212,191,0.2)]"><Sparkles className="w-5 h-5"/></motion.div>
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2, duration: 1 }} className="h-0.5 w-8 md:w-12 bg-accent-cyan/30 origin-left" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="w-10 h-10 rounded-full border border-accent-gold/50 flex items-center justify-center bg-accent-gold/10 text-accent-gold shadow-[0_0_15px_rgba(234,179,8,0.2)]"><CheckCircle2 className="w-5 h-5"/></motion.div>
    </div>
  );
};

const PatternVisual = () => {
  return (
    <div className="flex items-center justify-start mb-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="relative w-24 h-24"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-accent-cyan/20 border border-accent-cyan/40 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.3)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-accent-gold/20 border border-accent-gold/40 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-6 h-6 bg-accent-purple/20 border border-accent-purple/40 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-6 h-6 bg-white/10 border border-white/20 rounded-full" />
        <Workflow className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white/50" />
      </motion.div>
    </div>
  );
};

const MirrorVisual = () => {
  return (
    <div className="flex items-center justify-start mb-8 relative w-24 h-24">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.5], opacity: [0.8, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
          className="absolute inset-0 border border-accent-gold rounded-full"
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center bg-bg-primary rounded-full z-10 border border-accent-gold/40 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
         <span className="font-mono text-accent-gold text-sm font-bold">98/100</span>
      </div>
    </div>
  );
};

const realmData: Record<string, { title: string; subtitle: string; story: string; objectives: string[] }> = {
  loom: {
    title: 'The Loom',
    subtitle: 'Foundations of Tokenization & Context',
    story: 'In the beginning was the Loom. Its threads are words, its weave is thought. To become a Weaver, you must learn to command the fundamental structure of intelligence. The models process reality in fragments—tokens. By shaping these tokens with intention, you force the Loom to manifest the outcome you desire.\n\nYour first trial is one of clarity and precision. A Weaver never wastes thread. Provide clear instructions, establish a persona, and use explicit examples (few-shot prompting) to align the model to your exact frequency.',
    objectives: [
      'Understand how LLMs parse instructions.',
      'Master Zero-Shot and Few-Shot prompting techniques.',
      'Control output format and tone decisively.'
    ]
  },
  thread: {
    title: 'The Thread',
    subtitle: 'Chain-of-Thought & Reasoning Trees',
    story: 'You have mastered the Loom. Now you must master the Thread. A single strand of thought can lead to brilliance, or it can snap under the weight of complexity. Chain-of-Thought is the practice of weaving a path for the model to follow.\n\nThrough intermediate step-by-step reasoning, you forge an unbreakable thread of logic. By asking the model to "think step by step" or providing a template for its reasoning trace, you unlock its ability to solve complex problems that require deep logic and calculation.',
    objectives: [
      'Implement Chain-of-Thought (CoT) prompting to improve logic.',
      'Understand Self-Consistency by generating multiple reasoning paths.',
      'Guide the model to acknowledge and correct its own assumptions.'
    ]
  },
  pattern: {
    title: 'The Pattern',
    subtitle: 'Agents, ReAct & Tool Composition',
    story: 'A Thread is solitary. The Pattern is a chorus. You are no longer just guiding thought; you are orchestrating action. Here resides the concept of ReAct (Reason + Act). \n\nThe grandest tapestries are woven not by a single stroke, but by composing smaller, specialized tools and agents. You will learn how to write prompts that compel the model to pause, seek external data, and formulate a plan before it speaks.',
    objectives: [
      'Structure prompts for Tool Use (function calling).',
      'Design ReAct loops (Thought -> Action -> Observation).',
      'Compose prompt chains where output informs the next input.'
    ]
  },
  mirror: {
    title: 'The Mirror',
    subtitle: 'Evaluation, Rubrics & Iteration',
    story: 'A true Master Weaver does not simply weave and step away; they gaze into the Mirror to evaluate their creation. Without evaluation, there is no mastery—only chance.\n\nIn this Realm, you will learn to use the Loom itself to judge the quality of the weave. By designing rigorous rubrics and employing "LLM-as-a-Judge" techniques, you will construct automated feedback loops that refine your prompts beyond human speeds.',
    objectives: [
      'Design comprehensive, multi-axis evaluation rubrics.',
      'Implement LLM-as-a-Judge prompting patterns.',
      'Establish deterministic and qualitative guardrails.'
    ]
  }
};

export default function Realm() {
  const { realmId } = useParams();
  const navigate = useNavigate();

  const realm = realmId && realmData[realmId] ? realmData[realmId] : realmData.loom;

  const renderVisual = () => {
    switch(realmId) {
      case 'loom': return <LoomVisual />;
      case 'thread': return <ThreadVisual />;
      case 'pattern': return <PatternVisual />;
      case 'mirror': return <MirrorVisual />;
      default: return <LoomVisual />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-cyan via-accent-gold to-accent-purple" />
      
      <header className="p-8 pb-4 flex items-center relative z-10">
        <button 
          onClick={() => navigate('/hub')}
          className="text-text-secondary hover:text-accent-gold transition-colors flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-accent-gold/40 hover:bg-accent-gold/10 rounded-lg shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-8 md:py-16 flex flex-col relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-bg-elevated/40 border border-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-sm"
        >
          <div className="text-accent-purple font-mono uppercase tracking-widest text-sm mb-4">{realm.subtitle}</div>
          <h1 className="text-5xl md:text-7xl font-serif mb-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{realm.title}</h1>
          
          {renderVisual()}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 prose prose-invert prose-lg max-w-none text-text-secondary leading-relaxed space-y-6 font-serif">
              {realm.story.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className={idx === 0 ? "text-xl text-text-primary leading-relaxed" : ""}>{paragraph}</p>
              ))}
            </div>

            <div className="bg-black/30 border border-white/5 rounded-xl p-6 h-fit">
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-accent-gold mb-4">Learning Objectives</h3>
              <ul className="space-y-4">
                {realm.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start text-sm text-text-secondary">
                    <span className="text-accent-cyan mr-3 font-bold">•</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 flex justify-center md:justify-start">
            <Button size="lg" onClick={() => navigate(`/crucible/${realmId}`)} className="shadow-[0_0_40px_rgba(197,164,110,0.2)] hover:shadow-[0_0_60px_rgba(197,164,110,0.4)] group overflow-hidden relative">
              <span className="relative z-10 flex items-center gap-3">
                Begin Practice <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Decorative ambient lighting */}
      <div className="fixed top-1/4 right-[-10%] w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-[-10%] w-[600px] h-[600px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
