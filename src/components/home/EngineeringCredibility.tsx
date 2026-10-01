import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DraftingCompass, PenTool, Cpu, Settings, ShieldCheck, Layers, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Discipline {
  id: string;
  name: string;
  code: string;
  desc: string;
  hotspot: { x: number; y: number; label: string };
  specs: string[];
}

const DISCIPLINES: Discipline[] = [
  {
    id: 'structural',
    name: 'Structural Engineering',
    code: 'STR-01',
    desc: 'Finite element calculations evaluating seismic zone accelerations, 160 km/h wind shear vectors, and dynamic grain pressure friction curves.',
    hotspot: { x: 50, y: 45, label: 'Corrugated Z600 Shell & External Stiffener Column' },
    specs: ['Eurocode EN 1993-4-1 compliance', 'Seismic Zone 4 rating', 'High-tensile Grade 350+ steel']
  },
  {
    id: 'process',
    name: 'Process Engineering',
    code: 'PRC-02',
    desc: 'Throughput optimization from truck dump pit to bulk outloading, eliminating bottlenecking, cross-contamination, and mechanical grain abrasion.',
    hotspot: { x: 25, y: 75, label: 'Sub-Pit Hopper & Enclosed Drag Conveyor' },
    specs: ['Continuous mass balance flow', 'Grain breakage < 0.1%', 'Dust-tight aspiration hoods']
  },
  {
    id: 'mechanical',
    name: 'Mechanical Systems',
    code: 'MEC-03',
    desc: 'Heavy-duty conveying equipment built with Hardox replaceable wear plates, crown-faced pulleys, and heavy self-aligning bearing assemblies.',
    hotspot: { x: 18, y: 25, label: 'Bucket Elevator Head & Explosion Relief Vent' },
    specs: ['Direct-coupled helical bevel gearboxes', 'ATEX explosion vents', 'Heavy rubber/steel belting']
  },
  {
    id: 'electrical',
    name: 'Electrical & SCADA Automation',
    code: 'AUT-04',
    desc: 'Centralized plant intelligence with automated routing sequencing, motor current monitoring, and digital temperature hotspot alarming.',
    hotspot: { x: 78, y: 65, label: 'Digital Multi-Point Temp Cable Matrix' },
    specs: ['Siemens/Allen-Bradley PLC architecture', 'Touchscreen SCADA mimics', 'Real-time telemetry logging']
  },
  {
    id: 'layout',
    name: '2D / 3D BIM Plant Modeling',
    code: 'BIM-05',
    desc: 'Millimeter-accurate 3D digital twinning identifying piping interference, catwalk access safety, and crane rigging radius before ground break.',
    hotspot: { x: 62, y: 15, label: 'High-Level Catwalk & Galvanized Support Truss' },
    specs: ['Zero on-site interference', 'Full 3D CAD fabrication exports', 'Turnkey civil drawings']
  }
];

