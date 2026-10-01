import { Layout } from '../components/layout';
import { motion } from 'motion/react';
import { ArrowRight, Factory, Settings, Layers, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SOLUTIONS = [
  {
    icon: Factory,
    title: 'Grain Storage Systems',
    subtitle: 'Commercial Flat & Hopper Silos',
    desc: 'High-tensile corrugated steel silos engineered for long-term grain preservation with capacities up to 20,000 MT per individual unit. Equipped with aerodynamic roof systems and Z600 galvanization.',
    capabilities: ['Z600 / 450 g/m² Zinc Galvanized Coating', '30° High-Load Structural Roof Cone', 'Multi-Point Digital Temp Cables', 'Automated Centrifugal Aeration'],
    link: '/products'
  },
  {
    icon: Settings,
    title: 'Bulk Material Handling',
    subtitle: 'Elevators & Enclosed Conveyors',
    desc: 'Continuous vertical and horizontal bulk movement designed with Hardox replaceable wear plates and high-tensile components for continuous 24/7 terminal throughput up to 1,000 TPH.',
    capabilities: ['Heavy-Duty Double-Leg Bucket Elevators', 'Dust-Tight Drag Chain Conveyors', 'Catenary Belt Conveyors', 'Self-Cleaning Sweeps & Augers'],
    link: '/products'
  },
  {
    icon: Layers,
    title: 'Milling & Distillery EPC',
    subtitle: 'Integrated Cleaning & Conditioning',
    desc: 'Custom grain intake, pre-cleaning scalpers, aspiration channels, destoners, and automated tempering silos engineered specifically for flour mills, rice polishers, and ethanol plants.',
    capabilities: ['Rotary Drum Pre-Cleaners', 'Aspiration Dust Separation', 'Automated Batch Dosing', 'Explosion Relief Venting'],
    link: '/engineering'
  },
  {
    icon: ShieldCheck,
    title: 'Turnkey Project Delivery',
    subtitle: 'Single Source Accountability',
    desc: 'From initial geotechnical soil study and 3D BIM clash detection to manufacturing in Chandigarh, on-site mechanical erection, and final plant handover on predetermined timelines.',
    capabilities: ['Single-Contract Commercial Liability', 'Guaranteed Plant Mass Flow Rates', 'Civil Foundation Drawings & Oversight', 'Comprehensive Operator Training'],
    link: '/quote'
  }
];

export default function Solutions() {
  return (
    <Layout>
      <div className="bg-[#0B0B0B] text-white min-h-screen pt-36 pb-24 relative overflow-hidden">
        
        {/* CAD Blueprint Background */}
        <div className="absolute inset-0 technical-grid pointer-events-none opacity-25" />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
          
          {/* Header */}
          <div className="max-w-4xl mb-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#F4FF00]" />
              <span className="text-[#F4FF00] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                INTEGRATED INDUSTRIAL SOLUTIONS
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.98] mb-8">
              ENGINEERED FOR <br />
              <span className="text-[#A8AFB8]">DEMANDING SCALE.</span>
            </h1>
            
            <p className="text-[#A8AFB8] text-base sm:text-xl max-w-2xl leading-relaxed font-normal">
              Whether you are executing a greenfield deepwater port terminal or upgrading a commercial rice milling line, Bali Group provides end-to-end industrial capability.
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {SOLUTIONS.map((sol, idx) => {
              const Icon = sol.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#171717] border border-white/[0.08] hover:border-[#F4FF00]/60 p-8 md:p-10 flex flex-col justify-between transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="font-mono text-xs text-[#F4FF00] font-bold tracking-widest uppercase">
                        SOLUTION 0{idx + 1}
                      </span>
                      <div className="p-3 bg-[#0B0B0B] text-[#F4FF00] border border-white/10 group-hover:bg-[#F4FF00] group-hover:text-[#0B0B0B] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <span className="text-xs font-mono text-white/50 uppercase block mb-1">
                      {sol.subtitle}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-4 group-hover:text-[#F4FF00] transition-colors">
                      {sol.title}
                    </h2>

                    <p className="text-[#A8AFB8] text-sm leading-relaxed mb-8 font-normal">
                      {sol.desc}
                    </p>

                    <div className="space-y-2 mb-8 bg-[#202124] p-4 border border-white/[0.06]">
                      <span className="text-[11px] font-mono text-[#F4FF00] uppercase block mb-2 font-bold">
                        Engineered Capabilities:
                      </span>
                      {sol.capabilities.map((cap, cIdx) => (
                        <div key={cIdx} className="text-xs text-white/80 font-mono flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#F4FF00]" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
                    <Link 
                      to={sol.link} 
                      className="text-xs font-bold uppercase tracking-wider text-white hover:text-[#F4FF00] flex items-center gap-2 transition-colors"
                    >
                      <span>Explore Technical Equipment</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link 
                      to="/quote" 
                      className="bg-[#F4FF00] text-[#0B0B0B] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors"
                    >
                      Enquire
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consultation CTA */}
          <div className="bg-[#F4FF00] text-[#0B0B0B] p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase block mb-1">
                SYSTEM INTEGRATION
              </span>
              <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                Plan Your Turnkey Infrastructure
              </h3>
              <p className="text-[#0B0B0B]/80 text-sm max-w-xl mt-2 font-normal">
                Speak directly with our senior process engineers in Chandigarh to configure your complete storage and handling line.
              </p>
            </div>
            
            <Link 
              to="/quote" 
              className="bg-[#0B0B0B] text-white px-8 py-4 font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-[#0B0B0B] transition-colors shrink-0 flex items-center gap-2"
            >
              Start Project Inquiry <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}
