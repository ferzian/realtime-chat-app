import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg text-center bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-3">Realtime Chat App</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Selamat datang di aplikasi obrolan real-time. Silakan masuk atau daftar akun baru untuk memulai percakapan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="flex-1 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-md shadow-blue-500/20"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="flex-1 rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition border border-slate-200"
          >
            Daftar
          </Link>
        </div>
      </div>
    </div>
  );
}