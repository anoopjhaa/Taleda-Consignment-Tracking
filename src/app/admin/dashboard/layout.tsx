import { getSession, logout } from '@/actions/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20">
        <div className="p-6 font-bold text-xl text-white border-b border-slate-800 flex items-center justify-center gap-2">
           {/* CODE POINTER: Sidebar Logo Size. Change 'h-12' to 'h-10' etc. */}
           <img src="/logo.png" alt="Taleda" className="h-12 w-auto bg-white rounded-md p-0.5" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
           <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
             <span>📦</span> Overview
           </Link>
           <Link href="/admin/dashboard/create" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
             <span>➕</span> New Consignment
           </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 mb-2 px-2">Signed in as {session.username as string}</div>
          <form action={logout}>
             <button className="w-full text-left p-2 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded transition-colors flex items-center gap-2">
               <span>🚪</span> Logout
             </button>
          </form>
        </div>
      </aside>
      
      {/* Content */}
      <main className="flex-1 overflow-auto p-8 relative">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
