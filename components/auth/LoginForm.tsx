"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import api from "@/lib/axios";
import { Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

function LoginFormContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

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
      setError(Array.isArray(msg) ? msg.join(", ") : msg || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {registered && (
        <div className="mb-5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Registration successful! Please sign in with your new account.</span>
        </div>
      )}

      {error && (
        <div className="mb-5 text-xs font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 p-3.5 rounded-xl border border-red-200/60 dark:border-red-800/60 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              placeholder="user@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-10 pr-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all bg-slate-50/30 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 pl-10 pr-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all bg-slate-50/30 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-zinc-900 dark:bg-amber-600 py-3 text-sm font-semibold text-white hover:bg-black dark:hover:bg-amber-700 disabled:opacity-50 transition-all duration-200 shadow-md shadow-zinc-900/10 dark:shadow-amber-600/10 active:scale-[0.98] mt-2 cursor-pointer"
        >
          {loading ? "Processing..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
        >
          Sign up here
        </Link>
      </p>
    </>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div className="text-center py-4 text-xs text-slate-400">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
