'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Tag,
  User,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import Timeline from '@/components/Timeline';
import { AspirationStatus, StatusHistoryItem } from '@/lib/types';

interface TrackedAspiration {
  ticketCode: string;
  title: string;
  body: string;
  categoryName: string;
  isAnonymous: boolean;
  senderName?: string;
  senderGeneration?: string;
  status: AspirationStatus;
  publicResponse?: string;
  createdAt: string;
  updatedAt: string;
  history: StatusHistoryItem[];
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [ticketInput, setTicketInput] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aspiration, setAspiration] = useState<TrackedAspiration | null>(null);

  const demoCodes = [
    { code: 'STK-7K4P-9M2Q', desc: 'Fasilitas Lab (Dalam Proses)' },
    { code: 'STK-8B2X-4L9V', desc: 'Workshop Docker (Selesai)' },
    { code: 'STK-3V9T-1W8F', desc: 'Jadwal Pengganti (Ditinjau)' },
  ];

  const fetchAspiration = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      setError('Silakan masukkan nomor tiket.');
      return;
    }

    setLoading(true);
    setError('');
    setAspiration(null);

    try {
      const res = await fetch(`/api/aspirations/${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Tiket tidak ditemukan.');
      }

      setAspiration(data.aspiration);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat status tiket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchAspiration(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAspiration(ticketInput);
  };

  const formatDate = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
          <Search className="w-3.5 h-3.5" />
          <span>Pelacakan Status Aspirasi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Lacak Perkembangan Tiket Anda
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Masukkan kode tiket acak (misal: <code className="font-mono text-blue-700 font-semibold">STK-7K4P-9M2Q</code>) untuk melihat riwayat verifikasi dan tindak lanjut dari Humas HIMTEK.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Masukkan kode tiket (Contoh: STK-7K4P-9M2Q)"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Mencari...</span>
              </>
            ) : (
              <span>Lacak Tiket</span>
            )}
          </button>
        </form>

        {/* Demo Ticket Quick Chips */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Contoh tiket:
          </span>
          {demoCodes.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setTicketInput(item.code);
                fetchAspiration(item.code);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-mono transition-colors border border-slate-200"
            >
              {item.code} <span className="text-[10px] text-slate-600 font-sans">({item.desc})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">Tiket Tidak Ditemukan</span>
            <p className="text-xs leading-relaxed text-rose-600">{error}</p>
          </div>
        </div>
      )}

      {/* Search Result */}
      {aspiration && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Info Card */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 space-y-4">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm sm:text-base font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    {aspiration.ticketCode}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    {aspiration.categoryName}
                  </span>
                </div>
                <StatusBadge status={aspiration.status} size="md" />
              </div>

              {/* Title & Body */}
              <div className="space-y-2 pt-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {aspiration.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {aspiration.body}
                </p>
              </div>

              {/* Meta details */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Dikirim pada: {formatDate(aspiration.createdAt)}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  Pengirim:{' '}
                  {aspiration.isAnonymous
                    ? 'Mahasiswa Anonim'
                    : `${aspiration.senderName || 'Tidak disebutkan'}${aspiration.senderGeneration ? ` (Angkatan ${aspiration.senderGeneration})` : ''}`}
                </span>
              </div>
            </div>

            {/* Public Official Response Box */}
            {aspiration.publicResponse && (
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white p-6 sm:p-8 border-t border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Tanggapan Resmi Humas HIMTEK</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {aspiration.publicResponse}
                </p>
              </div>
            )}
          </div>

          {/* Timeline Section */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Riwayat & Alur Perkembangan
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Setiap tahapan penanganan dicatat secara kronologis.
                </p>
              </div>
            </div>

            <Timeline history={aspiration.history} />
          </div>

          {/* Privacy Note */}
          <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Catatan internal, identitas pengurus, dan data sensitif sengaja disanitasi demi
              menjaga keamanan serta privasi seluruh pihak sesuai prinsip tata kelola SUARA TK.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 text-center text-slate-500">Memuat halaman pelacakan...</div>}>
      <TrackContent />
    </Suspense>
  );
}
