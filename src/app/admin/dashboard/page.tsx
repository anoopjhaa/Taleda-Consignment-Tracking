import { getAllConsignments } from '@/actions/consignment';
import ConsignmentTable from '@/components/ConsignmentTable';

export default async function DashboardPage() {
  const consignments = await getAllConsignments();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Manage your logistics operations.</p>
        </div>
        
        {/* Quick Stats or Actions */}
        <div className="flex gap-4">
           {/* Maybe export button? */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex flex-col justify-between">
           <div className="text-slate-500 text-sm font-medium uppercase">Active Shipments</div>
           <div className="text-3xl font-bold text-slate-800">
             {consignments.filter((c: any) => c.status !== 'Delivered').length}
           </div>
        </div>
        <div className="card p-6 flex flex-col justify-between">
           <div className="text-slate-500 text-sm font-medium uppercase">Delivered This Month</div>
           <div className="text-3xl font-bold text-slate-800">
             {consignments.filter((c: any) => c.status === 'Delivered').length}
           </div>
        </div>
        <div className="card p-6 flex flex-col justify-between">
           <div className="text-slate-500 text-sm font-medium uppercase">Total Distance (km)</div>
           <div className="text-3xl font-bold text-slate-800">
             {consignments.reduce((acc: number, c: any) => acc + (c.distance_km || 0), 0).toFixed(0)}
           </div>
        </div>
      </div>

      <ConsignmentTable consignments={consignments} />
    </div>
  );
}
