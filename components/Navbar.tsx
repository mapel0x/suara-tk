'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquarePlus, Search, Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Beranda' },
    { href: '/submit', label: 'Kirim Aspirasi' },
    { href: '/track', label: 'Lacak Status' },
    { href: '/tentang', label: 'Panduan & Privasi' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg tracking-tight">TK</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">
                  SUARA TK
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  HIMTEK
                </span>
              </div>
              <p className="text-[11px] text-slate-600 hidden sm:block">
                Dengar, Catat, Tindaklanjuti.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-700 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Button (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/track"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4 text-slate-500" />
              Lacak Tiket
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/25 transition-all hover:shadow"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Kirim Aspirasi
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(item.href)
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
            >
              <Search className="w-4 h-4" />
              Lacak Kode Tiket
            </Link>
            <Link
              href="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Kirim Aspirasi Baru
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kanal Aspirasi Resmi Mahasiswa Teknik Komputer</span>
          </div>
        </div>
      )}
    </header>
  );
}
