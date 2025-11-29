import Icon from '@/components/ui/icon';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({ rating, onRatingChange, readonly = false, size = 20 }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly}
          className={`transition-colors ${!readonly ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Icon
            name={star <= rating ? 'Star' : 'StarOff'}
            size={size}
            className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}
          />
        </button>
      ))}
    </div>
  );
}
