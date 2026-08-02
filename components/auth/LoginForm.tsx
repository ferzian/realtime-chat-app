"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import api from "@/lib/axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.access_token || res.data.token;

      if (token) {
        Cookies.set("token", token, { expires: 7 });
        router.push("/chat");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(", ") : msg || "Login gagal.");
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

      <form onSubmit={handleLogin} className="space-y-4">
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
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-500 text-gray-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Belum punya akun?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-blue-600 hover:underline"
        >
          Daftar di sini
        </Link>
      </p>
    </>
  );
}
