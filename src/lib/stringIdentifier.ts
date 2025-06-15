import type { GuitarString, TuningMode } from '../types/tuner';

export class StringIdentifier {
  private tuningMode: TuningMode;
  private history: number[] = [];
  private readonly historySize = 10;

  constructor(tuningMode: TuningMode) {
    this.tuningMode = tuningMode;
  }

  identifyString(frequency: number, harmonics: number[] = []): number | null {
    if (frequency < 50 || frequency > 400) return null;

    const candidates = this.findCandidateStrings(frequency);
    
    if (candidates.length === 0) return null;
    if (candidates.length === 1) return candidates[0].number;

    const bestCandidate = this.selectBestCandidate(frequency, candidates, harmonics);
    
    if (bestCandidate) {
      this.updateHistory(bestCandidate.number);
      return bestCandidate.number;
    }

    return null;
  }

  private findCandidateStrings(frequency: number): GuitarString[] {
    return this.tuningMode.strings.filter(string => {
      const [min, max] = string.detectionRange;
      return frequency >= min && frequency <= max;
    });
  }

  private selectBestCandidate(
    frequency: number, 
    candidates: GuitarString[], 
    harmonics: number[]
  ): GuitarString | null {
    let bestCandidate: GuitarString | null = null;
    let bestScore = -1;

    for (const candidate of candidates) {
      const score = this.calculateScore(frequency, candidate, harmonics);
      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }

    return bestScore > 0.5 ? bestCandidate : null;
  }

  private calculateScore(
    frequency: number, 
    candidate: GuitarString, 
    harmonics: number[]
  ): number {
    let score = 0;

    const frequencyDeviation = Math.abs(frequency - candidate.frequency) / candidate.frequency;
    const frequencyScore = Math.max(0, 1 - frequencyDeviation * 10);
    score += frequencyScore * 0.6;

    const harmonicScore = this.calculateHarmonicScore(harmonics, candidate.harmonics);
    score += harmonicScore * 0.3;

    const historyScore = this.calculateHistoryScore(candidate.number);
    score += historyScore * 0.1;

    return score;
  }

  private calculateHarmonicScore(detectedHarmonics: number[], expectedHarmonics: number[]): number {
    if (detectedHarmonics.length === 0) return 0;

    let matches = 0;
    for (const expected of expectedHarmonics) {
      const tolerance = expected * 0.05;
      const hasMatch = detectedHarmonics.some(detected => 
        Math.abs(detected - expected) < tolerance
      );
      if (hasMatch) matches++;
    }

    return matches / expectedHarmonics.length;
  }

  private calculateHistoryScore(stringNumber: number): number {
    const recentOccurrences = this.history.slice(-5).filter(n => n === stringNumber).length;
    return recentOccurrences / 5;
  }

  private updateHistory(stringNumber: number): void {
    this.history.push(stringNumber);
    if (this.history.length > this.historySize) {
      this.history.shift();
    }
  }

  setTuningMode(tuningMode: TuningMode): void {
    this.tuningMode = tuningMode;
    this.history = [];
  }

  reset(): void {
    this.history = [];
  }

  getConfidence(stringNumber: number): number {
    const recentHistory = this.history.slice(-5);
    const consistency = recentHistory.filter(n => n === stringNumber).length / recentHistory.length;
    return consistency;
  }
}