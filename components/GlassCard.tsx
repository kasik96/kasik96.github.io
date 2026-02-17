import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", hoverEffect = false }) => {
  return (
    <div 
      className={`
        relative overflow-hidden
        bg-slate-900/40 
        backdrop-blur-xl 
        border border-white/10 
        rounded-2xl 
        shadow-xl
        transition-all duration-300
        ${hoverEffect ? 'hover:bg-slate-800/50 hover:border-white/20 hover:scale-[1.01] hover:shadow-2xl' : ''}
        ${className}
      `}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;