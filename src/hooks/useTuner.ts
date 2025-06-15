import { useEffect, useRef, useCallback } from 'react';
import { useTunerStore } from '../stores/tunerStore';
import { AudioProcessor } from '../lib/audioProcessor';
import { PitchDetector } from '../lib/pitchDetection';
import { StringIdentifier } from '../lib/stringIdentifier';
import { TuningEngine } from '../lib/tuningEngine';

export const useTuner = () => {
  const {
    state,
    currentMode,
    selectedString,
    settings,
    setState,
    setTuningResult,
    setPermissionGranted,
    setError
  } = useTunerStore();

  const audioProcessorRef = useRef<AudioProcessor | null>(null);
  const pitchDetectorRef = useRef<PitchDetector | null>(null);
  const stringIdentifierRef = useRef<StringIdentifier | null>(null);
  const tuningEngineRef = useRef<TuningEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const frequencyHistoryRef = useRef<number[]>([]);

  const initializeAudio = useCallback(async () => {
    try {
      setState('idle');
      setError(null);

      if (!audioProcessorRef.current) {
        audioProcessorRef.current = new AudioProcessor();
      }

      await audioProcessorRef.current.initialize();
      setPermissionGranted(true);

      if (!pitchDetectorRef.current) {
        pitchDetectorRef.current = new PitchDetector(
          audioProcessorRef.current.getSampleRate(),
          audioProcessorRef.current.getFFTSize()
        );
      }

      if (!stringIdentifierRef.current) {
        stringIdentifierRef.current = new StringIdentifier(currentMode);
      }

      if (!tuningEngineRef.current) {
        tuningEngineRef.current = new TuningEngine();
      }

      setState('listening');
      setTimeout(startAnalysis, 0);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'マイクのアクセスが許可されていません';
      setError(errorMessage);
      setPermissionGranted(false);
    }
  }, [currentMode, setState, setError, setPermissionGranted]);

  const startAnalysis = useCallback(() => {
    if (!audioProcessorRef.current || !pitchDetectorRef.current || !tuningEngineRef.current) {
      return;
    }

    const analyze = () => {
      if (state !== 'listening' && state !== 'analyzing') {
        return;
      }

      const timeDomainData = audioProcessorRef.current?.getTimeDomainData();
      if (!timeDomainData || !pitchDetectorRef.current || !tuningEngineRef.current) {
        animationFrameRef.current = requestAnimationFrame(analyze);
        return;
      }

      const amplitude = pitchDetectorRef.current.getRMSAmplitude(timeDomainData);
      
      if (!tuningEngineRef.current.filterNoise(0, amplitude, 0.01)) {
        setTuningResult(null);
        animationFrameRef.current = requestAnimationFrame(analyze);
        return;
      }

      setState('analyzing');

      let detectedFrequency: number | null = null;
      
      switch (settings.algorithm) {
        case 'yin':
          detectedFrequency = pitchDetectorRef.current.detectPitchYIN(timeDomainData, 0.1);
          break;
        case 'autocorrelation':
        default:
          detectedFrequency = pitchDetectorRef.current.detectPitch(timeDomainData);
          break;
      }

      if (detectedFrequency && detectedFrequency > 50) {
        frequencyHistoryRef.current.push(detectedFrequency);
        if (frequencyHistoryRef.current.length > 10) {
          frequencyHistoryRef.current.shift();
        }

        const smoothedFrequency = tuningEngineRef.current.smoothFrequency(
          detectedFrequency,
          frequencyHistoryRef.current[frequencyHistoryRef.current.length - 2] || 0,
          settings.smoothingFactor
        );

        let targetString: number | null = selectedString;
        
        if (!targetString && stringIdentifierRef.current) {
          targetString = stringIdentifierRef.current.identifyString(smoothedFrequency);
        }

        if (targetString) {
          const stringData = currentMode.strings.find(s => s.number === targetString);
          if (stringData) {
            const isStable = tuningEngineRef.current.isFrequencyStable(frequencyHistoryRef.current);
            const result = tuningEngineRef.current.createTuningResult(
              stringData,
              smoothedFrequency,
              isStable,
              settings.precisionLevel
            );
            setTuningResult(result);
          }
        } else {
          setTuningResult(null);
        }
      } else {
        setTuningResult(null);
      }

      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();
  }, [
    state,
    currentMode,
    selectedString,
    settings,
    setState,
    setTuningResult
  ]);

  const stopAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setState('idle');
  }, [setState]);

  const cleanup = useCallback(() => {
    stopAnalysis();
    if (audioProcessorRef.current) {
      audioProcessorRef.current.destroy();
      audioProcessorRef.current = null;
    }
    frequencyHistoryRef.current = [];
  }, [stopAnalysis]);

  useEffect(() => {
    if (stringIdentifierRef.current) {
      stringIdentifierRef.current.setTuningMode(currentMode);
    }
  }, [currentMode]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    initializeAudio,
    stopAnalysis,
    cleanup,
    isReady: !!audioProcessorRef.current?.isReady()
  };
};