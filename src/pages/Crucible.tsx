import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, Loader2, Sparkles, AlertCircle, Save, History, Settings2, Code, FileText } from 'lucide-react';
import { Oracle } from '../components/Oracle';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { v4 as uuidv4 } from 'uuid';
import { CrucibleAttempt, CrucibleScores } from '../types';

export default function Crucible() {
  const { realmId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateRealmProgress, addXp, saveArtifact, artifacts, unlockRelic } = useStore();
  
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isWeaving, setIsWeaving] = useState(false);
  const [score, setScore] = useState<CrucibleScores | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Params & History
  const [history, setHistory] = useState<CrucibleAttempt[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showParams, setShowParams] = useState(false);
  const [params, setParams] = useState({ temperature: 0.7, maxTokens: 1024, topP: 0.95 });
  const [echoMode, setEchoMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Parse `load` query param on mount to pre-load a specific prompt/artifact
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const loadId = searchParams.get('load');
    if (loadId) {
      const artifact = artifacts.find(a => a.id === loadId);
      if (artifact) setPrompt(artifact.prompt);
    }
  }, [location.search, artifacts]);

  const handleWeave = async () => {
    if (!prompt.trim()) return;
    setIsWeaving(true);
    setOutput('');
    setScore(null);
    setIsSaved(false);
    setShowHistory(false);
    setShowParams(false);

    if (echoMode) {
      unlockRelic('echo-chamber');
    }

    try {
      const response = await fetch('/api/crucible', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, parameters: params, echoMode }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let bufferedOutput = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.text) {
                bufferedOutput += data.text;
                setOutput(bufferedOutput);
              }
            } catch (e) {
              // Parse error on chunk
            }
          }
        }
      }

      await evaluateOutput(prompt, bufferedOutput);

    } catch (e) {
      console.error(e);
      setOutput((prev) => prev + "\n\n*The loom tangled... Connection interrupted.*");
    } finally {
      setIsWeaving(false);
    }
  };

  const evaluateOutput = async (p: string, o: string) => {
    setIsEvaluating(true);
    if (history.length === 0) {
      unlockRelic('first-weave');
    }
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: p, output: o })
      });
      const data = await res.json();
      setScore(data);
      
      const overall = Math.round((data.quality + data.efficiency + data.creativity + data.faithfulness + (data.clarity || 80)) / 5);
      if (overall >= 90) {
        unlockRelic('high-score');
      }
      
      if (realmId && overall > 60) {
        updateRealmProgress(realmId, 'completed', overall);
        addXp(100);
      } else if (realmId) {
        updateRealmProgress(realmId, 'in_progress', overall);
        addXp(10);
      }

      // Save to local session history
      const newAttempt: CrucibleAttempt = {
        id: uuidv4(),
        prompt: p,
        output: o,
        score: data,
        timestamp: Date.now(),
        parameters: params
      };
      setHistory(prev => [newAttempt, ...prev]);

    } catch (e) {
      console.error("Evaluation failed", e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSaveToCodex = () => {
    if (!output || !prompt) return;
    saveArtifact({
      id: uuidv4(),
      title: `Draft from ${realmId || 'Sandbox'}`,
      prompt,
      output,
      score,
      realmId: realmId || null,
      notes: '',
      tags: [realmId || 'practice'],
      createdAt: Date.now()
    });
    setIsSaved(true);
    unlockRelic('codex-scholar');
  };

  const loadHistoryItem = (item: CrucibleAttempt) => {
    setPrompt(item.prompt);
    setOutput(item.output);
    setScore(item.score);
    setParams(item.parameters);
    setShowHistory(false);
    setIsSaved(false);
  };

  return (
    <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden">
      {/* Sidebar for Oracle */}
      <Oracle />

      {/* Main Crucible Area */}
      <main className="flex-1 flex flex-col p-4 md:p-6 h-full ml-auto overflow-y-auto">
        <header className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/realm/${realmId}`)} 
              className="text-text-secondary hover:text-accent-gold px-3 py-1.5 transition-colors bg-white/5 border border-white/10 hover:border-accent-gold/40 hover:bg-accent-gold/10 rounded-lg shadow-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> <span className="hidden md:inline text-sm font-medium">Go Back</span>
            </button>
            <div>
               <h1 className="text-2xl font-serif text-accent-gold hidden md:block">The Crucible</h1>
               <div className="text-xs text-text-muted font-mono uppercase tracking-widest">{realmId} Realm</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {setShowHistory(!showHistory); setShowParams(false);}} 
              className={`p-2 rounded flex items-center gap-2 text-sm transition-colors border ${showHistory ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-text-muted hover:text-white border-transparent'}`}
            >
              <History className="w-4 h-4" /> <span className="hidden md:inline">Branches</span> ({history.length})
            </button>
            <button 
              onClick={() => {setShowParams(!showParams); setShowHistory(false);}} 
              className={`p-2 rounded flex items-center gap-2 text-sm transition-colors border ${showParams ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-text-muted hover:text-white border-transparent'}`}
            >
              <Settings2 className="w-4 h-4" /> <span className="hidden md:inline">Parameters</span>
            </button>
            <button 
              onClick={() => setEchoMode(!echoMode)} 
              className={`p-2 rounded flex items-center gap-2 text-sm transition-colors border ${echoMode ? 'bg-accent-purple/20 text-accent-purple border-accent-purple/30' : 'bg-transparent text-text-muted hover:text-white border-transparent'}`}
              title="Toggle Chain-of-Thought (Echo Mode)"
            >
               Echo {echoMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </header>

        {/* Floating Parameter Panel */}
        <AnimatePresence>
          {showParams && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4">
              <Card className="p-4 bg-bg-elevated/90 flex flex-wrap gap-6 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-text-secondary font-mono tracking-widest uppercase">Temperature: {params.temperature.toFixed(2)}</label>
                  </div>
                  <input type="range" min="0" max="2" step="0.1" value={params.temperature} onChange={(e) => setParams({...params, temperature: parseFloat(e.target.value)})} className="w-full accent-accent-cyan" />
                </div>
                 <div className="flex-1 min-w-[200px]">
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-text-secondary font-mono tracking-widest uppercase">Max Tokens: {params.maxTokens}</label>
                  </div>
                  <input type="range" min="256" max="4096" step="256" value={params.maxTokens} onChange={(e) => setParams({...params, maxTokens: parseInt(e.target.value, 10)})} className="w-full accent-accent-cyan" />
                </div>
                 <div className="flex-1 min-w-[200px]">
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-text-secondary font-mono tracking-widest uppercase">Top P: {params.topP.toFixed(2)}</label>
                  </div>
                  <input type="range" min="0" max="1" step="0.05" value={params.topP} onChange={(e) => setParams({...params, topP: parseFloat(e.target.value)})} className="w-full accent-accent-cyan" />
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating History Panel */}
        <AnimatePresence>
          {showHistory && history.length > 0 && (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
               <Card className="p-2 flex gap-2 overflow-x-auto custom-scrollbar">
                 {history.map((h, i) => {
                   const overall = h.score ? Math.round((h.score.quality + h.score.efficiency + h.score.creativity + h.score.faithfulness + h.score.clarity) / 5) : 0;
                   return (
                     <button key={h.id} onClick={() => loadHistoryItem(h)} className="flex-shrink-0 text-left p-3 rounded bg-black/20 hover:bg-black/40 border border-white/5 w-64 transition-colors relative">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-xs text-accent-cyan font-mono">Attempt {history.length - i}</span>
                         {overall > 0 && <span className="text-xs text-accent-gold flex items-center gap-1"><Sparkles className="w-3 h-3"/> {overall}</span>}
                       </div>
                       <p className="text-sm text-text-secondary line-clamp-2">{h.prompt}</p>
                     </button>
                   );
                 })}
               </Card>
             </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[800px] lg:min-h-0">
          
          {/* Editor Side */}
          <Card className="flex flex-col flex-1 lg:w-1/2 bg-[#0a0b10] border-white/5 shadow-2xl relative overflow-hidden group min-h-[400px] lg:min-h-0">
            <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-20">
              <Sparkles className="w-24 h-24 text-accent-cyan" />
            </div>
            
            <div className="p-3 border-b border-white/5 flex items-center justify-between bg-[#12131a]">
              <span className="font-mono text-xs text-text-secondary uppercase tracking-widest flex items-center gap-2"><Code className="w-4 h-4"/> The Weave (Prompt)</span>
              <div className="flex gap-4 items-center">
                 <span className="text-xs text-text-muted">{prompt.length} chars</span>
              </div>
            </div>

            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleWeave();
                }
              }}
              placeholder="Weave your prompt here... Be explicit, utilize formatting, and provide context. Press Cmd/Ctrl+Enter to cast."
              className="flex-1 bg-transparent p-6 outline-none resize-none font-mono text-sm md:text-base leading-relaxed text-text-primary placeholder:text-text-muted custom-scrollbar"
            />
            
            <div className="p-4 border-t border-white/5 flex justify-between items-center bg-[#12131a]">
               <div className="text-xs text-text-muted hidden md:block">Press <kbd className="bg-black/30 px-2 py-1 rounded">Cmd ↵</kbd> to weave</div>
              <Button onClick={handleWeave} disabled={isWeaving || !prompt.trim()} className="w-full md:w-auto">
                {isWeaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Weave Reality</>}
              </Button>
            </div>
          </Card>

          {/* Output & Evaluation Side */}
          <div className="flex flex-col flex-1 lg:w-1/2 min-h-[400px] lg:min-h-0 lg:h-full gap-4">
            <Card className="flex-1 flex flex-col min-h-0 border-white/5 bg-[#12131a] overflow-hidden">
              <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/20">
                <span className="font-mono text-xs text-text-secondary uppercase tracking-widest flex items-center gap-2"><FileText className="w-4 h-4"/> Manifestation</span>
                <div className="flex items-center gap-3">
                  {isWeaving && <span className="flex items-center gap-2 text-accent-cyan text-xs"><Loader2 className="w-3 h-3 animate-spin"/> Weaving...</span>}
                  {output && !isWeaving && (
                    <button 
                      onClick={handleSaveToCodex} 
                      disabled={isSaved}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-all ${isSaved ? 'bg-accent-emerald/20 text-accent-emerald' : 'bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30'}`}
                    >
                      <Save className="w-3 h-3" /> {isSaved ? 'Saved to Codex' : 'Save'}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-[#0a0b10] custom-scrollbar">
                {output ? (
                  <div className="prose prose-invert max-w-none text-sm font-sans leading-relaxed text-text-secondary markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="text-text-muted italic flex items-center justify-center h-full opacity-50">The woven output will manifest here...</span>
                )}
              </div>
            </Card>

            <AnimatePresence>
              {(isEvaluating || score) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="p-5 border-accent-gold/20 bg-accent-gold/5 flex flex-col border shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent-gold/10 blur-3xl" />
                    
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                      <AlertCircle className="w-5 h-5 text-accent-gold" />
                      <h3 className="font-serif text-lg text-accent-gold tracking-wide">Oracle's Evaluation</h3>
                      {isEvaluating && <Loader2 className="w-4 h-4 animate-spin ml-auto text-accent-gold" />}
                    </div>

                    {score && (
                      <div className="space-y-4 relative z-10">
                        <div className="grid grid-cols-5 gap-2 md:gap-3">
                          {[
                            { label: 'Quality', val: score.quality },
                            { label: 'Efficient', val: score.efficiency },
                            { label: 'Creative', val: score.creativity },
                            { label: 'Faithful', val: score.faithfulness },
                            { label: 'Clarity', val: score.clarity }
                          ].map(s => (
                            <div key={s.label} className="bg-black/30 rounded-lg p-2 text-center border border-white/5">
                              <div className="text-[10px] md:text-[11px] text-text-muted mb-1 font-mono uppercase tracking-wider">{s.label}</div>
                              <div className={`text-lg md:text-xl font-semibold ${s.val > 80 ? 'text-accent-emerald drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]' : s.val > 60 ? 'text-accent-gold' : 'text-text-secondary'}`}>
                                {s.val}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-text-secondary p-4 bg-black/40 rounded-lg border-l-2 border-accent-gold leading-relaxed font-serif italic">
                          "{score.feedback}"
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
