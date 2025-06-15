import { motion } from 'framer-motion';
import { useTunerStore } from '../stores/tunerStore';
import { useTuner } from '../hooks/useTuner';

const ModernTunerApp = () => {
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
    try {
      await initializeAudio();
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  };

  const handleStop = () => {
    stopAnalysis();
  };

  const handleStringSelect = (stringNumber: number) => {
    setSelectedString(stringNumber === selectedString ? null : stringNumber);
  };

  const getProgressPercentage = () => {
    if (!tuningResult) return 50;
    
    // Convert cents to percentage (±50 cents = 0-100%)
    const maxCents = 50;
    const cents = Math.max(-maxCents, Math.min(maxCents, tuningResult.cents));
    return 50 + (cents / maxCents) * 50;
  };

  const getCentsDisplay = () => {
    if (!tuningResult) return '0.00';
    const cents = tuningResult.cents;
    return (cents > 0 ? '+' : '') + cents.toFixed(2);
  };

  const getActiveStringInfo = () => {
    const activeStringNumber = tuningResult?.string || selectedString;
    if (!activeStringNumber) return null;
    
    return currentMode.strings.find(s => s.number === activeStringNumber);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#171f14] justify-between" style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}>
      {/* Header */}
      <div>
        <div className="flex items-center bg-[#171f14] p-4 pb-2 justify-between">
          <div className="text-white flex size-12 shrink-0 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            TeleTuner
          </h2>
        </div>

        {/* Tuning Mode */}
        <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          {currentMode.name}
        </h3>

        {/* String Selection */}
        <div className="flex flex-wrap gap-3 p-4">
          {currentMode.strings.map((string) => (
            <motion.label
              key={string.number}
              className={`text-sm font-medium leading-normal flex items-center justify-center rounded-xl border px-4 h-11 text-white relative cursor-pointer transition-all duration-200 ${
                (tuningResult?.string === string.number || selectedString === string.number)
                  ? 'border-[3px] px-3.5 border-[#8cd279] bg-[#8cd279]/10'
                  : 'border border-[#445c3d] hover:border-[#8cd279]/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStringSelect(string.number)}
            >
              {string.note}
              <input 
                type="radio" 
                className="invisible absolute" 
                checked={tuningResult?.string === string.number || selectedString === string.number}
                onChange={() => {}}
              />
            </motion.label>
          ))}
        </div>

        {/* Tuning Display */}
        <div className="flex flex-col gap-3 p-4">
          <div className="flex gap-6 justify-between items-center">
            <div className="text-white">
              {getActiveStringInfo() && (
                <div className="text-sm">
                  <span className="text-[#a4be9d]">Target: </span>
                  <span>{getActiveStringInfo()?.frequency.toFixed(1)}Hz</span>
                </div>
              )}
            </div>
            <div className="text-white text-sm font-normal leading-normal">
              {getCentsDisplay()}¢
            </div>
          </div>

          {/* Progress Bar Meter */}
          <div className="relative">
            <div className="rounded bg-[#445c3d] h-2">
              <motion.div 
                className="h-2 rounded transition-all duration-200"
                style={{ 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: tuningResult?.accuracy === 'perfect' || tuningResult?.accuracy === 'excellent' 
                    ? '#8cd279' 
                    : tuningResult?.accuracy === 'good' 
                    ? '#fbbf24' 
                    : '#ef4444'
                }}
                animate={{ 
                  boxShadow: tuningResult?.accuracy === 'perfect' 
                    ? '0 0 10px #8cd279' 
                    : '0 0 0px transparent'
                }}
              />
            </div>
            {/* Center marker */}
            <div className="absolute top-0 left-1/2 transform -translate-x-0.5 w-0.5 h-2 bg-white/30"></div>
          </div>

          {/* Frequency Display */}
          {tuningResult && (
            <div className="text-center">
              <div className="text-white text-2xl font-bold">
                {tuningResult.actualFrequency.toFixed(1)}
                <span className="text-lg text-[#a4be9d] ml-1">Hz</span>
              </div>
              <div className="text-[#8cd279] text-sm font-medium mt-1">
                {tuningResult.accuracy.toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-stretch">
          <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
            {!isPermissionGranted ? (
              <motion.button
                onClick={handleStart}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#8cd279] text-[#171f14] text-sm font-bold leading-normal tracking-[0.015em] flex-1"
                whileHover={{ scale: 1.02, backgroundColor: '#9dd985' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="truncate">Start Tuning</span>
              </motion.button>
            ) : (
              <>
                {state === 'idle' ? (
                  <motion.button
                    onClick={handleStart}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#8cd279] text-[#171f14] text-sm font-bold leading-normal tracking-[0.015em]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="truncate">Start</span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleStop}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#ef4444] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="truncate">Stop</span>
                  </motion.button>
                )}
                <motion.button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#2f402b] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="truncate">Settings</span>
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="px-4 pb-4">
          {error && (
            <div className="text-red-400 text-sm text-center p-2 bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="text-[#a4be9d] text-xs text-center mt-2">
            {state === 'idle' ? 'Ready to tune' :
             state === 'listening' ? 'Listening...' :
             state === 'analyzing' ? 'Analyzing audio...' : 'Tuned'}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div>
        <div className="flex gap-2 border-t border-[#2f402b] bg-[#222e1f] px-4 pb-3 pt-2">
          <a className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-white" href="#">
            <div className="text-white flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M245.66,42.34l-32-32a8,8,0,0,0-12.72,9.41L140.52,80.16C117.73,68.3,92.21,69.29,76.75,84.74a42.27,42.27,0,0,0-9.39,14.37A8.24,8.24,0,0,1,59.81,104c-14.59.49-27.26,5.72-36.65,15.11C11.08,131.22,6,148.6,8.74,168.07,11.4,186.7,21.07,205.15,36,220s33.34,24.56,52,27.22A71.13,71.13,0,0,0,98.1,248c15.32,0,28.83-5.23,38.76-15.16,9.39-9.39,14.62-22.06,15.11-36.65a8.24,8.24,0,0,1,4.92-7.55,42.22,42.22,0,0,0,14.37-9.39c15.45-15.46,16.44-41,4.58-63.77l60.41-60.42a8,8,0,0,0,9.41-12.72Zm-152,163.31a8,8,0,0,1-11.31,0l-32-32a8,8,0,0,1,11.32-11.31l32,32A8,8,0,0,1,93.66,205.65Zm42.14-45.86a28,28,0,1,1,0-39.59A28,28,0,0,1,135.8,159.79Zm31.06-58a86.94,86.94,0,0,0-6-6.68,85.23,85.23,0,0,0-6.69-6L176,67.31,188.69,80ZM200,68.68,187.32,56,212,31.31,224.69,44Z"></path>
              </svg>
            </div>
          </a>
          <a className="flex flex-1 flex-col items-center justify-end gap-1 text-[#a4be9d]" href="#">
            <div className="text-[#a4be9d] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M210.3,56.34l-80-24A8,8,0,0,0,120,40V148.26A48,48,0,1,0,136,184V98.75l69.7,20.91A8,8,0,0,0,216,112V64A8,8,0,0,0,210.3,56.34ZM88,216a32,32,0,1,1,32-32A32,32,0,0,1,88,216ZM200,101.25l-64-19.2V50.75L200,70Z"></path>
              </svg>
            </div>
          </a>
          <a className="flex flex-1 flex-col items-center justify-end gap-1 text-[#a4be9d]" href="#">
            <div className="text-[#a4be9d] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
              </svg>
            </div>
          </a>
        </div>
        <div className="h-5 bg-[#222e1f]"></div>
      </div>
    </div>
  );
};

export default ModernTunerApp;