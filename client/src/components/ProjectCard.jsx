import { Link } from 'react-router-dom';
import { Users, Calendar, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';

export default function ProjectCard({ project }) {
  const {
    _id,
    title,
    description,
    category,
    skills,
    type,
    budgetMin,
    budgetMax,
    status,
    timeline,
    owner,
    members,
    maxCollaborators,
  } = project;

  const ownerName = owner?.firstName
    ? `${owner.firstName} ${owner.lastName || ''}`
    : owner?.name || 'Project Lead';

  const bMin = project.budget?.min ?? budgetMin;
  const bMax = project.budget?.max ?? budgetMax;
  const currencySymbol = '₹';

  const memberCount = members?.length || 1;
  const maxMembers = maxCollaborators || 4;

  return (
    <Link
      to={`/projects/${_id}`}
      className="group block bg-white rounded-3xl border border-surface-200/80 shadow-sm hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between"
    >
      <div>
        {/* Header: Owner & Type */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Avatar src={owner?.avatar} name={ownerName} size="sm" />
            <div>
              <span className="text-xs font-bold text-surface-900 group-hover:text-brand-600 transition-colors block">
                {ownerName}
              </span>
              {owner?.university && (
                <span className="text-[10px] text-surface-400 block">{owner.university}</span>
              )}
            </div>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              type === 'hiring'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}
          >
            {type === 'hiring' ? 'Paid Gig' : 'Collaboration'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-surface-900 text-base mb-2 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-surface-500 line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Skills Tag Cloud */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-surface-100/80 text-surface-700 text-[11px] font-semibold rounded-lg"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-2 py-0.5 text-surface-400 text-[10px] font-medium self-center">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="pt-4 border-t border-surface-100 flex items-center justify-between text-xs text-surface-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-semibold text-surface-700">
            <Users className="w-3.5 h-3.5 text-brand-600" />
            <span>
              {memberCount}/{maxMembers}
            </span>
          </div>

          {(bMin || bMax) && (
            <div className="flex items-center gap-1 font-bold text-surface-900">
              <span>
                {bMin && bMax
                  ? `${currencySymbol}${bMin} - ${currencySymbol}${bMax}`
                  : bMax
                  ? `Up to ${currencySymbol}${bMax}`
                  : `From ${currencySymbol}${bMin}`}
              </span>
            </div>
          )}
        </div>

        <span className="text-[11px] font-bold text-brand-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
          <span>Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
