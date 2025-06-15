export class PitchDetector {
  private sampleRate: number;

  constructor(sampleRate: number, bufferSize: number = 16384) {
    this.sampleRate = sampleRate;
    // bufferSize is available for future use
    console.debug('PitchDetector initialized with bufferSize:', bufferSize);
  }

  detectPitch(timeDomainData: Float32Array): number | null {
    const frequency = this.autocorrelation(timeDomainData);
    return frequency > 50 && frequency < 2000 ? frequency : null;
  }

  private autocorrelation(buffer: Float32Array): number {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;
    let foundGoodCorrelation = false;
    const GOOD_ENOUGH_CORRELATION = 0.9;

    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    
    if (rms < 0.01) return -1;

    let lastCorrelation = 1;
    for (let offset = 1; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;

      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs((buffer[i]) - (buffer[i + offset]));
      }
      correlation = 1 - (correlation / MAX_SAMPLES);
      
      if (correlation > GOOD_ENOUGH_CORRELATION && correlation > lastCorrelation) {
        foundGoodCorrelation = true;
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      } else if (foundGoodCorrelation) {
        const shift = (this.parabolicInterpolation(correlation, lastCorrelation, bestCorrelation));
        return this.sampleRate / (bestOffset + shift);
      }
      lastCorrelation = correlation;
    }
    
    if (bestCorrelation > 0.01) {
      return this.sampleRate / bestOffset;
    }
    return -1;
  }

  private parabolicInterpolation(a: number, b: number, c: number): number {
    const bottom = 2 * (2 * b - c - a);
    if (bottom === 0) return 0;
    return (c - a) / bottom;
  }

  detectPitchYIN(buffer: Float32Array, threshold: number = 0.1): number | null {
    const yinBuffer = new Float32Array(buffer.length / 2);
    
    yinBuffer[0] = 1;
    
    let runningSum = 0;
    for (let tau = 1; tau < yinBuffer.length; tau++) {
      yinBuffer[tau] = 0;
      for (let i = 0; i < yinBuffer.length; i++) {
        const delta = buffer[i] - buffer[i + tau];
        yinBuffer[tau] += delta * delta;
      }
      
      runningSum += yinBuffer[tau];
      yinBuffer[tau] *= tau / runningSum;
      
      if (yinBuffer[tau] < threshold) {
        let betterTau = tau;
        let betterValue = yinBuffer[tau];
        
        for (let x = tau + 1; x < yinBuffer.length && yinBuffer[x] < threshold; x++) {
          if (yinBuffer[x] < betterValue) {
            betterValue = yinBuffer[x];
            betterTau = x;
          }
        }
        
        return this.sampleRate / betterTau;
      }
    }
    
    return null;
  }

  getFrequencyBin(frequency: number, sampleRate: number, fftSize: number): number {
    return Math.round(frequency * fftSize / sampleRate);
  }

  getRMSAmplitude(buffer: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
  }
}