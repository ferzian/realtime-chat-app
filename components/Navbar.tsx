'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5 fill-white/20" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              Realtime<span className="text-amber-600 dark:text-amber-500">Chat</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold text-white bg-zinc-900 dark:bg-amber-600 hover:bg-black dark:hover:bg-amber-700 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
            >
              Register
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800 px-4 pt-2 pb-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Home
          </Link>
          <Link
            href="/auth/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center mt-2 px-4 py-2.5 rounded-xl text-base font-semibold text-white bg-zinc-900 dark:bg-amber-600 hover:bg-black dark:hover:bg-amber-700 transition shadow-sm"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
}
