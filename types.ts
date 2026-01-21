
export enum Dosha {
  VATA = 'Vata',
  PITTA = 'Pitta',
  KAPHA = 'Kapha',
  UNKNOWN = 'Unknown'
}

export interface PrakritiScore {
  [Dosha.VATA]: number;
  [Dosha.PITTA]: number;
  [Dosha.KAPHA]: number;
}

export interface AssessmentRecord {
  id: string;
  timestamp: string;
  type: 'Baseline' | 'Current';
  scores: PrakritiScore;
  answers: Record<string, Dosha>;
  dominant: Dosha;
}

export interface SkinAnalysisResult {
  texture: string;
  moisture: string;
  prakritiMarkers: string[];
  suggestions: string[];
  imageUrl: string;
}

export interface UserProfile {
  name: string;
  dob: string;
  birthPlace: string;
  currentLocation: string;
  prakriti: Dosha;
  prakritiScores: PrakritiScore;
  assessmentHistory: AssessmentRecord[];
  skinAnalysis?: SkinAnalysisResult;
  lastUpdated: string;
}

export interface HealthVital {
  id: string;
  type: 'BP' | 'Sugar' | 'HeartRate' | 'Weight' | 'Height';
  value: number;
  secondary?: number; // Diastolic for BP
  timestamp: string;
  notes?: string;
}

export interface LifestylePlanItem {
  id: string;
  category: 'Diet' | 'Movement' | 'Breath' | 'Routine' | 'Custom';
  title: string;
  description: string;
  benefits: string;
  isPlanned: boolean;
  completedAt?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export enum GuidanceMode {
  MODERN = 'Modern',
  TRADITIONAL = 'Traditional',
  INTEGRATED = 'Integrated'
}
