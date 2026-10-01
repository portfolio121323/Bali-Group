import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DynamicMedia } from '@/components/DynamicMedia';

const INDUSTRIES = [
  {
    assetKey: 'industry_commercial',
    title: 'Commercial Grain Trading',
    subtitle: 'High-Throughput Logistics & Bulk Aggregation',
    desc: 'Massive flat-bottom storage facilities designed for rapid multi-point truck and rail unloading, continuous grain aeration, and fast market dispatch.',
    keyCapability: 'Up to 200,000 MT Terminal Capacity',
    image: 'https://images.unsplash.com/photo-1578330752538-23ab6d321ee7?q=80&w=1200&auto=format&fit=crop'
  },
  {
    assetKey: 'industry_rice',
    title: 'Rice & Flour Mills',
    subtitle: 'Gentle Handling & Strict Hygiene Conditioning',
    desc: 'Zero-breakage conveying lines, high-precision aspiration scalpers, and tempering silos engineered to preserve kernel moisture balance prior to milling.',
    keyCapability: 'Grain Breakage < 0.1% Guaranteed',
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1200&auto=format&fit=crop'
  },
  {
    assetKey: 'industry_feed_ethanol',
    title: 'Feed & Animal Nutrition Plants',
    subtitle: 'Multi-Ingredient Batching & Micro-Dosing',
    desc: 'Hopper bottom bins with steep discharge angles, specialized liquid-addition surge bins, and integrated micro-ingredient batch weighing systems.',
    keyCapability: 'Rapid Cone Gravity Discharge (45° / 60°)',
    image: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=1200&auto=format&fit=crop'
  },
  {
    assetKey: 'industry_ethanol',
    title: 'Ethanol & Grain Distilleries',
    subtitle: 'High-Volume Continuous Fermentation Feed',
    desc: 'Heavy-duty receiving buffers, high-throughput maize cleaning, and dust-tight enclosed conveying built for continuous 24/7 ethanol distillation feed.',
    keyCapability: 'ATEX Explosion Relief & SCADA Feed Sync',
    image: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop'
  },
  {
    assetKey: 'industry_port_terminals',
    title: 'Deepwater Port Terminals',
    subtitle: 'Marine Vessel Loading & Heavy Berth Handling',
    desc: 'High-speed 1,000+ TPH bulk shiploading systems, boom conveyors, and export terminal complexes engineered for aggressive coastal salinity conditions.',
    keyCapability: '1,000 TPH Marine Berth Throughput',
    image: 'https://images.unsplash.com/photo-1581092921461-7031e4bf0e5f?q=80&w=1200&auto=format&fit=crop'
  }
];

export function IndustriesSection() {
  return (
    <section id="industries" className="bg-[#F6F6F4] py-24 md:py-32 border-b border-[#E9EAEC]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#0B0B0B]" />
              <span className="text-[#0B0B0B] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                SERVED MARKETS
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0B0B0B] uppercase tracking-tight leading-[1.02]">
              ENGINEERED FOR <br />
              <span className="text-[#A8AFB8]">REAL INDUSTRIES.</span>
            </h2>
          </div>
          <p className="text-[#303236] text-sm md:text-base max-w-md leading-relaxed">
            Every agro-industrial sector operates with unique grain varieties, moisture challenges, and intake speeds. We engineer around your exact commercial throughput.
          </p>
        </div>

        {/* Industrial Horizontal Panels */}
        <div className="space-y-6">
          {INDUSTRIES.map((ind, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group bg-white border border-[#E9EAEC] hover:border-[#0B0B0B] transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-sm hover:shadow-xl"
            >
              {/* Image Column */}
              <div className="lg:col-span-4 relative h-60 lg:h-auto overflow-hidden bg-[#171717]">
                <DynamicMedia 
                  assetKey={ind.assetKey}
                  fallbackUrl={ind.image}
                  alt={ind.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.92]"
                />
                <div className="absolute top-4 left-4 bg-[#0B0B0B] text-white font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-white/10">
                  SECTOR 0{idx + 1}
                </div>
              </div>

              {/* Text & Capability Details */}
              <div className="lg:col-span-8 p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-[#303236] uppercase tracking-wider">
                      {ind.subtitle}
                    </span>
                    <span className="bg-[#F4FF00] text-[#0B0B0B] text-[10px] font-mono font-bold px-2.5 py-1 uppercase">
                      {ind.keyCapability}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-[#0B0B0B] uppercase tracking-tight mb-4 group-hover:text-[#0B0B0B] transition-colors">
                    {ind.title}
                  </h3>

                  <p className="text-[#303236] text-sm md:text-base leading-relaxed mb-6 font-normal">
                    {ind.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E9EAEC] flex items-center justify-between">
                  <Link 
                    to="/quote" 
                    className="text-xs font-bold uppercase tracking-wider text-[#0B0B0B] flex items-center gap-2 group/btn"
                  >
                    <span>Request Sector Engineering Consultation</span>
                    <ArrowUpRight className="w-4 h-4 text-[#0B0B0B] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </Link>

                  <span className="text-xs font-mono text-[#A8AFB8] hidden sm:inline">
                    TURNKEY EPC READY
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
