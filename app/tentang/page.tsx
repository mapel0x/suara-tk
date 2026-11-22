import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Panduan Penggunaan & Privasi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Transparansi, Etika, dan Keamanan SUARA TK
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
          SUARA TK adalah program kerja berkelanjutan Divisi Humas HIMTEK yang berkomitmen
          menyediakan wadah aspirasi yang aman, adil, dan bertanggung jawab.
        </p>
      </div>

      {/* Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Minimisasi Data Pribadi</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Kami hanya mengumpulkan data yang benar-benar esensial. Anda tidak diminta memberikan
            NIM, nomor telepon, akun media sosial, maupun kata sandi.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Target Waktu Respons (SLA)</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Konfirmasi tiket otomatis saat pengiriman. Verifikasi awal oleh Humas ditargetkan dalam
            3-5 hari kerja, dengan update berkala bila membutuhkan koordinasi fakultas.
          </p>
        </div>
      </div>

      {/* Etika Pengiriman */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Etika & Panduan Penyampaian Aspirasi
          </h2>
        </div>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            Demi terciptanya komunikasi yang efektif dan produktif, mahasiswa diharapkan
            memperhatikan hal-hal berikut saat menyampaikan aspirasi:
          </p>

          <ul className="space-y-2.5 pl-2">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Spesifik & Jelas:</strong> Sebutkan lokasi kendala (misal: ruang lab tertentu), mata kuliah terkait, atau bentuk kegiatan yang diusulkan.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Berfokus pada Solusi:</strong> Kritik yang konstruktif dan disertai saran perbaikan akan lebih cepat dikoordinasikan.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Bahasa Santun:</strong> Hindari ujaran kebencian, pencemaran nama baik personal, serta kata-kata kasar.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Kebijakan Privasi */}
      <section id="privasi" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Kebijakan Privasi & Batas Anonimitas
          </h2>
        </div>

        <div className="space-y-3.5 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>Mode Anonim:</strong> Jika Anda memilih mode Anonim, sistem web SUARA TK tidak
            menyimpan data pengenal diri Anda. Aspirasi Anda hanya dikenali melalui{' '}
            <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-700">Kode Tiket</code> acak.
          </p>
          <p>
            <strong>Akses Data:</strong> Hanya pengurus Humas HIMTEK yang memiliki hak akses
            terautentikasi ke panel pengelolaan. Catatan internal antar-pengurus tidak dipublikasikan
            di halaman pelacakan publik.
          </p>
          <p>
            <strong>Retensi Data:</strong> Data aspirasi disimpan selama masa periode kepengurusan
            berjalan untuk keperluan evaluasi tahunan dan rekap laporan kerja himpunan, kemudian
            diarsipkan sesuai ketentuan serah terima pengurus.
          </p>
        </div>
      </section>

      {/* Penanganan Isu Sensitif */}
      <section className="p-6 sm:p-8 rounded-3xl bg-amber-50/80 border border-amber-200/80 text-amber-950 space-y-4">
        <div className="flex items-center gap-2.5 text-amber-800 font-bold text-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2>Penanganan Isu Darurat & Sensitif</h2>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          Platform SUARA TK ditujukan untuk aspirasi akademik, fasilitas, dan kegiatan kemahasiswaan.
          Apabila Anda menghadapi kondisi darurat keselamatan, pelecehan seksual, pemerasan, atau ancaman fisik, mohon segera melapor langsung ke:
        </p>
        <div className="bg-white/80 p-4 rounded-xl border border-amber-200 text-xs sm:text-sm space-y-1 text-slate-800">
          <p>&bull; <strong>Satgas PPKS Kampus</strong> (Pencegahan & Penanganan Kekerasan Seksual)</p>
          <p>&bull; <strong>Layanan Konseling Mahasiswa Universitas</strong></p>
          <p>&bull; <strong>Ketua Program Studi / Dosen Pembimbing Akademik</strong></p>
        </div>
      </section>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 transition-all hover:scale-105"
        >
          <span>Siap Menyampaikan Aspirasi?</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
