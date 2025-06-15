import { useEffect, useState } from 'react';

interface BrowserCheckProps {
  children: React.ReactNode;
}

interface BrowserSupport {
  audioContext: boolean;
  getUserMedia: boolean;
  webAudio: boolean;
  https: boolean;
}

const BrowserCheck: React.FC<BrowserCheckProps> = ({ children }) => {
  const [support, setSupport] = useState<BrowserSupport | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const checkSupport = () => {
      const support: BrowserSupport = {
        audioContext: !!(window.AudioContext || (window as any).webkitAudioContext),
        getUserMedia: !!(navigator.mediaDevices?.getUserMedia),
        webAudio: !!(window.AudioContext || (window as any).webkitAudioContext),
        https: location.protocol === 'https:' || location.hostname === 'localhost'
      };

      setSupport(support);
      
      const allSupported = Object.values(support).every(Boolean);
      setIsSupported(allSupported);
    };

    checkSupport();
  }, []);

  if (!support) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>ブラウザ機能をチェック中...</p>
        </div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-red-900 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">⚠️ ブラウザサポートエラー</h2>
          <p className="mb-4">お使いのブラウザではTeleTunerがサポートされていません。</p>
          
          <div className="space-y-2 text-sm">
            <div className={`flex items-center ${support.https ? 'text-green-400' : 'text-red-400'}`}>
              <span className="mr-2">{support.https ? '✅' : '❌'}</span>
              HTTPS接続
            </div>
            <div className={`flex items-center ${support.audioContext ? 'text-green-400' : 'text-red-400'}`}>
              <span className="mr-2">{support.audioContext ? '✅' : '❌'}</span>
              AudioContext API
            </div>
            <div className={`flex items-center ${support.getUserMedia ? 'text-green-400' : 'text-red-400'}`}>
              <span className="mr-2">{support.getUserMedia ? '✅' : '❌'}</span>
              マイクアクセス API
            </div>
          </div>

          <div className="mt-4 text-sm">
            <p className="font-bold">推奨ブラウザ:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Chrome 66+</li>
              <li>Firefox 60+</li>
              <li>Safari 11.1+</li>
              <li>Edge 79+</li>
            </ul>
          </div>

          {!support.https && (
            <div className="mt-4 p-3 bg-yellow-800 rounded">
              <p className="text-sm">
                <strong>注意:</strong> マイクアクセスにはHTTPS接続が必要です。
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default BrowserCheck;