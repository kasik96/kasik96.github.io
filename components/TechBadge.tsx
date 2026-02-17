import React from 'react';

interface TechBadgeProps {
  label: string;
}

const TechBadge: React.FC<TechBadgeProps> = ({ label }) => {
  return (
    <span className="
      px-3 py-1 
      text-sm font-medium 
      text-cyan-100 
      bg-cyan-500/10 
      border border-cyan-500/20 
      rounded-full
      transition-colors duration-300
      hover:bg-cyan-500/20
      hover:border-cyan-500/40
    ">
      {label}
    </span>
  );
};

export default TechBadge;