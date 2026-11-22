export type AspirationStatus =
  | 'diterima'
  | 'ditinjau'
  | 'diteruskan'
  | 'dalam_proses'
  | 'selesai'
  | 'tidak_dapat_ditindaklanjuti'
  | 'ditutup';

export type AspirationPriority = 'rendah' | 'sedang' | 'tinggi';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
}

export interface StatusHistoryItem {
  id: string;
  aspirationId: string;
  status: AspirationStatus;
  label: string;
  publicMessage?: string;
  changedAt: string;
  changedByRole?: string;
}

export interface Aspiration {
  id: string;
  ticketCode: string;
  categoryId: string;
  categoryName: string;
  title: string;
  body: string;
  isAnonymous: boolean;
  senderName?: string;
  senderContact?: string;
  senderGeneration?: string;
  publicConsent: boolean;
  visibility: 'private' | 'public';
  status: AspirationStatus;
  priority: AspirationPriority;
  assignedTo?: string;
  publicResponse?: string;
  internalNotes?: string;
  history: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface SubmitAspirationInput {
  categoryId: string;
  title: string;
  body: string;
  isAnonymous: boolean;
  senderName?: string;
  senderContact?: string;
  senderGeneration?: string;
  publicConsent: boolean;
}
