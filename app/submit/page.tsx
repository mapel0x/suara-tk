'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquarePlus,
  Shield,
  User,
  EyeOff,
  Copy,
  Check,
  ArrowRight,
  AlertCircle,
  Send,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

export default function SubmitPage() {

  // Form states
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [senderGeneration, setSenderGeneration] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status & UI states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!categoryId) {
      setErrorMessage('Silakan pilih salah satu kategori aspirasi.');
      return;
    }

    if (title.trim().length < 5) {
      setErrorMessage('Judul aspirasi minimal 5 karakter.');
      return;
    }

    if (body.trim().length < 15) {
      setErrorMessage('Isi aspirasi minimal 15 karakter agar dapat ditelaah secara jelas.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Anda harus menyetujui panduan dan etika penyampaian aspirasi.');
      return;
    }

    if (!isAnonymous && !senderName.trim()) {
      setErrorMessage('Silakan isi nama Anda atau pilih mode Anonim.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/aspirations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId,
          title,
          body,
          isAnonymous,
          senderName: isAnonymous ? undefined : senderName,
          senderContact: isAnonymous ? undefined : senderContact,
          senderGeneration: isAnonymous ? undefined : senderGeneration,
          publicConsent: true,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengirim aspirasi.');
      }

      setSubmittedTicket(data.ticketCode);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTicket = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* If submitted successfully, show Ticket Confirmation Card */}
      {submittedTicket ? (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Aspirasi Berhasil Terkirim!
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Terima kasih telah berkontribusi. Laporan Anda telah tercatat ke antrean Humas HIMTEK
              dan siap ditelaah.
            </p>
          </div>

          {/* Ticket Display Box */}
          <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-blue-300 max-w-md mx-auto space-y-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Nomor Tiket Pelacakan Anda
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-wider select-all">
                {submittedTicket}
              </span>
              <button
                type="button"
                onClick={handleCopyTicket}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-600 hover:text-blue-600 transition-colors shadow-xs"
                title="Salin Kode Tiket"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {copied && (
              <p className="text-xs font-medium text-emerald-600">
                Kode tiket berhasil disalin ke clipboard!
              </p>
            )}
            <p className="text-[12px] text-slate-500 pt-1">
              Simpan kode ini dengan tangkapan layar (screenshot) atau catatan pribadi untuk melihat
              tanggapan resmi.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href={`/track?code=${submittedTicket}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              Lacak Aspirasi Ini Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmittedTicket(null);
                setTitle('');
                setBody('');
                setCategoryId('');
                setAgreeTerms(false);
                setSenderName('');
                setSenderContact('');
                setSenderGeneration('');
                setIsAnonymous(true);
                setErrorMessage('');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Kirim Aspirasi Lain
            </button>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-3">
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Formulir Penyampaian Aspirasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sampaikan Suara Anda
            </h1>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              Kritik, saran, usulan fasilitas, maupun ide kegiatan Anda akan diproses secara
              bertanggung jawab oleh Humas HIMTEK.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mode Privasi: Anonim vs Identitas */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <label className="text-sm font-bold text-slate-900 block">
                Mode Pengiriman Identitas
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsAnonymous(true)}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                    isAnonymous
                      ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isAnonymous ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-slate-900 block">
                      Anonim (Direkomendasikan)
                    </span>
                    <span className="text-xs text-slate-500 leading-relaxed block mt-0.5">
                      Nama dan kontak Anda tidak disimpan. Identitas sepenuhnya dirahasiakan.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAnonymous(false)}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                    !isAnonymous
                      ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      !isAnonymous ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-slate-900 block">
                      Dengan Identitas
                    </span>
                    <span className="text-xs text-slate-500 leading-relaxed block mt-0.5">
                      Cantumkan nama jika ingin dihubungi kembali untuk tindak lanjut langsung.
                    </span>
                  </div>
                </button>
              </div>

              {/* Conditional Inputs if With Identity */}
              {!isAnonymous && (
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Nama Lengkap / Panggilan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Riyan Satria"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Angkatan (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 2023"
                      value={senderGeneration}
                      onChange={(e) => setSenderGeneration(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Kontak WhatsApp / Email (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 0812xxxx atau email@gmail.com"
                      value={senderContact}
                      onChange={(e) => setSenderContact(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Hanya digunakan oleh pengurus Humas jika butuh klarifikasi teknis.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Main Form Fields */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
              {/* Kategori */}
              <div>
                <label className="text-sm font-bold text-slate-900 block mb-1.5">
                  Kategori Aspirasi <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {categoryId && (
                  <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded-lg mt-2 border border-blue-100">
                    {CATEGORIES.find((c) => c.id === categoryId)?.description}
                  </p>
                )}
              </div>

              {/* Judul */}
              <div>
                <label className="text-sm font-bold text-slate-900 block mb-1.5">
                  Judul Ringkas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ringkasan inti aspirasi (misal: Penambahan Lisensi Software di Lab)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-600 mt-1">
                  <span>Buatlah judul spesifik dan padat.</span>
                  <span>{title.length}/120</span>
                </div>
              </div>

              {/* Isi Aspirasi */}
              <div>
                <label className="text-sm font-bold text-slate-900 block mb-1.5">
                  Detail Aspirasi / Keluhan / Masukan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Jelaskan kronologi, lokasi kejadian, dampak, atau usulan solusi secara runtut..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={3000}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-600 mt-1">
                  <span>Minimal 15 karakter, maksimal 3000 karakter.</span>
                  <span>{body.length}/3000</span>
                </div>
              </div>

              {/* Persetujuan */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    Saya menyatakan bahwa aspirasi ini disampaikan secara beretika, tidak mengandung
                    ujaran kebencian, fitnah, maupun hoaks, serta menyetujui{' '}
                    <Link href="/tentang#privasi" className="text-blue-600 underline" target="_blank">
                      Kebijakan Privasi SUARA TK
                    </Link>
                    .
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-slate-600 flex items-center gap-1.5 order-2 sm:order-1">
                <Shield className="w-4 h-4 text-emerald-600" />
                Data terlindungi dengan enkripsi HTTPS
              </span>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl shadow-md shadow-blue-500/20 transition-all order-1 sm:order-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menerbitkan Tiket...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Aspirasi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
