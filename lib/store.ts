import { Aspiration, SubmitAspirationInput } from './types';
import { CATEGORIES } from './constants';

// Characters excluding visually ambiguous: 0, O, 1, I, l
const TICKET_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateTicketCode(existingCodes?: Set<string>): string {
  for (let attempt = 0; attempt < 100; attempt++) {
    const segment1 = Array.from({ length: 4 }, () =>
      TICKET_CHARS.charAt(Math.floor(Math.random() * TICKET_CHARS.length))
    ).join('');
    const segment2 = Array.from({ length: 4 }, () =>
      TICKET_CHARS.charAt(Math.floor(Math.random() * TICKET_CHARS.length))
    ).join('');
    const code = `STK-${segment1}-${segment2}`;
    if (!existingCodes || !existingCodes.has(code)) {
      return code;
    }
  }
  // Extremely unlikely to reach here, but add timestamp fallback for safety
  return `STK-${Date.now().toString(36).toUpperCase().slice(-4)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/** Lightweight HTML/script tag stripping to prevent XSS in stored content */
function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

// Initial demo aspirations so tracking works immediately out of the box
const initialAspirations: Aspiration[] = [
  {
    id: 'asp-demo-1',
    ticketCode: 'STK-7K4P-9M2Q',
    categoryId: 'cat-fasilitas',
    categoryName: 'Fasilitas & Lab',
    title: 'Peremajaan dan Penambahan Stop Kontak di Lab Jaringan Komputer',
    body: 'Banyak stop kontak di meja praktikum Lab Jarkom yang longgar dan beberapa tidak mengalirkan daya, sehingga mahasiswa kesulitan menyalakan adaptor switch dan router saat praktikum berlangsung.',
    isAnonymous: true,
    publicConsent: true,
    visibility: 'public',
    status: 'dalam_proses',
    priority: 'tinggi',
    publicResponse: 'Terima kasih atas laporannya. Tim Humas telah berkoordinasi dengan Kepala Laboratorium dan staf teknisi Fakultas. Penggantian stop kontak dijadwalkan pada hari Sabtu ini saat jadwal lab kosong.',
    history: [
      {
        id: 'hist-1',
        aspirationId: 'asp-demo-1',
        status: 'diterima',
        label: 'Aspirasi Masuk ke Sistem',
        publicMessage: 'Aspirasi diterima dan terdaftar dengan tiket STK-7K4P-9M2Q.',
        changedAt: '2026-11-15T09:12:00Z',
        changedByRole: 'Sistem SUARA TK',
      },
      {
        id: 'hist-2',
        aspirationId: 'asp-demo-1',
        status: 'ditinjau',
        label: 'Ditinjau oleh Divisi Humas',
        publicMessage: 'Laporan diverifikasi. Kategori ditetapkan ke Fasilitas & Lab dengan tingkat urgensi tinggi.',
        changedAt: '2026-11-15T14:30:00Z',
        changedByRole: 'Humas HIMTEK',
      },
      {
        id: 'hist-3',
        aspirationId: 'asp-demo-1',
        status: 'diteruskan',
        label: 'Diteruskan ke Pengelola Lab & Sarpras',
        publicMessage: 'Nota aspirasi dan dokumentasi kendala disampaikan ke Kepala Lab Jaringan.',
        changedAt: '2026-11-16T10:00:00Z',
        changedByRole: 'Humas HIMTEK',
      },
      {
        id: 'hist-4',
        aspirationId: 'asp-demo-1',
        status: 'dalam_proses',
        label: 'Pengerjaan Teknisi',
        publicMessage: 'Pengadaan komponen pengganti telah disetujui, pengerjaan teknisi dijadwalkan akhir pekan ini.',
        changedAt: '2026-11-18T11:20:00Z',
        changedByRole: 'Koordinator Sarpras',
      },
    ],
    createdAt: '2026-11-15T09:12:00Z',
    updatedAt: '2026-11-18T11:20:00Z',
  },
  {
    id: 'asp-demo-2',
    ticketCode: 'STK-8B2X-4L9V',
    categoryId: 'cat-kegiatan',
    categoryName: 'Kegiatan & Program',
    title: 'Usulan Workshop Hands-on Docker & Kubernetes untuk Persiapan Magang',
    body: 'Banyak mahasiswa angkatan 2023 yang berencana magang semester depan membutuhkan pemahaman dasar containerization dan cloud deployment. Mohon diadakan workshop intensif di akhir pekan.',
    isAnonymous: false,
    senderName: 'Riyan Satria',
    senderGeneration: '2023',
    publicConsent: true,
    visibility: 'public',
    status: 'selesai',
    priority: 'sedang',
    publicResponse: 'Usulan telah direalisasikan! Divisi Riset & Teknologi HIMTEK telah membuka pendaftaran "DevOps Weekend Bootcamp: Docker & K8s" yang akan diadakan tanggal 28-29 November 2026 di Lab Cloud.',
    history: [
      {
        id: 'hist-201',
        aspirationId: 'asp-demo-2',
        status: 'diterima',
        label: 'Aspirasi Masuk',
        publicMessage: 'Aspirasi berhasil diterima di sistem.',
        changedAt: '2026-11-02T08:00:00Z',
        changedByRole: 'Sistem SUARA TK',
      },
      {
        id: 'hist-202',
        aspirationId: 'asp-demo-2',
        status: 'ditinjau',
        label: 'Ditinjau oleh Humas',
        publicMessage: 'Diteruskan ke Divisi Riset & Teknologi (RISTEK) HIMTEK.',
        changedAt: '2026-11-03T10:15:00Z',
        changedByRole: 'Humas HIMTEK',
      },
      {
        id: 'hist-203',
        aspirationId: 'asp-demo-2',
        status: 'dalam_proses',
        label: 'Penyusunan Silabus & Pemateri',
        publicMessage: 'RISTEK menyusun kurikulum dan mengundang alumni sebagai praktisi pemateri.',
        changedAt: '2026-11-06T15:00:00Z',
        changedByRole: 'Divisi RISTEK',
      },
      {
        id: 'hist-204',
        aspirationId: 'asp-demo-2',
        status: 'selesai',
        label: 'Program Resmi Dirilis',
        publicMessage: 'Pendaftaran workshop resmi dibuka untuk umum mahasiswa Teknik Komputer.',
        changedAt: '2026-11-12T13:45:00Z',
        changedByRole: 'Humas HIMTEK',
      },
    ],
    createdAt: '2026-11-02T08:00:00Z',
    updatedAt: '2026-11-12T13:45:00Z',
  },
  {
    id: 'asp-demo-3',
    ticketCode: 'STK-3V9T-1W8F',
    categoryId: 'cat-akademik',
    categoryName: 'Akademik',
    title: 'Penyesuaian Jadwal Pengganti Praktikum Arsitektur Komputer Kelas B',
    body: 'Jadwal pengganti berbenturan dengan mata kuliah wajib Sistem Operasi, mohon difasilitasi komunikasi dengan asisten dosen dan dosen pengampu.',
    isAnonymous: true,
    publicConsent: true,
    visibility: 'public',
    status: 'ditinjau',
    priority: 'tinggi',
    publicResponse: 'Aspirasi sedang dalam tahap verifikasi dengan Ketua Tingkat Kelas B dan Asisten Lab terkait.',
    history: [
      {
        id: 'hist-301',
        aspirationId: 'asp-demo-3',
        status: 'diterima',
        label: 'Aspirasi Masuk',
        publicMessage: 'Tiket berhasil diterbitkan.',
        changedAt: '2026-11-20T16:05:00Z',
        changedByRole: 'Sistem SUARA TK',
      },
      {
        id: 'hist-302',
        aspirationId: 'asp-demo-3',
        status: 'ditinjau',
        label: 'Verifikasi Jadwal',
        publicMessage: 'Tim Humas mengecek kesesuaian jadwal dengan Komti Kelas B.',
        changedAt: '2026-11-21T08:30:00Z',
        changedByRole: 'Humas HIMTEK',
      },
    ],
    createdAt: '2026-11-20T16:05:00Z',
    updatedAt: '2026-11-21T08:30:00Z',
  },
];

// In-memory runtime cache for server-rendered session
// In production or Supabase integration, this connects to postgres
const globalForAspirations = globalThis as unknown as {
  aspirationsStore: Aspiration[];
};

if (!globalForAspirations.aspirationsStore) {
  globalForAspirations.aspirationsStore = [...initialAspirations];
}

export function getAllAspirations(): Aspiration[] {
  return globalForAspirations.aspirationsStore;
}

export function getAspirationByTicket(ticket: string): Aspiration | null {
  const normalized = ticket.trim().toUpperCase();
  const found = globalForAspirations.aspirationsStore.find(
    (a) => a.ticketCode.toUpperCase() === normalized
  );
  return found || null;
}

export function createAspiration(input: SubmitAspirationInput): Aspiration {
  const category = CATEGORIES.find((c) => c.id === input.categoryId);
  const existingCodes = new Set(globalForAspirations.aspirationsStore.map((a) => a.ticketCode));
  const ticketCode = generateTicketCode(existingCodes);
  const now = new Date().toISOString();
  const id = `asp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newAspiration: Aspiration = {
    id,
    ticketCode,
    categoryId: input.categoryId,
    categoryName: category ? category.name : 'Lainnya',
    title: sanitizeText(input.title),
    body: sanitizeText(input.body),
    isAnonymous: input.isAnonymous,
    senderName: input.isAnonymous ? undefined : sanitizeText(input.senderName || ''),
    senderContact: input.isAnonymous ? undefined : sanitizeText(input.senderContact || ''),
    senderGeneration: input.isAnonymous ? undefined : sanitizeText(input.senderGeneration || ''),
    publicConsent: input.publicConsent,
    visibility: 'private', // default to private until moderated
    status: 'diterima',
    priority: 'sedang',
    history: [
      {
        id: `hist-${Date.now()}`,
        aspirationId: id,
        status: 'diterima',
        label: 'Aspirasi Masuk ke Sistem',
        publicMessage: `Aspirasi berhasil tercatat dengan nomor tiket ${ticketCode}. Tim Humas akan melakukan verifikasi awal dalam 3-5 hari kerja.`,
        changedAt: now,
        changedByRole: 'Sistem SUARA TK',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  globalForAspirations.aspirationsStore.unshift(newAspiration);
  return newAspiration;
}

export function getStatsSummary() {
  const list = globalForAspirations.aspirationsStore;
  const total = list.length;
  const selesai = list.filter((a) => a.status === 'selesai').length;
  const proses = list.filter((a) => ['ditinjau', 'diteruskan', 'dalam_proses'].includes(a.status)).length;
  const responRate = total > 0 ? Math.round(((total - list.filter(a => a.status === 'diterima').length) / total) * 100) : 100;

  return {
    total,
    selesai,
    proses,
    responRate,
  };
}
