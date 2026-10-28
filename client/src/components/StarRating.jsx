import { Star, StarHalf } from 'lucide-react';

export default function StarRating({
  rating = 0,
  maxStars = 5,
  size = 'sm',
  interactive = false,
  onChange,
  showValue = false,
  count,
}) {
  const sizeMap = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const iconSize = sizeMap[size] || sizeMap.sm;

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    const filled = rating >= i;
    const halfFilled = !filled && rating >= i - 0.5;

    stars.push(
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => handleClick(i)}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform disabled:cursor-default`}
        aria-label={`${i} star${i > 1 ? 's' : ''}`}
      >
        {filled ? (
          <Star className={`${iconSize} fill-yellow-400 text-yellow-400`} />
        ) : halfFilled ? (
          <StarHalf className={`${iconSize} fill-yellow-400 text-yellow-400`} />
        ) : (
          <Star className={`${iconSize} text-surface-300`} />
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-surface-600">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="ml-1 text-sm text-surface-400">({count})</span>
      )}
    </div>
  );
}
