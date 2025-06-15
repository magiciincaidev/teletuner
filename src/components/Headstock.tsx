import { motion } from 'framer-motion';
import type { GuitarString } from '../types/tuner';

interface HeadstockProps {
  strings: GuitarString[];
  activeString?: number;
  onStringSelect: (stringNumber: number) => void;
  confidence?: number;
}

const Headstock: React.FC<HeadstockProps> = ({ 
  strings, 
  activeString, 
  onStringSelect,
  confidence = 0 
}) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Headstock background */}
      <div 
        className="wood-texture rounded-t-3xl h-80 relative border-4 border-tuner-woodDark shadow-2xl"
        style={{
          backgroundImage: 'url(/guitar.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* String pegs */}
        <div className="absolute left-4 top-8 space-y-8">
          {strings.map((string) => (
            <motion.div
              key={string.number}
              className={`string-peg ${activeString === string.number ? 'active' : ''}`}
              onClick={() => onStringSelect(string.number)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: activeString === string.number 
                  ? `0 0 20px rgba(255, 215, 0, ${0.5 + confidence * 0.5})`
                  : '0 0 0px rgba(255, 215, 0, 0)',
                backgroundColor: activeString === string.number
                  ? `rgba(255, 215, 0, ${0.8 + confidence * 0.2})`
                  : '#FFD700'
              }}
              transition={{ duration: 0.2 }}
            >
              {/* String label */}
              <div className="absolute -right-12 top-1/2 -translate-y-1/2">
                <span className="text-xs font-bold text-white drop-shadow-lg">
                  {string.number}
                </span>
                <div className="text-xs text-gray-300">
                  {string.note}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* String lines */}
        <div className="absolute left-16 top-12 space-y-8">
          {strings.map((string) => (
            <div
              key={`line-${string.number}`}
              className={`w-48 h-0.5 bg-tuner-string transition-all duration-200 ${
                activeString === string.number ? 'bg-yellow-300 shadow-lg' : ''
              }`}
              style={{
                background: activeString === string.number 
                  ? `linear-gradient(90deg, #FFD700, #C0C0C0)`
                  : '#C0C0C0'
              }}
            />
          ))}
        </div>

        {/* Brand logo area */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <h1 className="text-xl font-bold text-white drop-shadow-lg font-guitar">
            TeleTuner
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Headstock;