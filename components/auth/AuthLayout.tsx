import { ReactNode } from "react";

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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
          {title}
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
