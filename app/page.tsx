'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MessageSquarePlus,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Layers,
  Cpu,
  GraduationCap,
  Users,
  Lightbulb,
  Building2,
  Lock,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

export default function HomePage() {
  const router = useRouter();
  const [quickTicket, setQuickTicket] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTicket.trim()) {
      router.push(`/track?code=${encodeURIComponent(quickTicket.trim().toUpperCase())}`);
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'cat-akademik':
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'cat-fasilitas':
        return <Building2 className="w-5 h-5 text-indigo-600" />;
      case 'cat-kegiatan':
        return <Cpu className="w-5 h-5 text-emerald-600" />;
      case 'cat-himtek':
        return <Users className="w-5 h-5 text-amber-600" />;
      case 'cat-kemahasiswaan':
        return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      case 'cat-inovasi':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      default:
        return <Layers className="w-5 h-5 text-slate-600" />;
    }
  };

  const faqs = [
    {
      q: 'Apakah aspirasi saya benar-benar bisa dikirim secara anonim?',
      a: 'Ya, Anda bebas memilih mode Anonim. Dalam mode anonim, sistem tidak meminta nama, NIM, email, maupun nomor telepon Anda. Kami hanya mencatat isi aspirasi, kategori, dan waktu pengiriman.',
    },
    {
      q: 'Apa fungsi nomor tiket (contoh: STK-7K4P-9M2Q)?',
      a: 'Nomor tiket adalah kode acak rahasia yang diterbitkan otomatis oleh sistem saat Anda selesai mengirim aspirasi. Simpan kode ini untuk memantau status perkembangan, proses verifikasi, serta tanggapan resmi dari Humas HIMTEK.',
    },
    {
      q: 'Berapa lama waktu yang dibutuhkan hingga aspirasi saya ditanggapi?',
      a: 'Berdasarkan target SLA Humas HIMTEK, peninjauan awal dilakukan dalam 3-5 hari kerja. Pembaruan berkala akan dicatatkan pada timeline tiket apabila aspirasi memerlukan koordinasi lebih lanjut dengan pihak laboratorium, dosen, atau dekanat.',
    },
    {
      q: 'Apakah semua aspirasi yang masuk dijamin pasti diwujudkan?',
      a: 'SUARA TK bukan janji bahwa seluruh usulan pasti terlaksana, melainkan jaminan bahwa setiap aspirasi didengar, dicatat, ditinjau secara adil, dan memperoleh pembaruan status serta alasan yang transparan.',
    },
    {
      q: 'Bagaimana jika saya ingin melaporkan masalah yang sensitif atau darurat?',
      a: 'Untuk permasalahan sensitif (seperti kekerasan, pelecehan, atau ancaman keselamatan mendesak), sistem SUARA TK bukan layanan penanganan darurat. Kami menyarankan untuk menghubungi pihak berwenang kampus atau layanan konseling resmi secara langsung demi keamanan dan perlindungan segera.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.3),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs sm:text-sm font-medium text-blue-300">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Kanal Aspirasi Resmi Mahasiswa Teknik Komputer</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Suaramu Punya Arti.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Dengar, Catat, Tindaklanjuti.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            SUARA TK hadir sebagai jembatan komunikasi dua arah antara mahasiswa Teknik Komputer
            dan HIMTEK. Sampaikan masukan, kendala fasilitas, atau ide kreatif Anda dengan aman
            dan terorganisir.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <Link
              href="/submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <MessageSquarePlus className="w-5 h-5" />
              Kirim Aspirasi Sekarang
            </Link>
            <Link
              href="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all"
            >
              <Search className="w-5 h-5 text-slate-400" />
              Lacak Status Tiket
            </Link>
          </div>

          {/* Quick Track Input Bar */}
          <div className="pt-6 max-w-lg mx-auto">
            <form
              onSubmit={handleQuickTrack}
              className="p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2 shadow-2xl"
            >
              <div className="pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Sudah punya tiket? Contoh: STK-7K4P-9M2Q"
                value={quickTicket}
                onChange={(e) => setQuickTicket(e.target.value.toUpperCase())}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none px-2"
              />
              <button
                type="submit"
                className="shrink-0 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
              >
                Cek Status
              </button>
            </form>
            <p className="text-[12px] text-slate-400 mt-2">
              Ingin mencoba? Gunakan tiket demo:{' '}
              <button
                type="button"
                onClick={() => setQuickTicket('STK-7K4P-9M2Q')}
                className="font-mono text-blue-300 hover:underline"
              >
                STK-7K4P-9M2Q
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Highlights / 3 Principles */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Aman & Pilihan Anonim
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Anda bebas menyampaikan kritik konstruktif tanpa khawatir. Sistem menjamin
              perlindungan identitas bagi mode anonim.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Transparan & Terlacak
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Setiap laporan menerima nomor tiket unik. Anda dapat memantau setiap tahapan
              evaluasi hingga tindak lanjut selesai.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Respons & Alur Terarah
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dikelola langsung oleh Humas HIMTEK dengan standar SOP terstruktur untuk
              diteruskan ke pihak berwenang kampus bila relevan.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (Alur 3 Langkah) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bagaimana SUARA TK Bekerja?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Alur sederhana, mudah diakses melalui HP atau laptop tanpa perlu login akun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-start">
            <span className="text-4xl font-extrabold text-blue-100 mb-2">01</span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tulis Aspirasi</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pilih kategori yang sesuai, tuliskan inti masukan Anda, dan tentukan apakah Anda
              ingin mengirim secara anonim atau mencantumkan identitas.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-start">
            <span className="text-4xl font-extrabold text-blue-100 mb-2">02</span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dapatkan Kode Tiket</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Sistem akan membuatkan kode pelacakan unik publik (contoh: <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono">STK-XXXX-XXXX</code>). Salin dan simpan tiket ini.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-start">
            <span className="text-4xl font-extrabold text-blue-100 mb-2">03</span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Pantau Tindak Lanjut</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Cek perkembangan status secara berkala di halaman pelacakan untuk melihat timeline
              verifikasi dan respons resmi tim Humas.
            </p>
          </div>
        </div>
      </section>

      {/* Kategori Aspirasi */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Kategori Aspirasi
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Topik-topik yang dapat Anda suarakan melalui platform ini.
            </p>
          </div>
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Mulai Buat Tiket <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
                  {getCategoryIcon(cat.id)}
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/60 text-xs font-semibold text-slate-700 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Pertanyaan yang Sering Diajukan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            FAQ Seputar SUARA TK
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-blue-600"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Punya Masukan untuk Kemajuan Teknik Komputer?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Jangan simpan keresahan atau ide cemerlang Anda sendiri. Suarakan sekarang demi
              lingkungan akademik dan organisasi yang lebih baik.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-bold text-blue-900 bg-white hover:bg-blue-50 rounded-xl shadow transition-transform hover:scale-105"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Mulai Kirim Aspirasi
              </Link>
              <Link
                href="/tentang"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-medium text-white hover:bg-white/10 rounded-xl border border-white/20 transition-colors"
              >
                Pelajari Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
