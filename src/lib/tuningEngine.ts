import type { TuningResult, GuitarString } from '../types/tuner';
import { PRECISION_LEVELS } from './constants';

export class TuningEngine {
  calculateCents(actualFrequency: number, targetFrequency: number): number {
    if (actualFrequency <= 0 || targetFrequency <= 0) return 0;
    return Math.round(1200 * Math.log2(actualFrequency / targetFrequency) * 10) / 10;
  }

  getTuningAccuracy(cents: number, precisionLevel: keyof typeof PRECISION_LEVELS): 'perfect' | 'excellent' | 'good' | 'ok' | 'off' {
    const absCents = Math.abs(cents);
    const tolerance = PRECISION_LEVELS[precisionLevel].tolerance;
    
    if (absCents <= tolerance * 0.5) return 'perfect';
    if (absCents <= tolerance) return 'excellent';
    if (absCents <= tolerance * 2) return 'good';
    if (absCents <= tolerance * 3) return 'ok';
    return 'off';
  }

  createTuningResult(
    detectedString: GuitarString,
    actualFrequency: number,
    isStable: boolean,
    precisionLevel: keyof typeof PRECISION_LEVELS = 'excellent'
  ): TuningResult {
    const cents = this.calculateCents(actualFrequency, detectedString.frequency);
    const accuracy = this.getTuningAccuracy(cents, precisionLevel);

    return {
      string: detectedString.number,
      targetFrequency: detectedString.frequency,
      actualFrequency,
      cents,
      accuracy,
      isStable
    };
  }

  isFrequencyStable(frequencies: number[], tolerance: number = 2): boolean {
    if (frequencies.length < 3) return false;
    
    const recent = frequencies.slice(-5);
    const average = recent.reduce((sum, freq) => sum + freq, 0) / recent.length;
    
    return recent.every(freq => Math.abs(freq - average) < tolerance);
  }

  filterNoise(frequency: number, amplitude: number, noiseThreshold: number = 0.01): boolean {
    return amplitude > noiseThreshold && frequency > 50 && frequency < 2000;
  }

  smoothFrequency(newFrequency: number, lastFrequency: number, smoothingFactor: number = 0.8): number {
    if (lastFrequency === 0) return newFrequency;
    return lastFrequency * smoothingFactor + newFrequency * (1 - smoothingFactor);
  }
}