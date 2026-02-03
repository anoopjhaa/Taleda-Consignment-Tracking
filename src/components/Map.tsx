'use client';

import dynamic from 'next/dynamic';

const MapInner = dynamic(() => import('./MapInner'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Tracking Map...</div> 
});

export default function Map(props: any) {
  return <MapInner {...props} />;
}
