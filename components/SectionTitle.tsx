import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, icon }) => {
  return (
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      {icon && <span className="text-cyan-400">{icon}</span>}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
        {children}
      </span>
    </h2>
  );
};

export default SectionTitle;