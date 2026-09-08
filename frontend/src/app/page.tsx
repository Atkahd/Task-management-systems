import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      
      <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
        The smarter way to manage your tasks
      </div>

      <h1 className="max-w-4xl text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
        Your workflow, <br />
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          beautifully simplified.
        </span>
      </h1>

      

      <div className="bg-white/[0.055] border border-white/[0.09] backdrop-blur-[25px] shadow-[0_25px_80px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)] rounded-[24px] p-8 sm:p-10 w-full max-w-lg mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold hover:-translate-y-1 shadow-[0_15px_40px_rgba(99,102,241,0.3)] transition-all duration-300"
          >
            Log in →
          </Link>
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-300"
          >
            Start Free
          </Link>
        </div>
      </div>

    </main>
  );
}