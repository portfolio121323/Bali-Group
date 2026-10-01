import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DynamicMedia } from '@/components/DynamicMedia';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CATEGORIES = [
  {
    category: 'GRAIN STORAGE',
    title: 'Flat & Hopper Silos',
    spec: 'Up to 20,000 MT per unit',
    assetKey: 'product_flat_bottom',
    fallback: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop',
    desc: 'High-tensile corrugated steel silos with Z600 galvanization, engineered for seismic, wind and heavy grain load endurance.',
    tags: ['Z600 Zinc Layer', 'Aero-Dynamic Roof', 'Commercial Grade']
  },
  {
    category: 'MATERIAL HANDLING',
    title: 'Bucket Elevators & Conveyors',
    spec: 'Capacities up to 1,000 TPH',
    assetKey: 'product_elevator',
    fallback: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=1200&auto=format&fit=crop',
    desc: 'Continuous vertical and horizontal bulk movement designed with Hardox wear plates for zero-spill, low-breakage throughput.',
    tags: ['Wear Liners', 'Explosion Relief', 'Dust-Tight Drag Chain']
  },
  {
    category: 'MILLING INTEGRATION',
    title: 'Processing & Intake Lines',
    spec: 'Custom Flow Engineering',
    assetKey: 'product_milling',
    fallback: 'https://images.unsplash.com/photo-1563223552-30d01adceac3?q=80&w=1200&auto=format&fit=crop',
    desc: 'Seamless equipment routing and conditioning systems for industrial flour mills, rice polishing plants, and ethanol distilleries.',
    tags: ['Pre-Cleaning', 'Destoners', 'PLC Flow Sync']
  },
  {
    category: 'MONITORING & AUTOMATION',
    title: 'Aeration & SCADA Controls',
    spec: 'Multi-Point Digital Telemetry',
    assetKey: 'product_fan',
    fallback: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop',
    desc: 'Intelligent thermodynamic grain conditioning with automated fans, moisture sensors, and centralized digital control room sync.',
    tags: ['Hotspot Alarms', 'High-Static Pressure', 'Automated Aeration']
  },
  {
    category: 'AUXILIARY ACCESSORIES',
    title: 'Catwalks & Sweep Augers',
    spec: 'Heavy Galvanized Structural Steel',
    assetKey: 'product_chain',
    fallback: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    desc: 'Industrial structural support towers, maintenance platforms, safety cages, and zero-entry motorized bin sweep equipment.',
    tags: ['Zero-Entry Safety', 'Galvanized Towers', 'Pipe Ladders']
  },
  {
    category: 'TURNKEY EPC',
    title: 'Complete Industrial Plants',
    spec: 'Concept to Commissioning',
    assetKey: 'epc_design',
    fallback: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
    desc: 'Full-spectrum turnkey engineering covering geotechnical surveys, 3D BIM design, in-house fabrication, site erection, and handoff.',
    tags: ['Single Contract', 'Guaranteed Throughput', 'Global Execution']
  }
];

export function ProductEcosystem() {
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);

  useEffect(() => {
    if (!db) return;
    try {
      const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const liveMap = new Map();
          snapshot.docs.forEach(doc => {
            const d = doc.data();
            if (d.assetKey) {
              liveMap.set(d.assetKey, d);
            }
          });

          setCategoriesList(prev => prev.map(item => {
            const live = liveMap.get(item.assetKey);
            if (live) {
              return {
                ...item,
                title: live.title || item.title,
                desc: live.desc || item.desc,
                fallback: live.imageUrl || item.fallback,
              };
            }
            return item;
          }));
        }
      }, (err) => {
        console.warn('[ProductEcosystem] Products sync warning:', err.message || err);
      });
      return () => {
        try {
          unsubscribe();
        } catch (_) {}
      };
    } catch (e) {
      console.warn('[ProductEcosystem] Failed to attach products listener:', e);
    }
  }, []);
  return (
    <section className="bg-[#F6F6F4] py-24 md:py-32 border-b border-[#E9EAEC]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#0B0B0B]" />
              <span className="text-[#0B0B0B] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                ENGINEERED PRODUCT ECOSYSTEM
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0B0B0B] uppercase">
              ONE PARTNER. <br />
              <span className="text-[#A8AFB8]">COMPLETE INFRASTRUCTURE.</span>
            </h2>
          </div>
          
          <Link 
            to="/products" 
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B0B0B] border-b-2 border-[#0B0B0B] pb-1 hover:text-[#0B0B0B] hover:border-[#F4FF00] transition-colors self-start md:self-end"
          >
            <span>Open Technical Catalogue</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* 6 Architectural Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesList.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: idx * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-white border border-[#E9EAEC] hover:border-[#0B0B0B] flex flex-col justify-between transition-all duration-300 relative shadow-sm hover:shadow-xl rounded-none"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-[#F4FF00] transition-colors z-20" />

              <div>
                {/* Cinematic Image Container */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-[#171717]">
                  <DynamicMedia 
                    assetKey={item.assetKey}
                    fallbackUrl={item.fallback}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out filter brightness-[0.95]"
                  />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#0B0B0B] text-white text-[10px] font-mono font-bold px-3 py-1 uppercase tracking-widest border border-white/10">
                      {item.category}
                    </span>
                  </div>

                  {/* Spec Badge */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <span className="bg-[#F4FF00] text-[#0B0B0B] text-[10px] font-mono font-bold px-2.5 py-1 uppercase tracking-wider shadow">
                      {item.spec}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#0B0B0B] mb-3 group-hover:text-[#0B0B0B] transition-colors tracking-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-[#303236] text-sm leading-relaxed mb-6 font-normal">
                    {item.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[11px] font-mono text-[#303236] bg-[#F6F6F4] px-2.5 py-1 border border-[#E9EAEC]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-8 pb-8 pt-4 border-t border-[#E9EAEC] flex items-center justify-between">
                <Link 
                  to="/products"
                  className="text-xs font-bold tracking-wider uppercase text-[#0B0B0B] flex items-center gap-2 group-hover:text-[#0B0B0B]"
                >
                  <span>VIEW TECHNICAL DETAILS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#0B0B0B]" />
                </Link>
                <div className="w-7 h-7 bg-[#F6F6F4] group-hover:bg-[#F4FF00] transition-colors flex items-center justify-center text-[#0B0B0B]">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
