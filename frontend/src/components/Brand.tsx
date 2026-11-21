import { Check } from 'lucide-react';

interface BrandProps {
  variant?: 'light' | 'dark' | 'hero';
  size?: 'sm' | 'md';
}

export function Brand({ variant = 'dark', size = 'md' }: BrandProps) {
  const iconBox = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const checkSize = size === 'sm' ? 16 : 18;
  const textSize = size === 'sm' ? 'text-lg' : 'text-xl';

  if (variant === 'hero') {
    return (
      <div className="inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0">
        <span
          className={`${iconBox} rounded-full inline-flex items-center justify-center bg-white text-[#ff6b00] shadow-sm`}
        >
          <Check size={checkSize} strokeWidth={3} />
        </span>
        <span className={`${textSize} font-display font-bold tracking-tight text-white`}>
          TO-DO APP
        </span>
      </div>
    );
  }

  const textColor = variant === 'light' ? 'text-white' : 'text-[#211d1a] dark:text-[#f5f2ef]';

  return (
    <div className="inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0">
      <span
        className={`${iconBox} rounded-full inline-flex items-center justify-center bg-gradient-to-br from-[#ff7d1a] to-[#ff6b00] text-white shadow-sm`}
      >
        <Check size={checkSize} strokeWidth={3} />
      </span>
      <span className={`${textSize} font-display font-bold tracking-tight ${textColor}`}>
        TO-DO APP
      </span>
    </div>
  );
}
