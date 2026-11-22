'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Eye,
  Edit3,
  Save,
  X,
  ExternalLink,
  Lock,
  Download,
  LogOut,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { STATUS_CONFIG, CATEGORIES } from '@/lib/constants';
import { Aspiration, AspirationStatus, AspirationPriority } from '@/lib/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [aspirations, setAspirations] = useState<Aspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Selected item for modal/drawer
  const [selectedItem, setSelectedItem] = useState<Aspiration | null>(null);
  const [editStatus, setEditStatus] = useState<AspirationStatus>('diterima');
  const [editPriority, setEditPriority] = useState<AspirationPriority>('sedang');
  const [editPublicResponse, setEditPublicResponse] = useState('');
  const [editInternalNotes, setEditInternalNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Client-side auth guard (belt-and-suspenders alongside middleware)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('suaratk_admin_auth') === 'true';
      if (!isAuth) {
        router.replace('/admin/login?redirect=/admin/dashboard');
        return;
      }
    }
    setAuthChecked(true);
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/aspirations');
      if (res.status === 401) {
        router.replace('/admin/login?redirect=/admin/dashboard');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setAspirations(data.aspirations);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked) loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked]);

  const openEditModal = (item: Aspiration) => {
    setSelectedItem(item);
    setEditStatus(item.status);
    setEditPriority(item.priority);
    setEditPublicResponse(item.publicResponse || '');
    setEditInternalNotes(item.internalNotes || '');
  };

  const handleSaveChanges = async () => {
    if (!selectedItem) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/aspirations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketCode: selectedItem.ticketCode,
          status: editStatus,
          priority: editPriority,
          publicResponse: editPublicResponse,
          internalNotes: editInternalNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(`Aspirasi ${selectedItem.ticketCode} berhasil diperbarui!`);
        setTimeout(() => setToastMessage(''), 3000);
        setSelectedItem(null);
        await loadData();
      }
    } catch (err) {
      console.error('Error saving:', err);
    } finally {
      setSaving(false);
    }
  };

  // Filtered items
  const filtered = aspirations.filter((item) => {
    const matchesSearch =
      item.ticketCode.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.body.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: aspirations.length,
    pending: aspirations.filter((a) => a.status === 'diterima' || a.status === 'ditinjau').length,
    inProgress: aspirations.filter((a) => a.status === 'diteruskan' || a.status === 'dalam_proses').length,
    done: aspirations.filter((a) => a.status === 'selesai').length,
  };

  const exportToCSV = () => {
    if (filtered.length === 0) return;

    const headers = ['Kode Tiket', 'Kategori', 'Judul', 'Isi', 'Status', 'Prioritas', 'Pengirim', 'Kontak', 'Tanggal Masuk', 'Tanggapan Resmi'];
    const rows = filtered.map((item) => [
      `"${item.ticketCode}"`,
      `"${item.categoryName}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.body.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${item.status}"`,
      `"${item.priority}"`,
      `"${item.isAnonymous ? 'Anonim' : (item.senderName || '-')}"`,
      `"${item.isAnonymous ? '-' : (item.senderContact || '-')}"`,
      `"${item.createdAt}"`,
      `"${(item.publicResponse || '-').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SUARA_TK_Laporan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch { /* ignore */ }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('suaratk_admin_auth');
      sessionStorage.removeItem('suaratk_admin_user');
    }
    router.replace('/admin/login');
  };

  // Show nothing while checking auth to avoid flash
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex gap-1.5 items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
        </div>
      </div>
    );
  }

  const adminUser =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('suaratk_admin_user') || 'Admin'
      : 'Admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Panel Pengelola Humas HIMTEK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Pengelolaan Aspirasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Login sebagai: <span className="font-semibold text-slate-700">{adminUser}</span>
            {' · '}Kelola verifikasi, alur tindak lanjut, dan respons resmi untuk mahasiswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
            title="Unduh laporan dalam format CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Lihat Publik <ExternalLink className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            title="Keluar dari sesi admin"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Total Aspirasi</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.total}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-indigo-600 block mb-1">Perlu Ditinjau</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-700">{stats.pending}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-amber-600 block mb-1">Sedang Diproses</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-700">{stats.inProgress}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-600 block mb-1">Telah Selesai</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{stats.done}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan kode tiket, judul, atau isi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status</option>
            {Object.keys(STATUS_CONFIG).map((k) => (
              <option key={k} value={k}>
                {STATUS_CONFIG[k].label}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aspirations List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">Memuat data aspirasi...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Tidak ada aspirasi yang cocok dengan kriteria pencarian.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {item.ticketCode}
                    </span>
                    <span className="text-xs text-slate-500 font-medium px-2 py-0.5 rounded bg-slate-100">
                      {item.categoryName}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                    {item.isAnonymous ? (
                      <span className="text-[11px] text-slate-600 italic">Anonim</span>
                    ) : (
                      <span className="text-[11px] text-slate-600 font-medium">
                        Oleh: {item.senderName}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {item.body}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href={`/track?code=${item.ticketCode}`}
                    target="_blank"
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors"
                    title="Buka Halaman Pelacakan Publik"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Tindak Lanjuti</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Drawer/Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {selectedItem.ticketCode}
                </span>
                <span className="text-xs text-slate-500 font-semibold">Tindak Lanjut Aspirasi</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aspiration Content Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
              <h4 className="font-bold text-slate-900 text-base">{selectedItem.title}</h4>
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">{selectedItem.body}</p>
              <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-4 text-xs text-slate-500">
                <span>Pengirim: {selectedItem.isAnonymous ? 'Anonim' : selectedItem.senderName}</span>
                {!selectedItem.isAnonymous && selectedItem.senderContact && (
                  <span>Kontak: {selectedItem.senderContact}</span>
                )}
                <span>Kategori: {selectedItem.categoryName}</span>
              </div>
            </div>

            {/* Edit Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Ubah Status Aspirasi
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as AspirationStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.keys(STATUS_CONFIG).map((k) => (
                      <option key={k} value={k}>
                        {STATUS_CONFIG[k].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tingkat Prioritas Internal
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as AspirationPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="rendah">Rendah</option>
                    <option value="sedang">Sedang</option>
                    <option value="tinggi">Tinggi (Mendesak)</option>
                  </select>
                </div>
              </div>

              {/* Public Official Response */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tanggapan Resmi Publik (Akan Tampil di Halaman Lacak Mahasiswa)
                </label>
                <textarea
                  rows={3}
                  value={editPublicResponse}
                  onChange={(e) => setEditPublicResponse(e.target.value)}
                  placeholder="Tuliskan penjelasan resmi, tindak lanjut yang telah dilakukan, atau alternatif solusi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Internal Notes */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Catatan Internal Humas (Hanya Terlihat oleh Pengurus)</span>
                </div>
                <textarea
                  rows={2}
                  value={editInternalNotes}
                  onChange={(e) => setEditInternalNotes(e.target.value)}
                  placeholder="Catatan penugasan PIC, kontak pihak ketiga, hasil rapat dekanat, dsb..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-amber-50/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveChanges}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Menyimpan...' : 'Simpan Pembaruan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
