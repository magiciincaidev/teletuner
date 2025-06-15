import { AUDIO_CONFIG } from './constants';

export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Float32Array | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)({
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
        },
        video: false
      });

      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio processor:', error);
      
      let errorMessage = 'オーディオの初期化に失敗しました';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'マイクのアクセスが拒否されました。ブラウザの設定でマイクを許可してください。';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'マイクが見つかりません。マイクが接続されているか確認してください。';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'このブラウザではマイクがサポートされていません。';
        } else if (error.message.includes('getUserMedia')) {
          errorMessage = 'マイクアクセスがサポートされていません。HTTPS接続が必要です。';
        }
      }
      
      throw new Error(errorMessage);
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