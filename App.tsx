import React, { useEffect, useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Linkedin, 
  Download, 
  Briefcase, 
  Code, 
  Cpu, 
  GraduationCap, 
  Globe,
  Terminal,
  ExternalLink
} from 'lucide-react';
import GlassCard from './components/GlassCard';
import SectionTitle from './components/SectionTitle';
import TechBadge from './components/TechBadge';
import { CONTACT_INFO, EXPERIENCE, PROJECTS, SUMMARY, TECH_STACK, EDUCATION } from './constants';

const App: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Simple ambient background movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Helper to format the long summary text with headers
  const renderSummary = (text: string) => {
    return text.split('\n\n').map((block, index) => {
      if (block.match(/^(MOBILE APPS|WEB DEVELOPMENT|OPEN SOURCE & PERSONAL PROJECTS)/)) {
        const [header, ...rest] = block.split('\n');
        return (
          <div key={index} className="mb-4">
            <h3 className="text-cyan-300 font-bold mb-2 text-sm tracking-wider">{header}</h3>
            <p className="text-slate-300 leading-7">{rest.join(' ')}</p>
          </div>
        );
      }
      return <p key={index} className="text-slate-300 leading-7 mb-4">{block}</p>;
    });
  };

  return (
    <div className="min-h-screen relative bg-[#0f172a] overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Gradients & Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]"
          style={{ transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)` }}
        />
        <div 
          className="absolute bottom-[0%] right-[-5%] w-[40%] h-[60%] bg-cyan-900/20 rounded-full blur-[100px]"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        />
        <div 
          className="absolute top-[30%] left-[20%] w-[20%] h-[20%] bg-blue-600/10 rounded-full blur-[80px]"
          style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-20 flex flex-col gap-8">
        
        {/* Hero Section */}
        <GlassCard className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
              <img 
                src={CONTACT_INFO.avatarUrl} 
                alt={CONTACT_INFO.name} 
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-white/20 shadow-2xl"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                {CONTACT_INFO.name}
              </h1>
              <p className="text-xl text-cyan-400 font-medium mb-4">
                {CONTACT_INFO.role}
              </p>
              <p className="text-slate-400 max-w-xl mb-6 leading-relaxed">
                {CONTACT_INFO.tagline}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a 
                  href={`mailto:${CONTACT_INFO.email}`} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm text-slate-300"
                >
                  <Mail size={16} />
                  {CONTACT_INFO.email}
                </a>
                <a 
                  href={CONTACT_INFO.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm text-slate-300"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_INFO.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm text-slate-300"
                >
                  <MapPin size={16} />
                  {CONTACT_INFO.location}
                </a>
                <a 
                  href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm text-slate-300"
                >
                  <Phone size={16} />
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="md:col-span-2 flex flex-col gap-8">
            
            {/* About Me */}
            <GlassCard className="p-8">
              <SectionTitle icon={<Terminal size={24} />}>About Me</SectionTitle>
              <div className="text-sm md:text-base">
                {renderSummary(SUMMARY)}
              </div>
            </GlassCard>

            {/* Experience */}
            <GlassCard className="p-8">
              <SectionTitle icon={<Briefcase size={24} />}>Professional Experience</SectionTitle>
              <div className="flex flex-col gap-8 relative">
                {/* Vertical line for timeline effect */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-800 rounded-full md:left-[9px]"></div>
                
                {EXPERIENCE.map((job, index) => (
                  <div key={index} className="relative pl-8">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-[6px] w-[16px] h-[16px] rounded-full bg-slate-900 border-2 border-cyan-500 z-10 box-border md:w-[20px] md:h-[20px] md:left-[-1px]"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">{job.company}</h3>
                      <span className="text-sm font-medium text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                        {job.period}
                      </span>
                    </div>
                    
                    <p className="text-cyan-300 font-medium mb-3">{job.role}</p>
                    
                    <ul className="space-y-2">
                      {job.details.map((detail, idx) => (
                        <li key={idx} className="text-slate-300 text-sm leading-6 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Notable Projects */}
            <GlassCard className="p-8">
              <SectionTitle icon={<Code size={24} />}>Projects</SectionTitle>
              {/* Compact grid: 2 cols on mobile, 3 cols on medium screens+ */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PROJECTS.map((project, index) => (
                  <div key={index} className="group p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all flex flex-col h-full">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-tight" title={project.name}>
                        {project.name}
                      </h3>
                    </div>
                    <p className="text-slate-400 text-[11px] mb-2 flex-grow leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700 whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-8">
            
            {/* Tech Stack */}
            <GlassCard className="p-6">
              <SectionTitle icon={<Cpu size={24} />}>Expertise</SectionTitle>
              <div className="flex flex-col gap-6">
                {TECH_STACK.map((category, index) => (
                  <div key={index}>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      {category.title}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, sIdx) => (
                        <TechBadge key={sIdx} label={skill} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Education */}
            <GlassCard className="p-6">
              <SectionTitle icon={<GraduationCap size={24} />}>Education</SectionTitle>
              <div>
                <h3 className="font-semibold text-white mb-1">{EDUCATION.school}</h3>
                <p className="text-cyan-300 text-sm mb-2">{EDUCATION.degree}</p>
                <p className="text-slate-500 text-sm">{EDUCATION.period}</p>
              </div>
            </GlassCard>

            {/* Languages */}
            <GlassCard className="p-6">
              <SectionTitle icon={<Globe size={24} />}>Languages</SectionTitle>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Czech</span>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">NATIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">English</span>
                  <span className="text-xs font-bold text-purple-400 bg-purple-900/30 px-2 py-1 rounded">FLUENT</span>
                </div>
              </div>
            </GlassCard>

            {/* Download/Action */}
            <a 
              href="/Martin Kase - Senior Software Engineer.pdf" 
              download="Martin Kase - Senior Software Engineer.pdf"
              className="w-full text-left block"
            >
              <GlassCard className="p-6 text-center group cursor-pointer hover:bg-cyan-500/10 transition-colors" hoverEffect>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Download size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Download PDF</h3>
                    <p className="text-slate-400 text-xs mt-1">Get the official resume</p>
                  </div>
                </div>
              </GlassCard>
            </a>

          </div>
        </div>
        
        {/* Footer */}
        <footer className="text-center text-slate-500 text-sm pb-8">
          <p>© {new Date().getFullYear()} Martin Kaše. Built with React & Tailwind.</p>
        </footer>

      </div>
    </div>
  );
};

export default App;