export function EngineeringCredibility() {
  const [activeDiscipline, setActiveDiscipline] = useState<Discipline>(DISCIPLINES[0]);

  return (
    <section className="bg-[#0B0B0B] text-white py-24 md:py-36 relative overflow-hidden border-b border-white/[0.08]">
      
      {/* Background CAD Grid */}
      <div className="absolute inset-0 technical-grid pointer-events-none opacity-40" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#F4FF00]" />
              <span className="text-[#F4FF00] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                ENGINEERING RIGOR
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-[1.02]">
              ENGINEERED BEFORE <br />
              <span className="text-[#A8AFB8]">IT IS BUILT.</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-[#A8AFB8] text-sm md:text-base leading-relaxed mb-4">
              Nothing is left to chance. Every silo envelope, elevator boot, and transfer chute is simulated under maximum load conditions before fabrication begins.
            </p>
            <Link 
              to="/engineering" 
              className="text-xs font-bold text-[#F4FF00] hover:text-white uppercase tracking-wider flex items-center gap-2 transition-colors font-mono"
            >
              Explore Full Engineering Methodology <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Disciplines Selector */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            {DISCIPLINES.map((item) => {
              const isActive = activeDiscipline.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveDiscipline(item)}
                  onMouseEnter={() => setActiveDiscipline(item)}
                  className={cn(
                    "p-6 cursor-pointer border transition-all duration-200 relative group",
                    isActive 
                      ? "bg-[#171717] border-[#F4FF00] shadow-xl" 
                      : "bg-[#171717]/60 border-white/[0.08] hover:border-white/30"
                  )}
                >
                  {/* Left Active Accent Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F4FF00]" />
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "font-mono text-xs font-bold tracking-wider uppercase",
                      isActive ? "text-[#F4FF00]" : "text-white/40"
                    )}>
                      {item.code}
                    </span>
                    <span className="text-[11px] font-mono text-white/40 uppercase">DISCIPLINE</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-[#F4FF00] transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs text-[#A8AFB8] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Blueprint Schematic Interactive Stage */}
          <div className="lg:col-span-7 bg-[#171717] border border-white/[0.1] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            
            {/* Technical Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#A8AFB8]">
                <DraftingCompass className="w-4 h-4 text-[#F4FF00]" />
                <span>SCHEMATIC REF // BG-CAD-SILO-4500T</span>
              </div>
              <span className="text-[#F4FF00] uppercase font-bold">ACTIVE CAD VIEWPORT</span>
            </div>

            {/* Interactive Blueprint Drawing Canvas */}
            <div className="relative w-full h-[320px] sm:h-[380px] bg-[#0B0B0B] border border-white/[0.08] flex items-center justify-center overflow-hidden">
              
              {/* Technical Drawing SVG */}
              <svg className="w-full h-full p-4 pointer-events-none" viewBox="0 0 500 400" fill="none" stroke="currentColor">
                {/* Blueprint Background Grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Ground Line */}
                <line x1="20" y1="350" x2="480" y2="350" stroke="#A8AFB8" strokeWidth="1.5" strokeDasharray="6 3" />
                <text x="30" y="370" fill="#A8AFB8" fontSize="10" fontFamily="monospace">DATUM // FOUNDATION LEVEL 0.00m</text>

                {/* Silo Body Outline */}
                {/* Roof Cone */}
                <path d="M 180 150 L 320 80 L 460 150 Z" stroke="#FFFFFF" strokeWidth="2" fill="rgba(255,255,255,0.02)" />
                {/* Silo Cylinder */}
                <rect x="180" y="150" width="280" height="200" stroke="#FFFFFF" strokeWidth="2" fill="rgba(255,255,255,0.01)" />
                {/* Corrugation Lines */}
                {[170, 190, 210, 230, 250, 270, 290, 310, 330].map(y => (
                  <line key={y} x1="180" y1={y} x2="460" y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                ))}
                {/* External Stiffeners */}
                {[220, 260, 300, 340, 380, 420].map(x => (
                  <line key={x} x1={x} y1="150" x2={x} y2="350" stroke="rgba(244,255,0,0.3)" strokeWidth="1.5" />
                ))}

                {/* Catwalk Structure at Top */}
                <rect x="150" y="60" width="340" height="20" stroke="#A8AFB8" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="150" y1="60" x2="150" y2="350" stroke="#A8AFB8" strokeWidth="1" strokeDasharray="2 2" />

                {/* Bucket Elevator Tower on Left */}
                <rect x="70" y="50" width="45" height="300" stroke="#F4FF00" strokeWidth="1.5" fill="rgba(244,255,0,0.02)" />
                {/* Elevator Pulley Head */}
                <circle cx="92.5" cy="45" r="16" stroke="#F4FF00" strokeWidth="1.5" />
                <path d="M 70 70 L 115 110 M 115 70 L 70 110" stroke="#F4FF00" strokeWidth="0.8" opacity="0.4" />
                <path d="M 70 150 L 115 190 M 115 150 L 70 190" stroke="#F4FF00" strokeWidth="0.8" opacity="0.4" />
                
                {/* Conveyor Bridge */}
                <line x1="115" y1="65" x2="320" y2="75" stroke="#F4FF00" strokeWidth="2" />

                {/* Dimension Arrows */}
                <line x1="475" y1="150" x2="475" y2="350" stroke="#A8AFB8" strokeWidth="0.8" />
                <text x="480" y="255" fill="#A8AFB8" fontSize="9" fontFamily="monospace">EAVE: 22.4m</text>
              </svg>

              {/* Dynamic Animated Hotspot Target */}
              <motion.div 
                key={activeDiscipline.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute z-20 flex items-center gap-2 pointer-events-none"
                style={{ 
                  left: `${activeDiscipline.hotspot.x}%`, 
                  top: `${activeDiscipline.hotspot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#F4FF00]/20 animate-ping absolute" />
                  <div className="w-4 h-4 rounded-full bg-[#F4FF00] border-2 border-[#0B0B0B] relative z-10" />
                </div>
                <div className="bg-[#0B0B0B]/90 border border-[#F4FF00] px-2.5 py-1 text-[10px] font-mono font-bold text-[#F4FF00] whitespace-nowrap shadow-xl">
                  {activeDiscipline.hotspot.label}
                </div>
              </motion.div>

            </div>

            {/* Bottom Spec Sheet for Active Discipline */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#A8AFB8] block mb-1">
                  Validated Design Parameters ({activeDiscipline.code}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeDiscipline.specs.map((spec, sIdx) => (
                    <span key={sIdx} className="text-[11px] font-mono text-white bg-[#0B0B0B] px-2.5 py-1 border border-white/10 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-[#F4FF00]" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-emerald-400 block uppercase">
                  FEA SIMULATION STATUS
                </span>
                <span className="text-white font-mono font-bold text-xs">
                  PASSED // 100% FACTOR OF SAFETY
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
