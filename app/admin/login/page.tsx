'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

// Demo credentials shown only in dev mode
const IS_DEMO = process.env.NODE_ENV !== 'production';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const isLocked = attempts >= 5;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      setError('Terlalu banyak percobaan gagal. Silakan refresh halaman dan coba lagi.');
      return;
    }

    if (!username.trim() || !password.trim()) {
      setError('Silakan masukkan username dan kata sandi admin.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('suaratk_admin_auth', 'true');
          sessionStorage.setItem('suaratk_admin_user', data.displayName || username);
        }
        router.push(redirectTo);
      } else {
        setAttempts((n) => n + 1);
        // Generic message — do NOT reveal which field is wrong or hint valid creds
        setError(
          attempts >= 4
            ? 'Terlalu banyak percobaan gagal. Akses sementara dikunci.'
            : 'Username atau kata sandi tidak valid.'
        );
        setLoading(false);
      }
    } catch {
      setError('Gagal terhubung ke server. Periksa koneksi Anda dan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/25">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Portal Admin Humas
          </h1>
          <p className="text-xs text-slate-500">
            Masuk untuk mengelola dan menindaklanjuti aspirasi mahasiswa Teknik Komputer.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Username Pengurus
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoComplete="username"
                placeholder="Username"
                value={username}
                disabled={isLocked}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                disabled={isLocked}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isLocked}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md transition-colors"
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Only show demo hint in non-production */}
          {IS_DEMO && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
              <strong>Mode Demo:</strong> Gunakan user <code className="font-mono font-bold">humas</code> / password <code className="font-mono font-bold">humashimtek2026</code>. Fitur ini tidak tampil di production.
            </div>
          )}

          {attempts > 0 && attempts < 5 && (
            <p className="text-[11px] text-rose-600 text-center">
              Percobaan {attempts}/5. Setelah 5 kali gagal, login akan dikunci.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 transition-colors shadow-sm"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>{isLocked ? 'Login Dikunci' : 'Masuk ke Dashboard'}</span>
                {!isLocked && <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
