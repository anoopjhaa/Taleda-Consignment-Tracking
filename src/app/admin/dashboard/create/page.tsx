'use client';

import { createConsignment } from '@/actions/consignment';
import LocationInput from '@/components/LocationInput';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function CreateConsignmentPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(event.currentTarget);
    const res = await createConsignment(formData);
    setLoading(false);
    
    if (res?.error) {
       setStatus({ type: 'error', message: res.error });
    } else {
       setStatus({ type: 'success', message: 'Consignment created successfully!' });
       setTimeout(() => router.push('/admin/dashboard'), 1500);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Create New Consignment</h1>
      
      {status && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          status.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          <span>{status.type === 'success' ? '✅' : '⚠️'}</span>
          {status.message}
        </div>
      )}
      
      <div className="card bg-white p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Number</label>
              <input 
                name="tracking_number" 
                type="text" 
                placeholder="CN-XXXXXX"
                className="input" 
                required 
              />
            </div>
            
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
               <select name="status" className="input bg-white h-[46px]" defaultValue="Booked">
                <option value="Booked">Booked</option>
                <option value="In Transit">In Transit</option>
                <option value="Delayed">Delayed</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="input-group">
               <LocationInput 
                 name="sender_city" 
                 label="From Location" 
                 placeholder="Search City..."
                 required 
                />
            </div>
            <div className="input-group">
               <LocationInput 
                 name="receiver_city" 
                 label="To Location" 
                 placeholder="Search City..."
                 required 
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ETA</label>
              <div className="text-xs text-slate-500 mb-1">Enter number of days OR a date (YYYY-MM-DD)</div>
              <input 
                name="eta" 
                type="text" 
                placeholder="e.g. 5 or 2026-02-10"
                className="input" 
                required 
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dispatch Date</label>
               <div className="text-xs text-slate-500 mb-1">Defaults to today if empty</div>
              <input 
                name="dispatch_date" 
                type="date" 
                className="input" 
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-4 py-2 text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`btn btn-primary bg-slate-900 text-white min-w-[120px] ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? 'Creating...' : 'Create Consignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
