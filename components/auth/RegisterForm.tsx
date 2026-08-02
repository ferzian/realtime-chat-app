"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", { name, email, password });
      router.push("/login?registered=true");
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(
        Array.isArray(msg) ? msg.join(" | ") : msg || "Registrasi gagal.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 text-xs font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Nama
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={3}
            maxLength={50}
            placeholder="pengguna"
            className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-500 text-gray-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            placeholder="contoh@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-500 text-gray-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={32}
            placeholder="********"
            className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-500 text-gray-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 mt-2"
        >
          {loading ? "Memproses..." : "Daftar Sekarang"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Masuk di sini
        </Link>
      </p>
    </>
  );
}
