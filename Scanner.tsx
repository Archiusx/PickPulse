import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanSuccess, onScanFailure }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch((error) => {
        console.error('Failed to clear scanner', error);
      });
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-4">
      <div id="reader" className="w-full"></div>
      <p className="mt-4 text-center text-sm text-slate-500">
        Align the barcode within the frame to scan
      </p>
    </div>
  );
};
