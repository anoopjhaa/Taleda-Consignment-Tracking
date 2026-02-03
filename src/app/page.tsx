import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Home() {
  async function trackAction(formData: FormData) {
    'use server';
    const id = formData.get('id');
    if (id) {
      redirect(`/track/${id}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="p-4 bg-white shadow-sm flex justify-between items-center z-10 relative">
        <div className="font-bold text-xl text-slate-800 flex items-center gap-2">
           {/* 
               CODE POINTER: Navbar Logo Size
               Change 'h-12' to 'h-10', 'h-16', etc. to resize.
           */}
          <img src="/logo.png" alt="Taleda Specialty Chemicals" className="h-12 w-auto object-contain" />
        </div>
        {/* Admin Login Removed */}
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
           <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-200 rounded-full blur-3xl"></div>
        </div>

        {/* Central Hero Logo */}
        <div className="relative z-10 mb-8">
           <img 
              src="/logo.png" 
              alt="Taleda Specialty Chemicals" 
              className="h-32 md:h-60 w-auto object-contain drop-shadow-sm" 
              /* 
                 CODE POINTER: Hero Logo Size
                 Change 'h-32 md:h-60' to resize.
              */
           />
        </div>

        <h1 className="relative z-10 title text-5xl md:text-6xl mb-4 text-slate-900">
          Track Your Consignment
          <br />
          <span className="text-emerald-500">In Real-Time</span>
        </h1>
        <p className="relative z-10 text-slate-600 text-lg mb-8 max-w-2xl">
          Enter your tracking number below to see live updates, accurate ETA, and map visualization.
        </p>

        <div className="relative z-10 w-full max-w-md bg-white p-2 rounded-xl shadow-lg border border-slate-100">
          <form action={trackAction} className="flex gap-2">
            <input 
              name="id" 
              type="text" 
              placeholder="e.g. CN-123456" 
              className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              required 
            />
            <button type="submit" className="btn btn-primary bg-slate-900 hover:bg-slate-800 text-white px-6 rounded-lg font-medium">
              Track
            </button>
          </form>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl w-full">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-50 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-bold text-lg mb-2">Global Tracking</h3>
            <p className="text-slate-500 text-sm">Real-time location updates from anywhere in the world.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-50 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
            <p className="text-slate-500 text-sm">Optimized routes ensuring your package arrives on time.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-50 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="font-bold text-lg mb-2">Secure & Reliable</h3>
            <p className="text-slate-500 text-sm">Trusted by thousands of businesses for safe transport.</p>
          </div>
        </div>
      </main>

      <footer className="text-center p-6 text-slate-400 text-sm">
        © 2026 Taleda Specialty Chemicals. All rights reserved.
      </footer>
    </div>
  );
}
