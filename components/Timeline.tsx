import React from 'react';
import { StatusHistoryItem } from '@/lib/types';
import { STATUS_CONFIG } from '@/lib/constants';
import { CheckCircle2, Clock, AlertCircle, UserCheck } from 'lucide-react';

interface TimelineProps {
  history: StatusHistoryItem[];
}

export default function Timeline({ history }: TimelineProps) {
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const getStatusIcon = (status: string, isLast: boolean) => {
    if (status === 'selesai') {
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
    if (status === 'tidak_dapat_ditindaklanjuti') {
      return <AlertCircle className="w-5 h-5 text-rose-600" />;
    }
    if (isLast) {
      return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
    }
    return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {history.map((item, index) => {
        const isLatest = index === history.length - 1;
        const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.diterima;

        return (
          <div key={item.id || index} className="relative group">
            {/* Dot marker */}
            <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-sm">
              {getStatusIcon(item.status, isLatest)}
            </div>

            {/* Content card */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                isLatest
                  ? 'bg-blue-50/40 border-blue-200 shadow-sm'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <span className="font-semibold text-slate-900 text-sm sm:text-base">
                  {item.label || config.label}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {formatDate(item.changedAt)}
                </span>
              </div>

              {item.publicMessage && (
                <p className="text-sm text-slate-700 leading-relaxed mb-2.5">
                  {item.publicMessage}
                </p>
              )}

              {item.changedByRole && (
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Diverifikasi oleh: {item.changedByRole}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
