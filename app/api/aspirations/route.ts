import { NextResponse } from 'next/server';
import { createAspiration, getStatsSummary } from '@/lib/store';
import { SubmitAspirationInput } from '@/lib/types';

export async function GET() {
  const stats = getStatsSummary();
  return NextResponse.json({
    success: true,
    stats,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server-side validation
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: 'Judul aspirasi wajib diisi minimal 5 karakter.' },
        { status: 400 }
      );
    }

    if (!body.body || typeof body.body !== 'string' || body.body.trim().length < 15) {
      return NextResponse.json(
        { success: false, message: 'Isi aspirasi wajib diisi minimal 15 karakter agar dapat ditelaah dengan baik.' },
        { status: 400 }
      );
    }

    if (body.body.trim().length > 3000) {
      return NextResponse.json(
        { success: false, message: 'Isi aspirasi maksimal 3000 karakter.' },
        { status: 400 }
      );
    }

    if (!body.categoryId || typeof body.categoryId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Silakan pilih kategori aspirasi yang relevan.' },
        { status: 400 }
      );
    }

    const input: SubmitAspirationInput = {
      categoryId: body.categoryId,
      title: body.title,
      body: body.body,
      isAnonymous: Boolean(body.isAnonymous),
      senderName: body.senderName,
      senderContact: body.senderContact,
      senderGeneration: body.senderGeneration,
      publicConsent: Boolean(body.publicConsent),
    };

    const newAspiration = createAspiration(input);

    return NextResponse.json({
      success: true,
      message: 'Aspirasi Anda berhasil dicatat!',
      ticketCode: newAspiration.ticketCode,
      createdAt: newAspiration.createdAt,
    });
  } catch (error) {
    console.error('Error submitting aspiration:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat menyimpan aspirasi.' },
      { status: 500 }
    );
  }
}
