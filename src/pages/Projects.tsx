import { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, ArrowRight, ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DynamicMedia } from '@/components/DynamicMedia';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CATEGORIES = ['All', 'Commercial Ports', 'Rice & Flour Mills', 'Ethanol & Distilleries', 'Strategic Reserves', 'Animal Feed'];

interface ProjectItem {
  id: number;
  title: string;
  location: string;
  capacity: string;
  category: string;
  assetKey: string;
  fallback: string;
  scope: string;
  specs: { label: string; value: string }[];
  deliverables: string[];
}

const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: 'Deepwater Port Terminal Expansion',
    location: 'Dubai, UAE',
    capacity: '120,000 MT Total Storage',
    category: 'Commercial Ports',
    assetKey: 'project_cover',
    fallback: 'https://images.unsplash.com/photo-1578330752538-23ab6d321ee7?q=80&w=1200&auto=format&fit=crop',
    scope: 'Turnkey engineering and installation of 12 commercial flat-bottom silos with high-speed 1,000 TPH marine shiploader intake conveyors and dust suppression systems.',
    specs: [
      { label: 'Silo Configuration', value: '12x 10,000 MT Flat Bottom Silos' },
      { label: 'Intake Capacity', value: '1,000 TPH Marine Berth Conveyor' },
      { label: 'Galvanizing', value: 'Z600 Heavy Marine Environment Coating' },
      { label: 'Completion', value: 'Handed over on-time in 14 months' }
    ],
    deliverables: ['Marine Intake Tower', 'High-Speed Enclosed Belt Conveyors', 'Automated SCADA Control Room', 'High-Static Pressure Aeration']
  },
  {
    id: 2,
    title: 'Integrated Commercial Rice Milling Plant',
    location: 'Punjab, India',
    capacity: '40,000 MT Storage',
    category: 'Rice & Flour Mills',
    assetKey: 'project_rice',
    fallback: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1200&auto=format&fit=crop',
    scope: 'Complete grain handling and storage complex designed to preserve paddy kernel moisture balance and supply clean tempered grain directly to milling rolls.',
    specs: [
      { label: 'Silo Configuration', value: '8x 5,000 MT Hopper Bottom Silos' },
      { label: 'Pre-Cleaning', value: '250 TPH Rotary Drum Cleaners' },
      { label: 'Discharge', value: 'Continuous 60° gravity discharge hoppers' },
      { label: 'Breakage Limit', value: '< 0.08% grain breakage guaranteed' }
    ],
    deliverables: ['Intake Pit with Truck Tipper', 'Rotary Scalpers & Destoners', 'Digital Temperature Sensing Matrix', 'Milling Feed Augers']
  },
  {
    id: 3,
    title: 'Heavy Grain Ethanol Storage Infrastructure',
    location: 'São Paulo, Brazil',
    capacity: '80,000 MT Buffer Storage',
    category: 'Ethanol & Distilleries',
    assetKey: 'project_ethanol',
    fallback: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop',
    scope: 'Massive maize reception buffers designed for continuous 24/7 ethanol distillation feedstock, incorporating ATEX explosion relief panels and automated aspiration.',
    specs: [
      { label: 'Silo Configuration', value: '8x 10,000 MT Commercial Silos' },
      { label: 'Handling Lines', value: '500 TPH Drag Chain Conveyors' },
      { label: 'Safety Standard', value: 'ATEX Dust Explosion Vents' },
      { label: 'Operation', value: '24/7 Continuous Feed Reliability' }
    ],
    deliverables: ['Explosion Venting System', 'Hardox-Lined Wear Chutes', 'Automatic Hotspot Aeration Kick-In', 'PLC Centralized Feed Sync']
  },
  {
    id: 4,
    title: 'National Strategic Food Grain Reserve',
    location: 'Nairobi, Kenya',
    capacity: '200,000 MT Strategic Reserve',
    category: 'Strategic Reserves',
    assetKey: 'project_kenya',
    fallback: 'https://images.unsplash.com/photo-1581092921461-7031e4bf0e5f?q=80&w=1200&auto=format&fit=crop',
    scope: 'National government grain security project engineered for multi-year raw wheat and maize preservation under tropical climatic variations.',
    specs: [
      { label: 'Silo Configuration', value: '20x 10,000 MT Commercial Silos' },
      { label: 'Climatic System', value: 'Automated Recirculation Fumigation' },
      { label: 'Civil Works', value: 'Turnkey Reinforced Heavy Raft Slabs' },
      { label: 'Monitoring', value: 'Cloud-Connected Telemetry SCADA' }
    ],
    deliverables: ['20 Large-Span Silo Bins', 'Railcar Unloading Receiving Pits', 'Fumigation Recirculation Loops', 'Bulk Truck Outloading Bellows']
  },
  {
    id: 5,
    title: 'High-Speed Feed Mill Silo Complex',
    location: 'Bangkok, Thailand',
    capacity: '25,000 MT Multi-Ingredient',
    category: 'Animal Feed',
    assetKey: 'project_thai',
    fallback: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=1200&auto=format&fit=crop',
    scope: 'Multi-compartment hopper bottom silo battery enabling rapid batch micro-dosing and segregated ingredient holding for poultry and aquaculture feed lines.',
    specs: [
      { label: 'Silo Configuration', value: '10x 2,500 MT Steep-Cone Silos' },
      { label: 'Batch Weighing', value: 'Integrated Load-Cell Batch Hoppers' },
      { label: 'Cleanout', value: 'Zero residue internal discharge design' },
      { label: 'Throughput', value: '200 TPH continuous batch transfer' }
    ],
    deliverables: ['Steep-Angle 60° Cone Hoppers', 'Precision Metering Slide Gates', 'Micro-Ingredient Buffer Bins', 'Zero-Cross Contamination Lines']
  }
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(PROJECTS);

  useEffect(() => {
    if (!db) return;
    try {
      const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
        if (!snapshot.empty) {
          const liveProjects: ProjectItem[] = snapshot.docs
            .map((d, i) => {
              const data = d.data();
              return {
                id: (i + 1) as any,
                title: data.title || '',
                location: data.location || '',
                capacity: data.capacity || '',
                category: data.category || 'Commercial Ports',
                assetKey: data.assetKey || '',
                fallback: data.imageUrl || 'https://images.unsplash.com/photo-1578330752538-23ab6d321ee7?q=80&w=1200&auto=format&fit=crop',
                scope: data.scope || '',
                specs: data.specs || [],
                deliverables: data.deliverables || [],
                published: data.published !== false
              };
            })
            .filter(p => (p as any).published);
          if (liveProjects.length > 0) {
            setProjectsList(liveProjects);
          }
        }
      }, (err) => {
        console.warn('[Projects] Projects sync warning:', err.message || err);
      });
      return () => {
        try {
          unsubscribe();
        } catch (_) {}
      };
    } catch (e) {
      console.warn('[Projects] Failed to attach projects listener:', e);
    }
  }, []);

  const filteredProjects = projectsList.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-[#0B0B0B] text-white min-h-screen pt-36 pb-24 relative">
        
        {/* CAD Blueprint Background */}
        <div className="absolute inset-0 technical-grid pointer-events-none opacity-25" />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 relative z-10 mb-16">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-10 bg-[#F4FF00]" />
                <span className="text-[#F4FF00] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                  GLOBAL COMMISSIONING PORTFOLIO
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-[1.02]">
                BUILT ACROSS <br />
                <span className="text-[#A8AFB8]">MARKETS.</span>
              </h1>
              <p className="text-[#A8AFB8] text-sm md:text-base max-w-xl mt-4 leading-relaxed font-normal">
                Explore real industrial grain storage facilities, milling plants, and bulk export terminals engineered and commissioned by Bali Group worldwide.
              </p>
            </div>

            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8AFB8]" />
                <input 
                  type="text"
                  placeholder="Filter by country, title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#171717] border border-white/10 pl-11 pr-4 py-3.5 focus:border-[#F4FF00] focus:outline-none transition-colors text-sm font-medium text-white shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                  activeCategory === cat 
                    ? "bg-[#F4FF00] text-[#0B0B0B]" 
                    : "bg-[#171717] text-white/70 hover:text-white border border-white/10 hover:border-white/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Projects Grid */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredProjects.map(project => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className="bg-[#171717] border border-white/[0.08] hover:border-[#F4FF00]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Media */}
                    <div className="relative h-72 overflow-hidden bg-[#0B0B0B]">
                      <DynamicMedia 
                        assetKey={project.assetKey}
                        fallbackUrl={project.fallback}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.88]"
                      />
                      <div className="absolute top-4 left-4 bg-[#0B0B0B] text-white font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-white/10">
                        {project.category}
                      </div>
                      <div className="absolute bottom-4 right-4 bg-[#F4FF00] text-[#0B0B0B] font-mono text-xs font-bold px-3 py-1 uppercase shadow">
                        {project.capacity}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-[#F4FF00] text-xs font-mono mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{project.location}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-4 group-hover:text-[#F4FF00] transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-[#A8AFB8] text-sm leading-relaxed mb-6 font-normal">
                        {project.scope}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#A8AFB8] bg-[#202124] p-4 border border-white/[0.06] mb-6">
                        {project.specs.slice(0, 2).map((s, idx) => (
                          <div key={idx}>
                            <span className="text-white/40 block text-[10px] uppercase">{s.label}</span>
                            <span className="text-white font-bold">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-8 pb-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <button
                      onClick={() => setActiveProjectModal(project)}
                      className="text-xs font-bold tracking-wider uppercase text-white hover:text-[#F4FF00] flex items-center gap-2 group/btn cursor-pointer transition-colors"
                    >
                      <span>VIEW FULL CASE STUDY</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    <Link 
                      to={`/quote?project=${encodeURIComponent(project.title)}`}
                      className="bg-[#F4FF00] text-[#0B0B0B] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors"
                    >
                      ENQUIRE SIMILAR SCOPE
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Case Study Full Modal */}
        <AnimatePresence>
          {activeProjectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0B]/85 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#171717] border border-white/20 w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-white"
              >
                {/* Header */}
                <div className="p-6 bg-[#0B0B0B] border-b border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[#F4FF00] font-mono text-xs font-bold tracking-widest uppercase block mb-1">
                      COMMISSIONED PROJECT REPORT // {activeProjectModal.location}
                    </span>
                    <h2 className="text-2xl font-bold uppercase tracking-tight">{activeProjectModal.title}</h2>
                  </div>
                  <button 
                    onClick={() => setActiveProjectModal(null)}
                    className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto space-y-6 flex-grow">
                  <p className="text-[#A8AFB8] text-sm leading-relaxed">
                    {activeProjectModal.scope}
                  </p>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#F4FF00] mb-3 font-mono">
                      Engineering Specifications:
                    </h4>
                    <div className="bg-[#202124] border border-white/10 divide-y divide-white/[0.06]">
                      {activeProjectModal.specs.map((s, idx) => (
                        <div key={idx} className="p-3.5 flex justify-between items-center text-xs font-mono">
                          <span className="text-white/50 uppercase">{s.label}</span>
                          <span className="font-bold text-white">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#F4FF00] mb-3 font-mono">
                      Turnkey Commissioned Deliverables:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeProjectModal.deliverables.map((d, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-white bg-[#202124] p-3 border border-white/[0.06]">
                          <CheckCircle2 className="w-4 h-4 text-[#F4FF00] shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-[#0B0B0B] border-t border-white/10 flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-white/40">
                    BALI GROUP TURNKEY EPC EXECUTION
                  </span>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveProjectModal(null)}
                      className="px-6 py-2.5 border border-white/20 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
                    >
                      Close
                    </button>
                    <Link 
                      to={`/quote?project=${encodeURIComponent(activeProjectModal.title)}`}
                      className="bg-[#F4FF00] text-[#0B0B0B] px-6 py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-white transition-colors"
                    >
                      Plan Similar Facility
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}
