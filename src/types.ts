export interface CrucibleScores {
  quality: number;
  efficiency: number;
  creativity: number;
  faithfulness: number;
  clarity: number;
  feedback: string;
}

export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface CrucibleAttempt {
  id: string;
  prompt: string;
  output: string;
  score: CrucibleScores | null;
  timestamp: number;
  parameters: {
    temperature: number;
    maxTokens: number;
    topP: number;
  };
}

export interface CodexArtifact {
  id: string;
  title: string;
  prompt: string;
  output: string;
  score: CrucibleScores | null;
  realmId: string | null;
  notes: string;
  tags: string[];
  createdAt: number;
}
