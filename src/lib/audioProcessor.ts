import { AUDIO_CONFIG } from './constants';

export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Float32Array | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    try {
      this.audioContext = new AudioContext({
        sampleRate: AUDIO_CONFIG.sampleRate
      });

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = AUDIO_CONFIG.fftSize;
      this.analyser.smoothingTimeConstant = AUDIO_CONFIG.smoothingTimeConstant;
      this.analyser.minDecibels = AUDIO_CONFIG.minDecibels;
      this.analyser.maxDecibels = AUDIO_CONFIG.maxDecibels;

      this.dataArray = new Float32Array(this.analyser.frequencyBinCount);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: AUDIO_CONFIG.sampleRate
        }
      });

      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio processor:', error);
      throw error;
    }
  }

  getFrequencyData(): Float32Array | null {
    if (!this.analyser || !this.dataArray) return null;
    
    this.analyser.getFloatFrequencyData(this.dataArray);
    return this.dataArray;
  }

  getTimeDomainData(): Float32Array | null {
    if (!this.analyser || !this.dataArray) return null;
    
    const timeDomainData = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(timeDomainData);
    return timeDomainData;
  }

  getSampleRate(): number {
    return this.audioContext?.sampleRate || AUDIO_CONFIG.sampleRate;
  }

  getFFTSize(): number {
    return this.analyser?.fftSize || AUDIO_CONFIG.fftSize;
  }

  isReady(): boolean {
    return this.isInitialized && !!this.audioContext && !!this.analyser;
  }

  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  destroy(): void {
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }
    
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.dataArray = null;
    this.isInitialized = false;
  }
}