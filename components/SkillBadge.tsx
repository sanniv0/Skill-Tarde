import React from 'react';

interface SkillBadgeProps {
  skill: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, variant = 'primary' }) => {
  let classes = "px-2.5 py-0.5 rounded-full text-xs font-medium inline-block mr-2 mb-2";
  
  if (variant === 'primary') {
    classes += " bg-indigo-100 text-indigo-800";
  } else if (variant === 'secondary') {
    classes += " bg-teal-100 text-teal-800";
  } else {
    classes += " border border-slate-300 text-slate-600";
  }

  return (
    <span className={classes}>
      {skill}
    </span>
  );
};