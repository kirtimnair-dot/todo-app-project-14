import { Check } from 'lucide-react';
export default function Brand({ light = false }: { light?: boolean }) {
  return <div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white shadow-sm"><Check size={23} strokeWidth={3} /></span><span className={`text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>TaskFlow</span></div>;
}
