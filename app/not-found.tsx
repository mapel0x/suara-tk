import Link from 'next/link';
import { SearchX, Home, MessageSquarePlus } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <SearchX className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <p className="text-6xl font-extrabold text-slate-200 tracking-tight">404</p>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
          Pastikan URL yang Anda masukkan sudah benar.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          Ke Beranda
        </Link>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <MessageSquarePlus className="w-4 h-4" />
          Kirim Aspirasi
        </Link>
      </div>
    </div>
  );
}
