'use client';

import { useState, useRef, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { MapPin } from 'lucide-react';

interface LocationResult {
  place_id: number;
  display_name: string;
}

interface LocationInputProps {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

export default function LocationInput({ name, label, placeholder, defaultValue, required }: LocationInputProps) {
  const [query, setQuery] = useState(defaultValue || '');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchLocations = useDebouncedCallback(async (term: string) => {
    if (!term || term.length < 3) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(term)}&limit=5`, {
          headers: { 'User-Agent': 'ConsignmentTrackerDemo/1.0' }
      });
      const data = await res.json();
      setResults(data);
      setOpen(true);
    } catch (e) {
      console.error(e);
    }
  }, 300);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    fetchLocations(val);
  };

  const selectLocation = (loc: LocationResult) => {
    setQuery(loc.display_name);
    setOpen(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="label">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input 
          type="text" 
          name={name}
          value={query}
          onChange={handleInput}
          placeholder={placeholder}
          className="input pl-9"
          required={required}
          autoComplete="off"
        />
      </div>
      
      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
          {results.map((r) => (
            <li 
              key={r.place_id}
              onClick={() => selectLocation(r)}
              className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-100 last:border-0"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
