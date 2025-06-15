export interface GuitarString {
  number: number;
  note: string;
  frequency: number;
  detectionRange: [number, number];
  harmonics: number[];
}

export interface TuningMode {
  name: string;
  strings: GuitarString[];
}

export interface AudioAnalysis {
  frequency: number;
  amplitude: number;
  clarity: number;
  detectedString?: number;
}

export interface TuningResult {
  string: number;
  targetFrequency: number;
  actualFrequency: number;
  cents: number;
  accuracy: 'perfect' | 'excellent' | 'good' | 'ok' | 'off';
  isStable: boolean;
}

export type TunerState = 'idle' | 'listening' | 'analyzing' | 'tuned';

export interface TunerSettings {
  sampleRate: number;
  fftSize: number;
  smoothingFactor: number;
  noiseGate: number;
  algorithm: 'autocorrelation' | 'yin' | 'fft';
  precisionLevel: 'perfect' | 'excellent' | 'good' | 'ok';
}