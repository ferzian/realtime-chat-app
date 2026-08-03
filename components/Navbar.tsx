'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5 fill-white/20" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              Realtime<span className="text-amber-600">Chat</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold text-white bg-zinc-900 hover:bg-black px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
            >
              Register
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-100 px-4 pt-2 pb-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-slate-50 transition"
          >
            Home
          </Link>
          <Link
            href="/auth/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-slate-50 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center mt-2 px-4 py-2.5 rounded-xl text-base font-semibold text-white bg-zinc-900 hover:bg-black transition shadow-sm"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
}
