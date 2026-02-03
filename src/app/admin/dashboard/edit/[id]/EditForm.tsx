'use client';

import { updateConsignment } from '@/actions/consignment';
import LocationInput from '@/components/LocationInput';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function EditConsignmentForm({ data }: { data: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(event.currentTarget);
    const res = await updateConsignment(formData);
    setLoading(false);
    
    if (res?.error) {
       setStatus({ type: 'error', message: res.error });
    } else {
       setStatus({ type: 'success', message: 'Consignment updated successfully!' });
       setTimeout(() => router.push('/admin/dashboard'), 1500);
    }
  }

  // Calculate ETA Days for display
  const etaDate = new Date(data.eta_date);
  const dispatchDate = new Date(data.dispatch_date);
  // Simple diff in days
  const diffTime = Math.abs(etaDate.getTime() - dispatchDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Edit Consignment</h1>
      
      {status && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <span>{status.type === 'success' ? '✅' : '⚠️'}</span>
          {status.message}
        </div>
      )}
      
      <div className="card bg-white p-8 border-t-4 border-t-blue-600">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={data.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="input-group">
              <label className="label">Tracking Number</label>
              <input 
                name="tracking_number" 
                type="text" 
                defaultValue={data.tracking_number}
                className="input bg-slate-100 cursor-not-allowed" 
                readOnly
              />
            </div>
            
             <div className="input-group">
              <label className="label">Status</label>
               <select name="status" className="input bg-white h-[46px]" defaultValue={data.status}>
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
                 defaultValue={data.sender_city}
                 required 
                />
            </div>
            <div className="input-group">
               <LocationInput 
                 name="receiver_city" 
                 label="To Location" 
                 defaultValue={data.receiver_city}
                 required 
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="input-group">
              <label className="label">ETA (Days or Date)</label>
              <input 
                name="eta" 
                type="text" 
                defaultValue={diffDays.toString()} // defaulting to days for simplicity
                className="input" 
                required 
              />
            </div>
             <div className="input-group">
              <label className="label">Dispatch Date</label>
              <input 
                name="dispatch_date" 
                type="date" 
                defaultValue={new Date(data.dispatch_date).toISOString().split('T')[0]}
                className="input" 
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary min-w-[140px]"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
