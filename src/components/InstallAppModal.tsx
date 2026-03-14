import { useRef, useEffect } from 'react';
import { X, Smartphone, Monitor, Download } from 'lucide-react';
import { usePWAInstall } from '../context/PWAInstallContext';

type InstallAppModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function InstallAppModal({ isOpen, onClose }: InstallAppModalProps) {
  const { canInstall, isInstalled, triggerInstall } = usePWAInstall();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Download className="w-6 h-6 text-indigo-600" />
              Install BCSITHub
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Install the app on your device to open BCSITHub like an app and use notes offline.
          </p>

          {/* Where to find Install */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-indigo-600" />
              Where to see &quot;Install&quot;
            </h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li><strong>Chrome / Edge (computer):</strong> Look for an install icon in the address bar (right side), or open the ⋮ menu → &quot;Install BCSITHub&quot; or &quot;App available&quot;.</li>
              <li><strong>Android (Chrome):</strong> A banner may appear at the bottom, or open ⋮ menu → &quot;Install app&quot; / &quot;Add to Home screen&quot;.</li>
              <li><strong>iPhone / iPad (Safari):</strong> Tap the Share button (□↑) → &quot;Add to Home Screen&quot;. (No &quot;Install&quot; in Safari; use Add to Home Screen.)</li>
            </ul>
          </div>

          {/* How to access after install */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              How to open the app after installing
            </h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li><strong>Phone / Tablet:</strong> Open the <strong>BCSITHub</strong> icon from your home screen or app drawer.</li>
              <li><strong>Computer (Windows):</strong> Open from Start menu or desktop shortcut.</li>
              <li><strong>Computer (Mac):</strong> Open from Applications or Dock.</li>
            </ul>
          </div>

          {isInstalled ? (
            <p className="text-sm text-green-600 font-medium">
              You have already installed BCSITHub. Open it from your home screen or app list.
            </p>
          ) : canInstall ? (
            <button
              type="button"
              onClick={async () => {
                await triggerInstall();
                onClose();
              }}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Install BCSITHub now
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Use the options above in your browser to install. The &quot;Install&quot; option may appear in the address bar or browser menu when you visit this site.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
