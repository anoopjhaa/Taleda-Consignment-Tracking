import { getConsignment } from '@/actions/consignment';
import Map from '@/components/Map';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function TrackingPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const data = await getConsignment(params.id) as any;

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Consignment Not Found</h1>
        <p className="text-slate-500 mb-6">We couldn't find a package with tracking number: {params.id}</p>
        <Link href="/" className="btn btn-primary bg-slate-900 text-white rounded-lg px-6 py-2">Go Back</Link>
      </div>
    );
  }

  // Parse Data
  const senderCoords = JSON.parse(data.sender_coords);
  const receiverCoords = JSON.parse(data.receiver_coords);
  
  const now = new Date();
  const dispatchDate = new Date(data.dispatch_date);
  const etaDate = new Date(data.eta_date);
  
  const totalDuration = etaDate.getTime() - dispatchDate.getTime();
  const elapsedDuration = now.getTime() - dispatchDate.getTime();
  
  let progress = 0;
  if (totalDuration > 0) {
    progress = elapsedDuration / totalDuration;
  }
  
  // Status Overrides
  if (data.status === 'Delivered') progress = 1;
  else if (data.status === 'Booked') progress = 0;
  
  // Clamping
  progress = Math.max(0, Math.min(progress, 1));
  
  const distanceCovered = (data.distance_km * progress).toFixed(1);
  const totalDays = totalDuration / (1000 * 60 * 60 * 24);
  const speed = totalDays > 0 ? (data.distance_km / totalDays).toFixed(0) : 0;
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          {/* CODE POINTER: Tracking Logo Size. Change 'h-12' to 'h-10' etc. */}
          <img src="/logo.png" alt="Taleda" className="h-12 w-auto object-contain" />
        </Link>
        <div className="text-sm font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-600">
          {data.tracking_number}
        </div>
      </nav>

      <main className="container py-8">
        {/* Status Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">Tracking Details</h1>
              <span className={`badge ${
                data.status === 'Delivered' ? 'badge-green' : 
                data.status === 'Delayed' ? 'badge-red' : 
                'badge-blue'
              }`}>
                {data.status}
              </span>
            </div>
            <p className="text-slate-500">
              Dispatched on {dispatchDate.toLocaleDateString()} &bull; ETA {etaDate.toLocaleDateString()}
            </p>
          </div>
          
          <div className="text-right hidden md:block">
            <div className="text-sm text-slate-500">Estimated Speed</div>
            <div className="text-xl font-bold">{speed} km/day</div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Details */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-bold mb-4 border-b border-slate-100 pb-2">Route Information</h3>
              
              <div className="relative border-l-2 border-slate-200 ml-3 pl-6 pb-6 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-white shadow-sm"></div>
                  <div className="text-sm text-slate-500">From</div>
                  <div className="font-semibold text-lg">{data.sender_city}</div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                  <div className="text-sm text-slate-500">To</div>
                  <div className="font-semibold text-lg">{data.receiver_city}</div>
                </div>
              </div>
            </div>

            <div className="card bg-slate-900 text-white border-none shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-slate-200">Live Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1 text-slate-400">
                    <span>Distance Covered</span>
                    <span>{distanceCovered} / {data.distance_km.toFixed(1)} km</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-1000" 
                      style={{ width: `${progress * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <div className="text-xs text-slate-400">Timeline</div>
                    <div className="font-mono text-lg">{(progress * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Remaining</div>
                    <div className="font-mono text-lg">{Math.max(0, (data.distance_km - parseFloat(distanceCovered))).toFixed(1)} km</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="lg:col-span-2 h-[500px] card p-0 relative overflow-hidden flex flex-col">
             <div className="flex-1 w-full relative z-0">
               <Map 
                 sender={{ ...senderCoords, city: data.sender_city }} 
                 receiver={{ ...receiverCoords, city: data.receiver_city }} 
                 progress={progress}
               />
             </div>
             <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-slate-200 z-[400] text-xs text-slate-600 flex justify-between">
                <span>📍 Live Route Check</span>
                <span>Auto-updated based on ETA</span>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
