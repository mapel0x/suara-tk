import React from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base">
                TK
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                SUARA TK
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Kanal aspirasi terpusat dan transparan mahasiswa Teknik Komputer kepada
              HIMTEK dan pihak kampus terkait. Program kerja berkelanjutan Divisi Hubungan
              Masyarakat (Humas) HIMTEK.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-blue-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Dengar, Catat, Tindaklanjuti.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-white transition-colors">
                  Kirim Aspirasi Baru
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Lacak Kode Tiket
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-white transition-colors">
                  Panduan & Etika Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/tentang#privasi" className="hover:text-white transition-colors">
                  Kebijakan Privasi Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Notice & Safety */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Catatan Penting
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 space-y-2">
              <div className="flex items-start gap-2 text-amber-400 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Bukan Layanan Darurat</span>
              </div>
              <p className="leading-relaxed">
                Untuk kendala keselamatan mendesak, kekerasan seksual, atau ancaman fisik,
                segera hubungi layanan darurat atau pihak berwenang kampus secara langsung.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <p>
            &copy; {new Date().getFullYear()} SUARA TK --- Dikembangkan oleh Humas HIMTEK.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/tentang#privasi" className="hover:text-slate-200 transition-colors">
              Privasi & Keamanan
            </Link>
            <span>&bull;</span>
            <Link href="/tentang#sop" className="hover:text-slate-200 transition-colors">
              SOP Tindak Lanjut
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
