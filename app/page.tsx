import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Zap,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Users,
  Search,
  Send,
  MoreVertical,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFD] text-slate-900 font-sans selection:bg-amber-200 selection:text-amber-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-28 px-4 sm:px-6 lg:px-8">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-linear-to-tr from-amber-200/30 to-slate-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-amber-900 bg-amber-100/80 border border-amber-200/70 uppercase shadow-xs mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Redefining Presence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Experience Real-Time Connection with{" "}
                <span className="text-[#C59B27] inline-block relative">
                  Elegance
                  <span className="absolute bottom-1 left-0 w-full h-0.75 bg-amber-400/40 rounded-full" />
                </span>
              </h1>

              <p className="text-slate-600 text-lg sm:text-xl font-normal leading-relaxed mt-5 max-w-xl">
                A minimalist sanctuary for your conversations. Designed for
                focus, armored with rigor, and delivered with effortless fluid
                motions.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8 w-full sm:w-auto">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center bg-zinc-900 hover:bg-black text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-zinc-900/15 transition-all duration-200 hover:scale-[1.02] active:scale-95 text-center"
                >
                  Start Chatting
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:border-slate-300 active:scale-95 text-center shadow-xs"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-1.5 bg-linear-to-r from-amber-200/50 to-slate-200/50 rounded-3xl blur-xl opacity-70 -z-10" />

                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl shadow-slate-300/60 border border-slate-100/90 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-linear-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white font-semibold text-base shadow-sm">
                          CA
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-base leading-tight">
                          Caesar Arifin
                        </h3>
                        <p className="text-xs text-slate-400">
                          @caesar • Online
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 transition">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 py-2">
                    <div className="flex flex-col items-start max-w-[85%]">
                      <div className="bg-slate-100 text-slate-800 p-3.5 rounded-2xl rounded-tl-xs text-sm leading-relaxed shadow-xs">
                        Fer
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 ml-1">
                        07:10 PM
                      </span>
                    </div>

                    <div className="flex flex-col items-end max-w-[85%] ml-auto">
                      <div className="bg-zinc-900 text-white p-3.5 rounded-2xl rounded-tr-xs text-sm leading-relaxed shadow-md shadow-zinc-900/10">
                        Oii
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 mr-1">
                        07:36 PM
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 pt-2 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Crafted for Clarity
              </h2>
              <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
                Focus on what matters most. Our feature set is meticulously
                curated to enhance your communication without the clutter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-slate-50/70 hover:bg-white border border-slate-100 hover:border-amber-200/80 p-8 rounded-2xl transition-all duration-300 shadow-xs hover:shadow-xl hover:shadow-amber-500/5 group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-amber-100/80 border border-amber-200/60 flex items-center justify-center text-amber-700 mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Instant Messaging
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Experience zero-latency transmission. Your thoughts reach
                  their destination the moment they are shared.
                </p>
              </div>

              <div className="bg-slate-50/70 hover:bg-white border border-slate-100 hover:border-amber-200/80 p-8 rounded-2xl transition-all duration-300 shadow-xs hover:shadow-xl hover:shadow-amber-500/5 group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-amber-100/80 border border-amber-200/60 flex items-center justify-center text-amber-700 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Military-grade Security
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  End-to-end encryption that meets the highest global standards.
                  Your privacy is not a feature, it's a foundation.
                </p>
              </div>

              <div className="bg-slate-50/70 hover:bg-white border border-slate-100 hover:border-amber-200/80 p-8 rounded-2xl transition-all duration-300 shadow-xs hover:shadow-xl hover:shadow-amber-500/5 group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-amber-100/80 border border-amber-200/60 flex items-center justify-center text-amber-700 mb-6 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Seamless Sync
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Switch devices with total continuity. Your history and active
                  threads follow you everywhere, instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SHOWCASE SECTION */}
        <section
          id="canvas"
          className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#FAFBFD]"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex flex-col items-start">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-6">
                A Canvas for Conversation
              </h2>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-slate-700 text-base font-medium">
                    Dynamic blur transitions for depth perception
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-slate-700 text-base font-medium">
                    Adaptive dark and light modes for any hour
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-slate-700 text-base font-medium">
                    Intelligent message grouping with 4px rhythm
                  </span>
                </li>
              </ul>

              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-[#785C1D] hover:bg-[#604916] text-white px-7 py-3.5 rounded-xl font-medium shadow-md transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Explore Experience</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Banner Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-[#141416] text-white rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl border border-zinc-800">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight relative z-10">
              Ready for a more <span className="text-amber-400">focused</span>{" "}
              connection?
            </h2>

            <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg mt-4 mb-8 relative z-10 leading-relaxed">
              Join thousands of professionals who have already simplified their
              real-time communication.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#FDE68A] hover:bg-[#FCD34D] text-slate-950 font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg active:scale-95"
              >
                Create Free Account
              </Link>
              <Link
                href="/auth/login"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all border border-zinc-700 active:scale-95"
              >
                View Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
