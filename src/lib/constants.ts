import type { TuningMode } from '../types/tuner';

export const STANDARD_TUNING: TuningMode = {
  name: 'Standard',
  strings: [
    { number: 6, note: 'E2', frequency: 82.41, detectionRange: [70, 95], harmonics: [165, 247, 330] },
    { number: 5, note: 'A2', frequency: 110.00, detectionRange: [95, 125], harmonics: [220, 330, 440] },
    { number: 4, note: 'D3', frequency: 146.83, detectionRange: [125, 165], harmonics: [294, 440, 587] },
    { number: 3, note: 'G3', frequency: 196.00, detectionRange: [165, 220], harmonics: [392, 588, 784] },
    { number: 2, note: 'B3', frequency: 246.94, detectionRange: [220, 280], harmonics: [494, 741, 988] },
    { number: 1, note: 'E4', frequency: 329.63, detectionRange: [280, 370], harmonics: [659, 989, 1319] }
  ]
};

export const TUNING_MODES: TuningMode[] = [
  STANDARD_TUNING,
  {
    name: 'Drop D',
    strings: [
      { number: 6, note: 'D2', frequency: 73.42, detectionRange: [60, 85], harmonics: [147, 220, 294] },
      { number: 5, note: 'A2', frequency: 110.00, detectionRange: [95, 125], harmonics: [220, 330, 440] },
      { number: 4, note: 'D3', frequency: 146.83, detectionRange: [125, 165], harmonics: [294, 440, 587] },
      { number: 3, note: 'G3', frequency: 196.00, detectionRange: [165, 220], harmonics: [392, 588, 784] },
      { number: 2, note: 'B3', frequency: 246.94, detectionRange: [220, 280], harmonics: [494, 741, 988] },
      { number: 1, note: 'E4', frequency: 329.63, detectionRange: [280, 370], harmonics: [659, 989, 1319] }
    ]
  },
  {
    name: 'Half Step Down',
    strings: [
      { number: 6, note: 'Eb2', frequency: 77.78, detectionRange: [65, 90], harmonics: [156, 233, 311] },
      { number: 5, note: 'Ab2', frequency: 103.83, detectionRange: [90, 118], harmonics: [208, 312, 415] },
      { number: 4, note: 'Db3', frequency: 138.59, detectionRange: [118, 156], harmonics: [277, 415, 554] },
      { number: 3, note: 'Gb3', frequency: 185.00, detectionRange: [156, 208], harmonics: [370, 555, 740] },
      { number: 2, note: 'Bb3', frequency: 233.08, detectionRange: [208, 264], harmonics: [466, 699, 932] },
      { number: 1, note: 'Eb4', frequency: 311.13, detectionRange: [264, 350], harmonics: [622, 933, 1244] }
    ]
  }
];

export const PRECISION_LEVELS = {
  perfect: { tolerance: 0.5, name: 'Perfect' },
  excellent: { tolerance: 1.0, name: 'Excellent' },
  good: { tolerance: 2.0, name: 'Good' },
  ok: { tolerance: 3.0, name: 'OK' }
};

export const AUDIO_CONFIG = {
  sampleRate: 48000,
  fftSize: 16384,
  smoothingTimeConstant: 0.8,
  minDecibels: -90,
  maxDecibels: -10,
  noiseGateThreshold: -40
};