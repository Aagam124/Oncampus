import { Link } from 'react-router-dom';
import { Star, Clock, ShieldCheck, ShoppingBag } from 'lucide-react';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';

export default function ServiceCard({ service }) {
  const {
    _id,
    title,
    description,
    category,
    pricing,
    deliveryTime,
    rating,
    reviewCount,
    orderCount,
    images,
    provider,
  } = service;

  const providerName = provider?.firstName
    ? `${provider.firstName} ${provider.lastName || ''}`
    : provider?.name || 'Campus Student';

  const amount = pricing?.amount ?? service.price ?? 0;
  const pType = pricing?.type ?? service.pricingType ?? 'fixed';

  const displayPrice =
    pType === 'free'
      ? 'Free'
      : pType === 'negotiable'
      ? 'Negotiable'
      : `₹${amount.toLocaleString()}`;

  return (
    <Link
      to={`/services/${_id}`}
      className="group block bg-white dark:bg-surface-900 rounded-3xl border border-surface-200/80 dark:border-surface-800 shadow-sm hover:shadow-card-hover dark:hover:border-brand-500/50 hover:border-brand-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Card Media Preview */}
        <div className="relative aspect-[16/10] bg-surface-100 dark:bg-surface-800 overflow-hidden">
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-50 to-indigo-100 dark:from-surface-800 dark:to-surface-900">
              <ShoppingBag className="w-12 h-12 text-brand-300 dark:text-brand-500/50" />
            </div>
          )}

          {/* Category Tag Overlay */}
          {category && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/90 dark:bg-surface-900/90 backdrop-blur-md text-brand-700 dark:text-brand-300 shadow-xs border border-surface-200/50 dark:border-surface-700/50">
                {category.replace(/-/g, ' ')}
              </span>
            </div>
          )}

          {/* Delivery pill */}
          <div className="absolute bottom-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{deliveryTime || 3}d delivery</span>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* Provider row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar src={provider?.avatar} name={providerName} size="xs" />
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-surface-700 dark:text-surface-200 truncate block">
                  {providerName}
                </span>
                {provider?.university && (
                  <span className="text-[10px] text-surface-400 dark:text-surface-500 truncate block">
                    {provider.university}
                  </span>
                )}
              </div>
            </div>

            {/* Rating pill */}
            <div className="flex items-center gap-1 text-xs font-bold text-surface-900 dark:text-surface-100 bg-surface-50 dark:bg-surface-800/80 px-2 py-0.5 rounded-lg border border-surface-100 dark:border-surface-700/80 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{(rating || 5.0).toFixed(1)}</span>
              <span className="text-[10px] text-surface-400 dark:text-surface-500 font-normal">({reviewCount || 0})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-surface-900 dark:text-surface-100 text-sm sm:text-base line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Card Footer: Pricing */}
      <div className="p-5 pt-3 border-t border-surface-100/80 dark:border-surface-800 bg-surface-50/40 dark:bg-surface-900/60 flex items-center justify-between">
        <span className="text-[11px] font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">
          Starting from
        </span>
        <div className="text-right">
          <span className="text-lg font-black text-surface-900 dark:text-white">{displayPrice}</span>
          {pType === 'hourly' && <span className="text-[10px] text-surface-400 dark:text-surface-500">/hr</span>}
        </div>
      </div>
    </Link>
  );
}
