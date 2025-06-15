import { useState } from 'react';
import { useTunerStore } from '../stores/tunerStore';

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, error, isPermissionGranted, tuningResult } = useTunerStore();

  if (process.env.NODE_ENV === 'production' && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-700 text-white px-3 py-1 rounded text-xs z-50"
      >
        Debug
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Debug Info</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400">✕</button>
      </div>
      
      <div className="space-y-2">
        <div>
          <strong>State:</strong> {state}
        </div>
        
        <div>
          <strong>Permission:</strong> {isPermissionGranted ? 'Granted' : 'Denied'}
        </div>
        
        {error && (
          <div className="text-red-400">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {tuningResult && (
          <div>
            <strong>Frequency:</strong> {tuningResult.actualFrequency.toFixed(1)}Hz<br/>
            <strong>String:</strong> {tuningResult.string}<br/>
            <strong>Cents:</strong> {tuningResult.cents.toFixed(1)}¢<br/>
            <strong>Accuracy:</strong> {tuningResult.accuracy}
          </div>
        )}
        
        <div>
          <strong>URL:</strong> {window.location.protocol}<br/>
          <strong>UserAgent:</strong> {navigator.userAgent.substring(0, 50)}...
        </div>
        
        <div>
          <strong>AudioContext:</strong> {!!(window.AudioContext || (window as any).webkitAudioContext) ? 'OK' : 'NG'}<br/>
          <strong>getUserMedia:</strong> {!!navigator.mediaDevices?.getUserMedia ? 'OK' : 'NG'}
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;