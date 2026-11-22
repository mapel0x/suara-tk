export default function GlobalLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md animate-pulse">
          <span className="font-extrabold text-lg tracking-tight">TK</span>
        </div>
        <div className="flex gap-1.5 items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
        </div>
        <p className="text-sm text-slate-500 font-medium">Memuat halaman...</p>
      </div>
    </div>
  );
}
