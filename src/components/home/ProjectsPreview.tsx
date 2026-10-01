import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DynamicMedia } from '@/components/DynamicMedia';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const FEATURED_PROJECTS = [
  {
    id: 'proj-dubai-port',
    title: 'Port Terminal Expansion',
    location: 'Dubai, UAE',
    capacity: '120,000 MT',
    industry: 'Commercial Port',
    scope: '12x 10,000 MT Flat Bottom Silos + 1,000 TPH Shiploader Intake',
    assetKey: 'project_cover',
    fallback: 'https://images.unsplash.com/photo-1578330752538-23ab6d321ee7?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'proj-punjab-rice',
    title: 'Integrated Rice Milling Plant',
    location: 'Punjab, India',
    capacity: '40,000 MT',
    industry: 'Paddy & Rice Mill',
    scope: '8x Hopper Silos + Complete Aspiration Cleaning & Tempering Line',
    assetKey: 'project_rice',
    fallback: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'proj-brazil-ethanol',
    title: 'Ethanol Storage Infrastructure',
    location: 'São Paulo, Brazil',
    capacity: '80,000 MT',
    industry: 'Ethanol & Distillery',
    scope: 'Maize reception buffers, high-throughput conveyors, explosion venting',
    assetKey: 'project_ethanol',
    fallback: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'proj-kenya-reserve',
    title: 'National Strategic Food Reserve',
    location: 'Nairobi, Kenya',
    capacity: '200,000 MT',
    industry: 'Strategic Reserves',
    scope: 'Full turnkey EPC complex with digital SCADA moisture telemetry',
    assetKey: 'project_kenya',
    fallback: 'https://images.unsplash.com/photo-1581092921461-7031e4bf0e5f?q=80&w=1200&auto=format&fit=crop'
  }
];

export function ProjectsPreview() {
  const [projectsList, setProjectsList] = useState(FEATURED_PROJECTS);

  useEffect(() => {
    if (!db) return;
    try {
      const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
        if (!snapshot.empty) {
          const liveMap = new Map();
          snapshot.docs.forEach(doc => {
            liveMap.set(doc.id, doc.data());
            if (doc.data().assetKey) {
              liveMap.set(doc.data().assetKey, doc.data());
            }
          });

          setProjectsList(prev => prev.map(item => {
            const live = liveMap.get(item.id) || liveMap.get(item.assetKey);
            if (live) {
              return {
                ...item,
                title: live.title || item.title,
                location: live.location || item.location,
                capacity: live.capacity || item.capacity,
                industry: live.category || item.industry,
                scope: live.scope || item.scope,
                fallback: live.imageUrl || item.fallback,
              };
            }
            return item;
          }));
        }
      }, (err) => {
        console.warn('[ProjectsPreview] Projects sync warning:', err.message || err);
      });
      return () => {
        try {
          unsubscribe();
        } catch (_) {}
      };
    } catch (e) {
      console.warn('[ProjectsPreview] Failed to attach projects listener:', e);
    }
  }, []);
  return (
    <section className="bg-[#0B0B0B] text-white py-24 md:py-32 relative overflow-hidden border-b border-white/[0.08]">
      
      {/* Background CAD Grid */}
      <div className="absolute inset-0 technical-grid pointer-events-none opacity-20" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#F4FF00]" />
              <span className="text-[#F4FF00] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                GLOBAL FOOTPRINT
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-[1.02]">
              BUILT ACROSS <br />
              <span className="text-[#A8AFB8]">MARKETS.</span>
            </h2>
          </div>
          
          <Link 
            to="/projects" 
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white border-b border-white/40 pb-1 hover:text-[#F4FF00] hover:border-[#F4FF00] transition-colors self-start md:self-end"
          >
            <span>View All Global Case Studies</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#F4FF00]" />
          </Link>
        </div>

        {/* 4 Featured Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectsList.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
              className="group bg-[#171717] border border-white/[0.08] hover:border-[#F4FF00]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Image */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-[#0B0B0B]">
                  <DynamicMedia 
                    assetKey={project.assetKey}
                    fallbackUrl={project.fallback}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.88]"
                  />
                  <div className="absolute top-4 left-4 bg-[#0B0B0B] text-white font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-white/10">
                    {project.industry}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-[#F4FF00] text-[#0B0B0B] font-mono text-xs font-bold px-3 py-1 uppercase shadow">
                    {project.capacity}
                  </div>
                </div>

                {/* Details */}
                <div className="p-8">
                  <div className="flex items-center gap-2 text-[#F4FF00] text-xs font-mono mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{project.location}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-3 group-hover:text-[#F4FF00] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-[#A8AFB8] text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {project.scope}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-8 pb-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <Link 
                  to="/projects"
                  className="text-xs font-bold tracking-wider uppercase text-white hover:text-[#F4FF00] flex items-center gap-2 group-hover:text-[#F4FF00] transition-colors"
                >
                  <span>VIEW CASE STUDY</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="text-[11px] font-mono text-white/30">
                  EPC VERIFIED
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
