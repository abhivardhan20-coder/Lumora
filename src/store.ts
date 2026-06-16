import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CodexArtifact, CrucibleAttempt } from './types';

export type RealmStatus = 'not_started' | 'in_progress' | 'completed';

export interface UserProgress {
  level: number;
  xp: number;
  realms: {
    [realmId: string]: {
      status: RealmStatus;
      highScore: number;
    }
  };
  relics: string[];
}

interface AppState {
  progress: UserProgress;
  artifacts: CodexArtifact[];
  hasSeenOnboarding: boolean;
  addXp: (amount: number) => void;
  updateRealmProgress: (realmId: string, status: RealmStatus, score?: number) => void;
  saveArtifact: (artifact: CodexArtifact) => void;
  deleteArtifact: (id: string) => void;
  updateArtifact: (id: string, updates: Partial<CodexArtifact>) => void;
  oracleMessage: string | null;
  setOracleMessage: (msg: string | null) => void;
  unlockRelic: (relicId: string) => void;
  completeOnboarding: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      progress: {
        level: 1,
        xp: 0,
        realms: {
          'loom': { status: 'not_started', highScore: 0 },
          'thread': { status: 'not_started', highScore: 0 },
          'pattern': { status: 'not_started', highScore: 0 },
          'mirror': { status: 'not_started', highScore: 0 },
        },
        relics: []
      },
      artifacts: [],
      hasSeenOnboarding: false,
      addXp: (amount) => set((state) => {
        const newXp = state.progress.xp + amount;
        const newLevel = Math.floor(newXp / 100) + 1;
        return {
          progress: {
            ...state.progress,
            xp: newXp,
            level: newLevel
          }
        };
      }),
      updateRealmProgress: (realmId, status, score) => set((state) => {
        const currentRealm = state.progress.realms[realmId];
        return {
          progress: {
            ...state.progress,
            realms: {
              ...state.progress.realms,
              [realmId]: {
                status,
                highScore: score ? Math.max(currentRealm?.highScore || 0, score) : (currentRealm?.highScore || 0)
              }
            }
          }
        };
      }),
      saveArtifact: (artifact) => set((state) => ({
        artifacts: [artifact, ...state.artifacts]
      })),
      deleteArtifact: (id) => set((state) => ({
        artifacts: state.artifacts.filter(a => a.id !== id)
      })),
      updateArtifact: (id, updates) => set((state) => ({
        artifacts: state.artifacts.map(a => a.id === id ? { ...a, ...updates } : a)
      })),
      unlockRelic: (relicId) => set((state) => ({
        progress: {
          ...state.progress,
          relics: state.progress.relics.includes(relicId) 
            ? state.progress.relics 
            : [...state.progress.relics, relicId]
        }
      })),
      oracleMessage: null,
      setOracleMessage: (msg) => set({ oracleMessage: msg }),
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
    }),
    {
      name: 'lumora-storage',
    }
  )
);
