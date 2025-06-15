import { Toaster } from 'sonner';
import Headstock from './components/Headstock';
import TunerMeter from './components/TunerMeter';
import { useTuner } from './hooks/useTuner';
import { useTunerStore } from './stores/tunerStore';
import { motion } from 'framer-motion';

function App() {
  const {
    state,
    currentMode,
    selectedString,
    tuningResult,
    isPermissionGranted,
    error,
    setSelectedString
  } = useTunerStore();

  const { initializeAudio, stopAnalysis } = useTuner();

  const handleStart = async () => {
    await initializeAudio();
  };

  const handleStop = () => {
    stopAnalysis();
  };

  const handleStringSelect = (stringNumber: number) => {
    setSelectedString(stringNumber === selectedString ? null : stringNumber);
  };

  const getTargetFrequency = () => {
    if (tuningResult) return tuningResult.targetFrequency;
    if (selectedString) {
      const string = currentMode.strings.find(s => s.number === selectedString);
      return string?.frequency || 0;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="text-center py-6">
        <h1 className="text-4xl font-bold text-white font-guitar mb-2">
          TeleTuner
        </h1>
        <p className="text-gray-300">
          高精度ギターチューナー
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 space-y-8">
        
        {/* Headstock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Headstock
            strings={currentMode.strings}
            activeString={tuningResult?.string || selectedString || undefined}
            onStringSelect={handleStringSelect}
            confidence={0.8}
          />
        </motion.div>

        {/* Tuner Meter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-lg"
        >
          <TunerMeter
            cents={tuningResult?.cents || 0}
            frequency={tuningResult?.actualFrequency || 0}
            targetFrequency={getTargetFrequency()}
            accuracy={tuningResult?.accuracy || 'off'}
            isActive={state === 'analyzing' && !!tuningResult}
          />
        </motion.div>

        {/* Control buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-4"
        >
          {!isPermissionGranted ? (
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-tuner-perfect hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
            >
              マイクを開始
            </button>
          ) : (
            <>
              {state === 'idle' ? (
                <button
                  onClick={handleStart}
                  className="px-8 py-3 bg-tuner-perfect hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
                >
                  チューニング開始
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
                >
                  停止
                </button>
              )}
            </>
          )}
        </motion.div>

        {/* Status display */}
        <div className="text-center">
          {error && (
            <div className="text-red-400 mb-2">
              {error}
            </div>
          )}
          
          <div className="text-gray-400 text-sm">
            状態: {
              state === 'idle' ? '待機中' :
              state === 'listening' ? '音声入力中' :
              state === 'analyzing' ? '解析中' : '調整済み'
            }
          </div>
          
          {selectedString && (
            <div className="text-tuner-peg text-sm mt-1">
              選択中: {selectedString}弦 ({currentMode.strings.find(s => s.number === selectedString)?.note})
            </div>
          )}
        </div>

        {/* Tuning mode selector */}
        <div className="text-center text-gray-300 text-sm">
          チューニング: {currentMode.name}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-xs">
        TeleTuner v2.0 - 高精度音声解析エンジン搭載
      </footer>
    </div>
  );
}

export default App;