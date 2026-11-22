import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    default: 'SUARA TK — Suara Teknik Komputer | Humas HIMTEK',
    template: '%s | SUARA TK',
  },
  description:
    'Kanal komunikasi aspirasi, kritik, saran, ide kegiatan, dan kendala mahasiswa Teknik Komputer kepada HIMTEK. Dengar, Catat, Tindaklanjuti.',
  keywords: [
    'SUARA TK',
    'HIMTEK',
    'Teknik Komputer',
    'Aspirasi Mahasiswa',
    'Kotak Saran Online',
    'Humas HIMTEK',
  ],
  manifest: '/manifest.json',
  openGraph: {
    title: 'SUARA TK — Suara Teknik Komputer',
    description: 'Kanal aspirasi resmi mahasiswa Teknik Komputer. Sampaikan masukan, kritik, dan ide Anda secara aman dan terorganisir.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'SUARA TK',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
