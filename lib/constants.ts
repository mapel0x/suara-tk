import { Category } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-akademik',
    name: 'Akademik',
    description: 'Jadwal kuliah, kurikulum, dosen, praktikum, dan materi perkuliahan.',
    isActive: true,
  },
  {
    id: 'cat-fasilitas',
    name: 'Fasilitas & Lab',
    description: 'Laboratorium komputer, AC, proyektor, Wi-Fi kampus, kebersihan, dan sarana belajar.',
    isActive: true,
  },
  {
    id: 'cat-kegiatan',
    name: 'Kegiatan & Program',
    description: 'Workshop, perlombaan, seminar, pengabdian masyarakat, dan event himpunan.',
    isActive: true,
  },
  {
    id: 'cat-himtek',
    name: 'Internal HIMTEK',
    description: 'Kritik, saran, masukan kepengurusan, divisi, dan kinerja pengurus HIMTEK.',
    isActive: true,
  },
  {
    id: 'cat-kemahasiswaan',
    name: 'Kemahasiswaan & Advokasi',
    description: 'UKT, beasiswa, birokrasi fakultas/universitas, dan kesejahteraan mahasiswa.',
    isActive: true,
  },
  {
    id: 'cat-inovasi',
    name: 'Ide & Inovasi',
    description: 'Usulan proyek teknologi, kolaborasi riset, open-source, dan gagasan kreatif.',
    isActive: true,
  },
  {
    id: 'cat-lainnya',
    name: 'Lainnya',
    description: 'Topik umum lainnya yang relevan bagi mahasiswa Teknik Komputer.',
    isActive: true,
  },
];

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; badgeBg: string; badgeText: string; description: string }
> = {
  diterima: {
    label: 'Diterima',
    color: 'bg-blue-500',
    badgeBg: 'bg-blue-50 border-blue-200',
    badgeText: 'text-blue-700',
    description: 'Aspirasi telah masuk ke dalam antrean sistem dan menunggu peninjauan tim Humas.',
  },
  ditinjau: {
    label: 'Sedang Ditinjau',
    color: 'bg-indigo-500',
    badgeBg: 'bg-indigo-50 border-indigo-200',
    badgeText: 'text-indigo-700',
    description: 'Humas sedang memeriksa isi, urgensi, kelengkapan, dan jalur tindak lanjut.',
  },
  diteruskan: {
    label: 'Diteruskan ke Pihak Terkait',
    color: 'bg-purple-500',
    badgeBg: 'bg-purple-50 border-purple-200',
    badgeText: 'text-purple-700',
    description: 'Aspirasi telah dikoordinasikan dan diteruskan ke pihak berwenang (Dosen, Lab, atau Dekanat).',
  },
  dalam_proses: {
    label: 'Dalam Proses',
    color: 'bg-amber-500',
    badgeBg: 'bg-amber-50 border-amber-200',
    badgeText: 'text-amber-700',
    description: 'Tindak lanjut sedang berjalan secara aktif oleh pihak yang bersangkutan.',
  },
  selesai: {
    label: 'Selesai',
    color: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    badgeText: 'text-emerald-700',
    description: 'Tindak lanjut telah terealisasi atau mendapatkan penyelesaian yang tuntas.',
  },
  tidak_dapat_ditindaklanjuti: {
    label: 'Tidak Dapat Ditindaklanjuti',
    color: 'bg-rose-500',
    badgeBg: 'bg-rose-50 border-rose-200',
    badgeText: 'text-rose-700',
    description: 'Aspirasi tidak memungkinkan untuk diwujudkan karena batasan wewenang atau regulasi, dengan penjelasan resmi.',
  },
  ditutup: {
    label: 'Ditutup',
    color: 'bg-slate-500',
    badgeBg: 'bg-slate-50 border-slate-200',
    badgeText: 'text-slate-700',
    description: 'Proses administrasi dan komunikasi untuk tiket ini telah selesai.',
  },
};
