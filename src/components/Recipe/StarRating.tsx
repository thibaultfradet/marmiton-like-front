import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number | null;
  onRate?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}

export default function StarRating({ value, onRate, readonly = false, size = 'md' }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? value ?? 0;

  const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Note">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRate?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(null)}
          className={cn(
            'transition-transform',
            !readonly && 'cursor-pointer hover:scale-110',
            readonly && 'cursor-default',
          )}
          aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
        >
          <Star
            className={cn(
              iconClass,
              'transition-colors',
              star <= active
                ? 'fill-primary text-primary'
                : 'fill-transparent text-muted-foreground/40',
            )}
          />
        </button>
      ))}
    </div>
  );
}
