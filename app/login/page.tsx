"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/axios";

export default function LoginPage() {
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
      setError(
        err.response?.data?.message || "Login gagal, periksa email/password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-md"
      >
        <h2 className="mb-6 text-2xl font-bold text-center">
          Login Realtime Chat
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email / Username
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Login"}
        </button>
      </form>
    </div>
  );
}
