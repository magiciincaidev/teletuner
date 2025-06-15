import { motion } from 'framer-motion';

interface TunerMeterProps {
  cents: number;
  frequency: number;
  targetFrequency: number;
  accuracy: 'perfect' | 'excellent' | 'good' | 'ok' | 'off';
  isActive: boolean;
}

const TunerMeter: React.FC<TunerMeterProps> = ({
  cents,
  frequency,
  targetFrequency,
  accuracy,
  isActive
}) => {
  const needleAngle = Math.max(-90, Math.min(90, cents * 3));
  
  const getAccuracyColor = () => {
    switch (accuracy) {
      case 'perfect': return '#10B981'; // green
      case 'excellent': return '#059669'; // dark green
      case 'good': return '#F59E0B'; // yellow
      case 'ok': return '#F97316'; // orange
      case 'off': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  const getAccuracyText = () => {
    switch (accuracy) {
      case 'perfect': return 'PERFECT';
      case 'excellent': return 'EXCELLENT';
      case 'good': return 'GOOD';
      case 'ok': return 'OK';
      case 'off': return 'TUNE';
      default: return '';
    }
  };

  return (
    <div className="tuner-meter flex flex-col items-center p-6">
      {/* Semicircle meter */}
      <div className="relative w-64 h-32 mb-4">
        {/* Meter background */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* Background arc */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            stroke="#374151"
            strokeWidth="8"
            fill="none"
          />
          
          {/* Colored segments */}
          <path
            d="M 20 80 A 80 80 0 0 1 60 35"
            stroke="#EF4444"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M 60 35 A 80 80 0 0 1 85 25"
            stroke="#F97316"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M 85 25 A 80 80 0 0 1 115 25"
            stroke="#10B981"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M 115 25 A 80 80 0 0 1 140 35"
            stroke="#F97316"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M 140 35 A 80 80 0 0 1 180 80"
            stroke="#EF4444"
            strokeWidth="6"
            fill="none"
          />

          {/* Center line */}
          <line
            x1="100"
            y1="20"
            x2="100"
            y2="85"
            stroke="#10B981"
            strokeWidth="2"
          />

          {/* Needle */}
          <motion.g
            animate={{ rotate: needleAngle }}
            transition={{ duration: 0.1 }}
            style={{ transformOrigin: '100px 80px' }}
          >
            <line
              x1="100"
              y1="80"
              x2="100"
              y2="30"
              stroke={getAccuracyColor()}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx="100"
              cy="80"
              r="4"
              fill={getAccuracyColor()}
            />
          </motion.g>
        </svg>

        {/* Cent markers */}
        <div className="absolute inset-0 flex justify-center items-end">
          <div className="text-xs text-gray-400 flex justify-between w-full px-4">
            <span>-50</span>
            <span>-25</span>
            <span className="text-tuner-perfect">0</span>
            <span>+25</span>
            <span>+50</span>
          </div>
        </div>
      </div>

      {/* Digital display */}
      <div className="frequency-display bg-gray-900 rounded-lg border border-gray-600 min-w-48">
        <div className="text-center">
          <div className="text-3xl font-mono font-bold" style={{ color: getAccuracyColor() }}>
            {isActive ? frequency.toFixed(1) : '---.-'}
            <span className="text-lg text-gray-400">Hz</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Target: {targetFrequency.toFixed(1)}Hz
          </div>
        </div>
      </div>

      {/* Accuracy indicator */}
      <motion.div 
        className="mt-4 px-6 py-2 rounded-full font-bold text-sm"
        style={{ 
          backgroundColor: getAccuracyColor(),
          color: accuracy === 'good' || accuracy === 'ok' ? '#000' : '#fff'
        }}
        animate={{ 
          scale: accuracy === 'perfect' ? [1, 1.1, 1] : 1 
        }}
        transition={{ 
          repeat: accuracy === 'perfect' ? Infinity : 0,
          duration: 1 
        }}
      >
        {getAccuracyText()}
      </motion.div>

      {/* Cents display */}
      <div className="mt-2 text-lg font-mono">
        {isActive && (
          <span style={{ color: getAccuracyColor() }}>
            {cents > 0 ? '+' : ''}{cents.toFixed(1)}¢
          </span>
        )}
      </div>
    </div>
  );
};

export default TunerMeter;