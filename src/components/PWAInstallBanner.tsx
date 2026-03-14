import { useState, useEffect } from 'react';
import { usePWAInstall } from '../context/PWAInstallContext';

const DISMISS_KEY = 'bcsithub-pwa-install-dismissed';

export function PWAInstallBanner() {
  const { canInstall, isInstalled, triggerInstall } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === 'true') return;
    if (isInstalled) return;
    if (canInstall) setIsVisible(true);
  }, [canInstall, isInstalled]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(DISMISS_KEY, 'true');
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-indigo-600 text-white rounded-xl shadow-lg p-4 flex flex-col gap-3 border border-indigo-500">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold">Install BCSITHub</p>
            <p className="text-sm text-indigo-100 mt-0.5">
              Add to home screen for offline access to notes.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-white/80 hover:text-white p-1 -m-1"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => triggerInstall().then(() => setIsVisible(false))}
            className="flex-1 bg-white text-indigo-600 font-medium py-2 px-3 rounded-lg text-sm hover:bg-indigo-50"
          >
            Install
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="py-2 px-3 text-sm text-indigo-100 hover:text-white"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
