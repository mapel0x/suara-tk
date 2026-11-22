import { NextResponse } from 'next/server';
import { getAllAspirations, getAspirationByTicket, getStatsSummary } from '@/lib/store';
import { AspirationStatus, AspirationPriority } from '@/lib/types';
import { STATUS_CONFIG } from '@/lib/constants';

export async function GET() {
  const aspirations = getAllAspirations();
  const stats = getStatsSummary();

  return NextResponse.json({
    success: true,
    aspirations,
    stats,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { ticketCode, status, priority, publicResponse, internalNotes } = body;

    if (!ticketCode) {
      return NextResponse.json(
        { success: false, message: 'Kode tiket wajib disertakan.' },
        { status: 400 }
      );
    }

    const aspiration = getAspirationByTicket(ticketCode);
    if (!aspiration) {
      return NextResponse.json(
        { success: false, message: 'Aspirasi tidak ditemukan.' },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    if (status && status !== aspiration.status) {
      aspiration.status = status as AspirationStatus;

      const statusConf = STATUS_CONFIG[status] || { label: status };
      aspiration.history.push({
        id: `hist-${Date.now()}`,
        aspirationId: aspiration.id,
        status: aspiration.status,
        label: `Status diperbarui: ${statusConf.label}`,
        publicMessage: publicResponse || statusConf.description,
        changedAt: now,
        changedByRole: 'Admin Humas HIMTEK',
      });
    }

    if (priority) {
      aspiration.priority = priority as AspirationPriority;
    }

    if (publicResponse !== undefined) {
      aspiration.publicResponse = publicResponse;
    }

    if (internalNotes !== undefined) {
      aspiration.internalNotes = internalNotes;
    }

    aspiration.updatedAt = now;

    return NextResponse.json({
      success: true,
      message: 'Aspirasi berhasil diperbarui.',
      aspiration,
    });
  } catch (error) {
    console.error('Error updating aspiration:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status.' },
      { status: 500 }
    );
  }
}
