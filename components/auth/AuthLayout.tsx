import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFD] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-200 selection:text-amber-900 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 flex items-center justify-center relative px-4 py-12 sm:py-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-140 h-96 bg-linear-to-tr from-amber-200/30 dark:from-amber-900/20 to-slate-200/40 dark:to-slate-800/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl shadow-slate-300/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative z-10 transition-colors duration-200">
          <div className="flex flex-col items-center text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          </div>

          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
