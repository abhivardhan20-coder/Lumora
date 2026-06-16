import React from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { Compass, Book, Sparkles, Lock, Shield, Award, Crown, Brain, Zap, LogOut } from 'lucide-react';

const RELICS_DB: Record<string, { title: string; desc: string; icon: React.ReactNode; color: string }> = {
  'first-weave': { title: 'The First Thread', desc: 'You cast your first prompt in the Crucible.', icon: <Sparkles className="w-6 h-6" />, color: 'text-accent-cyan' },
  'high-score': { title: 'Master Weaver', desc: 'You achieved an overall evaluation score above 90.', icon: <Crown className="w-6 h-6" />, color: 'text-accent-gold' },
  'codex-scholar': { title: 'Codex Scholar', desc: 'You saved an artifact to the Codex.', icon: <Book className="w-6 h-6" />, color: 'text-accent-purple' },
  'echo-chamber': { title: 'Deep Thinker', desc: 'You used Echo Mode to reveal the model\'s reasoning.', icon: <Brain className="w-6 h-6" />, color: 'text-blue-400' },
};

export default function Hub() {
  const navigate = useNavigate();
  const { progress } = useStore();

  const realms = [
    { id: 'loom', title: 'The Loom', subtitle: 'Foundations of Tokenization & Zero-Shot', isUnlocked: true },
    { id: 'thread', title: 'The Thread', subtitle: 'Chain-of-Thought & Reasoning Trees', isUnlocked: progress.level >= 2 || progress.realms['loom']?.status === 'completed' },
    { id: 'pattern', title: 'The Pattern', subtitle: 'Agents, ReAct & Tool Use', isUnlocked: progress.level >= 3 || progress.realms['thread']?.status === 'completed' },
    { id: 'mirror', title: 'The Mirror', subtitle: 'Evaluation, Rubrics & Iteration loops', isUnlocked: progress.level >= 4 || progress.realms['pattern']?.status === 'completed' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8 pt-16 md:pt-24 relative overflow-y-auto overflow-x-hidden custom-scrollbar">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-purple/5 to-transparent pointer-events-none" />
      <div className="absolute -left-[20%] top-[20%] w-[500px] h-[500px] bg-accent-cyan/10 blur-[150px] rounded-full pointer-events-none" />
      
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-16 relative z-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif mb-3 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary drop-shadow-sm">Realm Constellation Map</h1>
          <div className="flex items-center gap-4 text-text-secondary">
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent-gold" /> Weaver Level: <strong className="text-text-primary">{progress.level}</strong></span>
            <span className="opacity-50">•</span>
            <span>XP: <strong className="text-text-primary">{progress.xp}</strong></span>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 hover:border-white/30 transition-all font-medium text-sm group shadow-[0_0_15px_rgba(255,255,255,0.02)]"
          >
            <LogOut className="w-5 h-5 text-text-muted group-hover:text-white group-hover:-translate-x-1 transition-all" /> 
            <span className="hidden sm:inline">Logout</span>
          </button>
          <button 
            onClick={() => navigate('/codex')}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 hover:border-accent-purple/30 transition-all font-medium text-sm group shadow-[0_0_15px_rgba(255,255,255,0.02)]"
          >
            <Book className="w-5 h-5 text-accent-purple group-hover:scale-110 transition-transform" /> 
            <span className="hidden sm:inline">Open Codex</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto flex flex-col gap-16 relative z-10">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {realms.map((realm, idx) => {
            const status = progress.realms[realm.id]?.status || 'not_started';
            const highScore = progress.realms[realm.id]?.highScore || 0;

            return (
              <Card 
                key={realm.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 relative overflow-hidden group transition-all duration-500 border border-white/5 ${realm.isUnlocked ? 'cursor-pointer hover:border-accent-cyan/30 hover:shadow-[0_0_30px_rgba(95,179,201,0.1)] bg-bg-elevated/60 backdrop-blur-md' : 'opacity-40 cursor-not-allowed bg-black/20'}`}
                onClick={() => realm.isUnlocked && navigate(`/realm/${realm.id}`)}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-accent-cyan text-sm font-mono tracking-widest uppercase">Realm 0{idx + 1}</span>
                    {realm.isUnlocked ? (
                      <Compass className={`w-5 h-5 transition-transform duration-700 ${status === 'completed' ? 'text-accent-emerald' : 'text-accent-gold group-hover:rotate-45'}`} />
                    ) : (
                      <Lock className="text-text-muted w-5 h-5" />
                    )}
                  </div>
                  <h2 className="text-3xl font-serif mb-2 drop-shadow-sm">{realm.title}</h2>
                  <p className="text-text-secondary text-lg mb-6">{realm.subtitle}</p>
                  
                  {realm.isUnlocked && (
                    <div className="flex items-center justify-between opacity-70 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 text-sm font-medium text-accent-gold translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                        {status === 'completed' ? 'Re-enter Realm' : 'Enter Realm'} <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                      {highScore > 0 && (
                        <div className="text-xs font-mono px-2 py-1 rounded bg-black/30 border border-white/5 text-text-muted">
                          Best: {highScore}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Ambient Card Background */}
                {realm.isUnlocked && (
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent-cyan/5 blur-[50px] rounded-full group-hover:scale-150 group-hover:bg-accent-cyan/10 transition-all duration-700" />
                )}
              </Card>
            );
          })}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-accent-gold" />
            <h2 className="text-2xl font-serif text-white/90">Your Legacy (Relics)</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(RELICS_DB).map(([id, relic]) => {
              const unlocked = progress.relics.includes(id);
              
              return (
                <div key={id} className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col gap-3 ${unlocked ? 'bg-bg-elevated/80 border-white/10 shadow-lg' : 'bg-black/20 border-white/5 opacity-50 grayscale'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${unlocked ? 'border-current bg-current/10 ' + relic.color : 'border-white/10 text-white/30'}`}>
                    {unlocked ? relic.icon : <Lock className="w-5 h-5 text-white/30" />}
                  </div>
                  <div>
                    <h3 className={`font-serif text-lg tracking-wide ${unlocked ? 'text-white' : 'text-text-muted'}`}>{relic.title}</h3>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">{relic.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
