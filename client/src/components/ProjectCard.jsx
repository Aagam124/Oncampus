import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import Avatar from '@/components/Avatar';

export default function ProjectCard({ project }) {
  const {
    _id,
    title,
    description,
    skills,
    type,
    budgetMin,
    budgetMax,
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
      className="
        group block bg-white dark:bg-[#161617]
        rounded-3xl border border-black/[0.08] dark:border-white/[0.1]
        shadow-apple-card hover:shadow-apple-card-hover hover:border-black/[0.16] dark:hover:border-white/[0.2]
        hover:-translate-y-0.5 transition-all duration-200 p-6
        flex flex-col justify-between
      "
    >
      <div>
        {/* Header: Owner & Type */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Avatar src={owner?.avatar} name={ownerName} size="sm" />
            <div>
              <span className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-[#0071e3] transition-colors block">
                {ownerName}
              </span>
              {owner?.university && (
                <span className="text-[10px] text-[#86868b] dark:text-[#a1a1a6] block">
                  {owner.university}
                </span>
              )}
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase ${
              type === 'hiring'
                ? 'bg-[#34c759]/10 text-[#1f8337] dark:text-[#34c759] border border-[#34c759]/25'
                : 'bg-[#0071e3]/10 text-[#005bb5] dark:text-[#38a5f6] border border-[#0071e3]/25'
            }`}
          >
            {type === 'hiring' ? 'Paid Gig' : 'Collaboration'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-base mb-2 group-hover:text-[#0071e3] transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Skills Tag Cloud */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#424245] dark:text-[#d2d2d7] text-[11px] font-medium rounded-lg border border-black/[0.04] dark:border-white/[0.06]"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-2 py-0.5 text-[#86868b] dark:text-[#6e6e73] text-[10px] font-medium self-center">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-[#86868b] dark:text-[#a1a1a6]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-[#424245] dark:text-[#d2d2d7]">
            <Users className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>
              {memberCount}/{maxMembers}
            </span>
          </div>

          {(bMin || bMax) && (
            <div className="flex items-center gap-1 font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
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

        <span className="text-[11px] font-semibold text-[#0071e3] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          <span>Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
