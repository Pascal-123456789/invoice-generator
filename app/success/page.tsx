'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [unlockCode, setUnlockCode] = useState('');

  useEffect(() => {
    if (sessionId) {
      const code = 'PAID-' + sessionId.substring(0, 8).toUpperCase();
      setUnlockCode(code);
    }
  }, [sessionId]);

  const copyCode = () => {
    navigator.clipboard.writeText(unlockCode);
    alert('Code copied to clipboard!');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-700 mb-3">Your unlock code:</p>
            <div className="bg-white rounded border-2 border-blue-500 p-4 mb-3">
              <code className="text-2xl font-mono font-bold text-gray-900">{unlockCode}</code>
            </div>
            <button
              onClick={copyCode}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Copy Code
            </button>
          </div>

          <div className="text-left bg-gray-50 rounded p-4 mb-6">
            <p className="font-semibold text-gray-900 mb-2">How to use your code:</p>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Go back to the invoice generator</li>
              <li>Enter this code in the Unlock box</li>
              <li>Click Unlock</li>
              <li>Download invoices without watermark</li>
            </ol>
          </div>

          <a href="/" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800">
            Back to Invoice Generator
          </a>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
