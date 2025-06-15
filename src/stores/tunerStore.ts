import { create } from 'zustand';
import type { TunerState, TuningMode, TuningResult, TunerSettings } from '../types/tuner';
import { STANDARD_TUNING } from '../lib/constants';

interface TunerStore {
  // State
  state: TunerState;
  currentMode: TuningMode;
  selectedString: number | null;
  tuningResult: TuningResult | null;
  settings: TunerSettings;
  isPermissionGranted: boolean;
  error: string | null;
  
  // Actions
  setState: (state: TunerState) => void;
  setTuningMode: (mode: TuningMode) => void;
  setSelectedString: (stringNumber: number | null) => void;
  setTuningResult: (result: TuningResult | null) => void;
  updateSettings: (settings: Partial<TunerSettings>) => void;
  setPermissionGranted: (granted: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTunerStore = create<TunerStore>((set) => ({
  // Initial state
  state: 'idle',
  currentMode: STANDARD_TUNING,
  selectedString: null,
  tuningResult: null,
  settings: {
    sampleRate: 48000,
    fftSize: 16384,
    smoothingFactor: 0.8,
    noiseGate: -40,
    algorithm: 'autocorrelation',
    precisionLevel: 'excellent'
  },
  isPermissionGranted: false,
  error: null,

  // Actions
  setState: (state) => set({ state }),
  
  setTuningMode: (mode) => set({ 
    currentMode: mode,
    selectedString: null,
    tuningResult: null 
  }),
  
  setSelectedString: (stringNumber) => set({ 
    selectedString: stringNumber,
    tuningResult: null 
  }),
  
  setTuningResult: (result) => set({ tuningResult: result }),
  
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
  
  setPermissionGranted: (granted) => set({ isPermissionGranted: granted }),
  
  setError: (error) => set({ error }),
  
  reset: () => set({
    state: 'idle',
    selectedString: null,
    tuningResult: null,
    error: null
  })
}));