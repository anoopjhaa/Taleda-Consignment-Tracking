'use client';

import { login } from '@/actions/auth';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="btn btn-primary w-full bg-slate-900 text-white mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? 'Signing in...' : 'Sign In'}
    </button>
  );
}

const initialState = {
  error: '',
};

export default function AdminLogin() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="card w-full max-w-md p-8 bg-white">
        <div className="flex justify-center mb-6">
           {/* CODE POINTER: Login Logo Size. Change 'h-20' to 'h-16', 'h-24' etc. */}
           <img src="/logo.png" alt="Taleda Specialty Chemicals" className="h-20 w-auto object-contain" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Admin Portal</h2>
        
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
              {state.error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input name="username" type="text" className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input name="password" type="password" className="input" required />
          </div>
          
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
