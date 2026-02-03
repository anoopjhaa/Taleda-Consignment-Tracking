'use client';

import { deleteConsignment } from '@/actions/consignment';
import Link from 'next/link';
import { useState } from 'react';

export default function ConsignmentTable({ consignments }: { consignments: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const filtered = consignments.filter(c => 
    c.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sender_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.receiver_city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this consignment?')) return;
    
    setDeletingId(id);
    try {
       const result = await deleteConsignment(id);
       if (result?.error) {
         alert(result.error);
       }
    } catch (e) {
      alert('An error occurred while deleting.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card bg-white overflow-hidden p-0">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-700">Recent Consignments</h3>
        <input 
          type="text" 
          placeholder="Search..." 
          className="input w-64 text-sm py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="p-4">Tracking ID</th>
              <th className="p-4">Route</th>
              <th className="p-4">Status</th>
              <th className="p-4">Dispatch</th>
              <th className="p-4">ETA</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-mono font-medium text-slate-700">{c.tracking_number}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{c.sender_city}</span>
                    <span className="text-xs text-slate-400">to {c.receiver_city}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`badge ${
                    c.status === 'Delivered' ? 'badge-green' : 
                    c.status === 'Delayed' ? 'badge-red' : 
                    'badge-blue'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500">
                  {new Date(c.dispatch_date).toLocaleDateString()}
                </td>
                <td className="p-4 text-slate-500">
                  {new Date(c.eta_date).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/dashboard/edit/${c.id}`}
                      className="btn btn-outline text-xs px-2 py-1 h-8"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(c.id)} 
                      disabled={deletingId === c.id}
                      className="btn btn-danger text-xs px-2 py-1 h-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === c.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No consignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
