'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error monitoring in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[SUARA TK Error]', error);
    }
  }, [error]);

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Terjadi Kesalahan
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Halaman ini mengalami kendala sementara. Coba muat ulang atau kembali ke beranda.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
