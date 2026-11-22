import { NextResponse } from 'next/server';
import { getAspirationByTicket } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { ticket: string } }
) {
  const ticket = params.ticket;
  if (!ticket) {
    return NextResponse.json(
      { success: false, message: 'Kode tiket tidak valid.' },
      { status: 400 }
    );
  }

  const aspiration = getAspirationByTicket(ticket);

  if (!aspiration) {
    return NextResponse.json(
      {
        success: false,
        message: 'Aspirasi dengan kode tiket tersebut tidak ditemukan. Mohon periksa kembali penulisan kode tiket Anda.',
      },
      { status: 404 }
    );
  }

  // Sanitize data according to Privacy Guidelines (Section 6 F-05)
  // Hide internal notes, admin real IDs, and private sender details
  const sanitizedAspiration = {
    ticketCode: aspiration.ticketCode,
    title: aspiration.title,
    body: aspiration.body,
    categoryName: aspiration.categoryName,
    isAnonymous: aspiration.isAnonymous,
    senderName: aspiration.isAnonymous ? 'Mahasiswa Anonim' : aspiration.senderName,
    senderGeneration: aspiration.isAnonymous ? undefined : aspiration.senderGeneration,
    status: aspiration.status,
    publicResponse: aspiration.publicResponse,
    createdAt: aspiration.createdAt,
    updatedAt: aspiration.updatedAt,
    history: aspiration.history.map((h) => ({
      status: h.status,
      label: h.label,
      publicMessage: h.publicMessage,
      changedAt: h.changedAt,
      changedByRole: h.changedByRole || 'Tim Humas HIMTEK',
    })),
  };

  return NextResponse.json({
    success: true,
    aspiration: sanitizedAspiration,
  });
}
