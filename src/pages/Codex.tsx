import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useStore } from '../store';
import { Card } from '../components/ui/Card';
import { ArrowLeft, Search, Bookmark, Copy, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Codex() {
  const navigate = useNavigate();
  const { artifacts, deleteArtifact, updateArtifact } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editNoteContent, setEditNoteContent] = useState('');

  const filteredArtifacts = artifacts.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveNotes = (id: string) => {
    updateArtifact(id, { notes: editNoteContent });
    setIsEditingNotes(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col relative overflow-hidden">
      <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-accent-purple/10 blur-[150px] rounded-full pointer-events-none" />
      
      <header className="p-8 border-b border-white/5 bg-bg-secondary/40 backdrop-blur-md sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/hub')}
            className="text-text-secondary hover:text-white transition-colors flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-medium">Go Back</span>
          </button>
          <h1 className="text-3xl font-serif">The Codex</h1>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search spells and lore..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-accent-purple/50 transition-colors text-sm"
          />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex gap-8">
        {/* List of artifacts */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 pb-12 custom-scrollbar">
          {filteredArtifacts.length === 0 ? (
            <div className="text-center p-8 text-text-muted border border-white/5 rounded-xl bg-bg-elevated/30 border-dashed">
              <Bookmark className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No artifacts found.</p>
              <p className="text-xs mt-2">Save attempts from the Crucible to build your Codex.</p>
            </div>
          ) : (
            filteredArtifacts.map((artifact, idx) => (
              <motion.div
                key={artifact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card 
                  onClick={() => setSelectedArtifact(artifact.id)}
                  className={`p-4 cursor-pointer transition-all ${selectedArtifact === artifact.id ? 'border-accent-purple bg-accent-purple/5 shadow-[0_0_20px_rgba(124,108,255,0.1)]' : 'hover:border-white/20'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-lg text-accent-gold truncate pr-4">{artifact.title}</h3>
                    {artifact.score && (
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-black/40 border border-white/10 whitespace-nowrap">
                        {Math.round((artifact.score.quality + artifact.score.efficiency + artifact.score.creativity + artifact.score.faithfulness) / 4)} ✦
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2 mb-3">{artifact.notes || artifact.prompt}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {artifact.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                        {tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-text-muted ml-auto">
                      {new Date(artifact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Selected Artifact Detail */}
        <div className="hidden md:flex flex-1">
          {selectedArtifact ? (() => {
            const artifact = artifacts.find(a => a.id === selectedArtifact);
            if (!artifact) return null;
            return (
              <Card className="flex-1 flex flex-col bg-bg-elevated/80 border-white/10 p-0 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
                  <h2 className="text-2xl font-serif text-accent-gold">{artifact.title}</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/crucible/${artifact.realmId || 'loom'}?load=${artifact.id}`)}
                      className="p-2 bg-accent-cyan/10 text-accent-cyan rounded hover:bg-accent-cyan/20 transition-colors tooltip flex items-center gap-2 text-sm px-3"
                      title="Load into Crucible"
                    >
                      <ExternalLink className="w-4 h-4" /> Load
                    </button>
                    <button 
                      onClick={() => deleteArtifact(artifact.id)}
                      className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                      title="Delete Artifact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="group">
                    <div className="flex items-center justify-between mb-2">
                       <h4 className="text-xs font-mono uppercase tracking-widest text-text-muted">Weaver's Notes</h4>
                       {!isEditingNotes && (
                         <button 
                           onClick={() => { setEditNoteContent(artifact.notes || ''); setIsEditingNotes(true); }}
                           className="text-xs text-text-muted hover:text-accent-gold opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           Edit
                         </button>
                       )}
                    </div>
                    {isEditingNotes ? (
                      <div className="space-y-2">
                        <textarea
                          value={editNoteContent}
                          onChange={(e) => setEditNoteContent(e.target.value)}
                          className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-text-primary outline-none focus:border-accent-purple/50 min-h-[100px] resize-y custom-scrollbar"
                          placeholder="Add your reflections..."
                        />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setIsEditingNotes(false)} className="px-3 py-1 text-xs rounded hover:bg-white/5 transition-colors">Cancel</button>
                          <button onClick={() => handleSaveNotes(artifact.id)} className="px-3 py-1 text-xs rounded bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30 transition-colors">Save</button>
                        </div>
                      </div>
                    ) : (
                      artifact.notes ? (
                        <div className="p-4 rounded-lg bg-black/20 border border-white/5 text-sm text-text-secondary italic font-serif">
                          "{artifact.notes}"
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg bg-black/10 border border-dashed border-white/10 text-sm text-text-muted/50 italic">
                          No notes recorded for this artifact.
                        </div>
                      )
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">The Prompt</h4>
                    <div className="p-4 rounded-lg bg-[#0a0b10] border border-white/5 relative group font-mono text-sm whitespace-pre-wrap">
                      <button onClick={() => navigator.clipboard.writeText(artifact.prompt)} className="absolute top-2 right-2 p-1.5 bg-white/5 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {artifact.prompt}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">The Manifestation (Output)</h4>
                    <div className="p-4 rounded-lg bg-[#0a0b10] border border-white/5 relative group text-sm prose prose-invert max-w-none">
                       <button onClick={() => navigator.clipboard.writeText(artifact.output)} className="absolute top-2 right-2 p-1.5 bg-white/5 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <div className="markdown-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{artifact.output}</ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  {artifact.score && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">Evaluation</h4>
                      <div className="grid grid-cols-5 gap-2 mb-2">
                         {[
                            { label: 'Quality', val: artifact.score.quality },
                            { label: 'Efficiency', val: artifact.score.efficiency },
                            { label: 'Creativity', val: artifact.score.creativity },
                            { label: 'Faithful', val: artifact.score.faithfulness },
                            { label: 'Clarity', val: artifact.score.clarity || 0 }
                          ].map(s => (
                            <div key={s.label} className="bg-black/30 rounded border border-white/5 p-2 text-center">
                              <div className="text-[10px] text-text-muted mb-0.5">{s.label}</div>
                              <div className="text-lg font-medium text-accent-gold">{s.val}</div>
                            </div>
                          ))}
                      </div>
                      <p className="text-xs text-text-secondary bg-black/20 p-3 rounded border-l-2 border-accent-gold">
                        {artifact.score.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )
          })() : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted border border-white/5 rounded-xl bg-bg-elevated/30 border-dashed">
              <Bookmark className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-serif">Select an artifact to view its secrets.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
