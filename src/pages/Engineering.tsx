import { useState } from 'react';
import { Layout } from '../components/layout';
import { motion, AnimatePresence } from 'motion/react';
import { DraftingCompass, PenTool, Cpu, Settings, ShieldCheck, Layers, ArrowRight, CheckCircle2, FileCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const DISCIPLINES = [
  {
    icon: DraftingCompass,
    title: 'Process Engineering & Mass Flow',
    code: 'DISC-01',
    desc: 'Mathematical simulation of grain friction, bulk density behavior, and pneumatic flow rates to guarantee unhindered mass discharge and avoid eccentric funnel flow.',
    points: ['Discrete element particle modeling (DEM)', 'Continuous mass balance calculation', 'Dust suppression aerodynamics']
  },
  {
    icon: PenTool,
    title: 'Structural Steel & Seismic Design',
    code: 'DISC-02',
    desc: 'Finite element structural calculations designed against extreme wind shear up to 180 km/h, seismic ground accelerations, and asymmetrical grain discharge stresses.',
    points: ['Eurocode EN 1993-4-1 & ANSI/ASAE compliant', 'Z600 / 450 g/m² hot-dip zinc corrosion protection', 'High-tensile Grade 350+ structural steel']
  },
  {
    icon: Cpu,
    title: 'Centralized SCADA & Automation',
    code: 'DISC-03',
    desc: 'Turnkey industrial electrical architecture featuring programmable logic controllers (PLCs), motorized valve sequencing, and continuous thermodynamic grain telemetry.',
    points: ['Siemens / Allen-Bradley PLC integration', 'Digital multi-point temperature cables', 'Automated aeration cycle management']
  },
  {
    icon: Settings,
    title: '2D & 3D BIM Plant Layouts',
    code: 'DISC-04',
    desc: 'Millimeter-accurate 3D digital twining of entire plant grounds—resolving pipe collisions, catwalk clear heights, and crane lifting paths prior to civil pouring.',
    points: ['Collision-free mechanical piping layout', 'Catwalk structural bridge load verification', 'Complete civil foundation load drawings']
  },
  {
    icon: Layers,
    title: 'Mechanical Wear & Flow Dynamics',
    code: 'DISC-05',
    desc: 'Heavy-duty conveyor engineering equipped with replaceable Hardox wear-liners on impact zones, crown-faced lagged pulleys, and continuous dust-tight casings.',
    points: ['Hardox 400/500 wear liners on hoods and chutes', 'ATEX explosion relief panels on elevator casings', 'Low-speed gentle transit minimizing kernel damage']
  },
  {
    icon: ShieldCheck,
    title: 'Civil & Foundation Engineering',
    code: 'DISC-06',
    desc: 'Complete geotechnical soil interaction analysis, ring beam raft foundation designs, and underground aeration ductwork engineering tailored to site bearing capacity.',
    points: ['Soil settlement & differential load analysis', 'Sub-surface intake pit drainage engineering', 'Foundation anchor bolt calculation']
  }
];

const CODE_STANDARDS = [
  { code: 'EN 1993-4-1', name: 'Eurocode 3', desc: 'Design of Steel Structures: Silos and Bulk Tanks' },
  { code: 'ANSI / ASAE EP433', name: 'American Standard', desc: 'Loads Exerted by Free-Flowing Grain on Bins' },
  { code: 'ISO 9001:2015', name: 'Quality Management', desc: 'Certified manufacturing and engineering processes' },
  { code: 'ATEX 2014/34/EU', name: 'Explosion Protection', desc: 'Combustible grain dust safety and explosion venting' }
];

export default function Engineering() {
  const [activeTab, setActiveTab] = useState<'disciplines' | 'standards' | 'calculations'>('disciplines');

  return (
    <Layout>
      <div className="bg-[#0B0B0B] text-white min-h-screen pt-36 pb-24 relative overflow-hidden">
        
        {/* CAD Blueprint Background */}
        <div className="absolute inset-0 technical-grid pointer-events-none opacity-25" />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
          
          {/* Header */}
          <div className="mb-20 max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#F4FF00]" />
              <span className="text-[#F4FF00] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                ENGINEERING STANDARDS & METHODOLOGY
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.98] mb-8">
              ENGINEERED FOR <br />
              <span className="text-[#A8AFB8]">EVERY GRAIN.</span>
            </h1>
            
            <p className="text-[#A8AFB8] text-base sm:text-xl max-w-2xl leading-relaxed font-normal">
              Every silo shell, support tower, and conveyor transfer chute is mathematically calculated and simulated under dynamic peak loads before steel is rolled.
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap gap-3 border-b border-white/[0.08] pb-6 mb-16">
            {[
              { id: 'disciplines', label: 'Engineering Disciplines (06)' },
              { id: 'standards', label: 'Compliance Standards (EN/ANSI/ISO)' },
              { id: 'calculations', label: 'Structural Calculations & QA' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-mono",
                  activeTab === tab.id 
                    ? "bg-[#F4FF00] text-[#0B0B0B]" 
                    : "bg-[#171717] text-white/70 hover:text-white border border-white/10 hover:border-white/30"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Switching */}
          <AnimatePresence mode="wait">
            {activeTab === 'disciplines' && (
              <motion.div 
                key="disciplines"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
              >
                {DISCIPLINES.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="bg-[#171717] border border-white/[0.08] hover:border-[#F4FF00]/60 p-8 flex flex-col justify-between transition-all duration-300 group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <span className="font-mono text-xs font-bold text-[#F4FF00] tracking-wider">
                            {item.code}
                          </span>
                          <div className="p-3 bg-[#0B0B0B] text-[#F4FF00] border border-white/10 group-hover:bg-[#F4FF00] group-hover:text-[#0B0B0B] transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>

                        <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-3 group-hover:text-[#F4FF00] transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-[#A8AFB8] text-sm leading-relaxed mb-6 font-normal">
                          {item.desc}
                        </p>
                      </div>

                      <div className="space-y-2 pt-6 border-t border-white/[0.06]">
                        {item.points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs text-white/80 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#F4FF00] shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === 'standards' && (
              <motion.div 
                key="standards"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
              >
                {CODE_STANDARDS.map((std, idx) => (
                  <div key={idx} className="bg-[#171717] border border-white/[0.08] p-8">
                    <div className="flex items-center gap-3 text-[#F4FF00] font-mono text-sm font-bold mb-2">
                      <FileCheck className="w-5 h-5" />
                      <span>{std.code}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-3">
                      {std.name}
                    </h3>
                    <p className="text-[#A8AFB8] text-sm leading-relaxed">
                      {std.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'calculations' && (
              <motion.div 
                key="calculations"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-[#171717] border border-white/[0.08] p-8 md:p-12 mb-24 space-y-8"
              >
                <div className="border-b border-white/[0.08] pb-6">
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">
                    FEA Stress Analysis & Load Matrices
                  </h3>
                  <p className="text-[#A8AFB8] text-sm max-w-2xl">
                    Our structural team calculates internal and external forces acting on each corrugated ring, stiffener junction, and anchor foot using certified finite element methods.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
                  <div className="bg-[#0B0B0B] p-6 border border-white/10">
                    <span className="text-[#F4FF00] font-bold block text-sm mb-1">DYNAMIC GRAIN PRESSURE</span>
                    <span className="text-[#A8AFB8]">Janssen equation modified for eccentric discharge loads and velocity variations.</span>
                  </div>
                  <div className="bg-[#0B0B0B] p-6 border border-white/10">
                    <span className="text-[#F4FF00] font-bold block text-sm mb-1">SEISMIC SHEAR LOAD</span>
                    <span className="text-[#A8AFB8]">Base shear calculations factoring sloshing grain effects and zone acceleration coefficients.</span>
                  </div>
                  <div className="bg-[#0B0B0B] p-6 border border-white/10">
                    <span className="text-[#F4FF00] font-bold block text-sm mb-1">WIND SUCTION PROFILE</span>
                    <span className="text-[#A8AFB8]">Aerodynamic roof cone stability designed for wind suction peaks up to 2.4 kN/m².</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Project Feasibility CTA */}
          <div className="bg-[#F4FF00] text-[#0B0B0B] p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase block mb-1">
                ENGINEERING CONSULTATION
              </span>
              <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                Review Your Site Calculations
              </h3>
              <p className="text-[#0B0B0B]/80 text-sm max-w-xl mt-2 font-normal">
                Submit your proposed storage volume, grain variety, and site coordinates to receive a preliminary structural feasibility assessment.
              </p>
            </div>
            
            <Link 
              to="/quote" 
              className="bg-[#0B0B0B] text-white px-8 py-4 font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-[#0B0B0B] transition-colors shrink-0 flex items-center gap-2"
            >
              Consult an Engineer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}
