import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { DynamicMedia } from '@/components/DynamicMedia';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const EPC_STEPS = [
  {
    num: '01',
    title: 'Consultation & Site Study',
    assetKey: 'epc_consultation',
    fallback: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=2070&auto=format&fit=crop',
    alt: 'Bali Group industrial engineers conducting grain storage site survey and geotechnical feasibility study',
    summary: 'Comprehensive site assessment, geotechnical soil analysis, seismic zone verification, and intake/outloading logistical study to define precise project scope.',
    deliverables: ['Topographical & Soil Study', 'Logistical Traffic Flow', 'Feasibility Architecture']
  },
  {
    num: '02',
    title: 'Process Engineering',
    assetKey: 'epc_engineering',
    fallback: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop',
    alt: 'Process engineering and grain throughput flow simulation',
    summary: 'Mass flow balances, aeration thermodynamics, conveying line velocity calculations, and dust suppression modeling tailored to your grain variety.',
    deliverables: ['Mass Flow Flowcharts', 'Aeration Calculations', 'Equipment Sizing Specs']
  },
  {
    num: '03',
    title: '2D / 3D Plant Design',
    assetKey: 'epc_design',
    fallback: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop',
    alt: '3D CAD plant layout and BIM structural collision detection',
    summary: 'Complete architectural layout, structural steel analysis, foundation load drawings, and 3D BIM clash detection to ensure zero interference during erection.',
    deliverables: ['Civil Foundation Drawings', 'Full 3D Plant BIM Model', 'Structural Steel Calculations']
  },
  {
    num: '04',
    title: 'Precision Manufacturing',
    assetKey: 'epc_manufacturing',
    fallback: 'https://images.unsplash.com/photo-1565514120038-16dc5c234b6b?q=80&w=2070&auto=format&fit=crop',
    alt: 'Automated CNC corrugated silo sheet roll-forming and fabrication',
    summary: 'Fabrication of Z600 galvanized corrugated wall sheets, stiffeners, high-tensile roof trusses, bucket elevators, and enclosed chain conveyors in our state-of-the-art facility.',
    deliverables: ['Z600 Galvanized Corrugations', 'CNC Stiffener Production', 'Factory Quality QA Certificates']
  },
  {
    num: '05',
    title: 'Installation & Integration',
    assetKey: 'epc_installation',
    fallback: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=2070&auto=format&fit=crop',
    alt: 'Heavy industrial silo erection and catwalk installation by field teams',
    summary: 'Supervised mechanical and electrical erection by veteran field installation managers, heavy crane rigging, catwalk alignment, and conveyor integration.',
    deliverables: ['Certified Rigging Teams', 'Mechanical Erection', 'Catwalk & Tower Alignment']
  },
  {
    num: '06',
    title: 'Testing & Commissioning',
    assetKey: 'epc_testing',
    fallback: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2070&auto=format&fit=crop',
    alt: 'SCADA automation testing and grain trial runs',
    summary: 'Dry and wet grain trial runs, safety interlock verification, SCADA automation tuning, acoustic fan balancing, and operator training prior to commercial handover.',
    deliverables: ['Trial Run Test Reports', 'SCADA System Integration', 'Client Operational Training']
  },
  {
    num: '07',
    title: 'Lifecycle & After-Sales Support',
    assetKey: 'epc_support',
    fallback: 'https://images.unsplash.com/photo-1581092921461-7031e4bf0e5f?q=80&w=2070&auto=format&fit=crop',
    alt: 'Industrial engineering field maintenance and spare parts logistics',
    summary: 'Long-term partnership with guaranteed spare parts availability, scheduled structural audits, sensor calibration, and ongoing engineering optimization.',
    deliverables: ['Guaranteed Spares Supply', 'Annual Structural Audits', '24/7 Technical Dispatch']
  }
];

export function TurnkeyProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section 
      id="turnkey" 
      className="lifecycle-section bg-[#171717] text-white py-24 md:py-36 relative overflow-visible border-b border-white/[0.08]" 
      ref={containerRef}
    >
      
      {/* Background blueprint grid clipped to section bounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 technical-grid opacity-30" />
      </div>

      <div className="lifecycle-grid max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
        
        {/* Left Column: Container for Sticky Content */}
        <div className="left-sticky-column lg:col-span-5 relative flex flex-col">
          {/* Inner Left Content Wrapper: Sticky on desktop (>=1024px), normal flow on mobile */}
          <div className="inner-left-content lg:sticky lg:top-[110px] lg:self-start space-y-8 w-full">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-10 bg-[#F4FF00]" />
                <span className="text-[#F4FF00] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                  TURNKEY EPC LIFECYCLE
                </span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase leading-[1.02] mb-6">
                ONE PARTNER. <br />
                <span className="text-[#A8AFB8]">CONCEPT TO COMMISSIONING.</span>
              </h2>
              
              <p className="text-[#A8AFB8] text-base leading-relaxed mb-8">
                We assume single-point commercial and engineering accountability across the entire project lifecycle. Eliminating contractor handoff disputes, scheduling delays, and operational inefficiencies.
              </p>
            </div>

            {/* EPC Strengths List */}
            <div className="space-y-3 border-y border-white/[0.08] py-6">
              {[
                'Single Contract Accountability (No Subcontractor Blame)',
                'Guaranteed Throughput & Minimum Grain Damage',
                'Compliant with International Structural Standards (Eurocode, ANSI)',
                'Turnkey Delivery on Predetermined Commissioning Schedules'
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-white/90">
                  <ShieldCheck className="w-4 h-4 text-[#F4FF00] shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div>
              <Link 
                to="/quote" 
                className="inline-flex items-center gap-3 bg-[#F4FF00] text-[#0B0B0B] px-8 py-3.5 font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
              >
                Discuss Your Site Scope <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Vertical Timeline & Phase Cards */}
        <div className="right-phases-column lg:col-span-7 relative pl-8 md:pl-16">
          
          {/* Timeline background track line */}
          <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-white/10" />
          
          {/* Animated fill line */}
          <motion.div 
            className="absolute left-0 top-6 bottom-6 w-[2px] bg-[#F4FF00] origin-top"
            style={{ scaleY }}
          />

          <div className="space-y-16 py-4">
            {EPC_STEPS.map((step, idx) => (
              <div key={idx} className="relative group">
                
                {/* Node indicator */}
                <div className="absolute -left-[39px] md:-left-[71px] top-1.5 w-4 h-4 bg-[#202124] border-2 border-white/40 group-hover:border-[#F4FF00] group-hover:bg-[#F4FF00] transition-colors z-10" />
                
                <div className="bg-[#202124] border border-white/[0.08] hover:border-white/20 p-6 md:p-8 transition-all">
                  
                  {/* Phase Header */}
                  <div className="flex items-center justify-between gap-4 mb-3 border-b border-white/[0.06] pb-3">
                    <span className="text-[#F4FF00] font-mono text-xs font-bold tracking-widest uppercase">
                      PHASE // {step.num}
                    </span>
                    <span className="text-white/40 text-[11px] font-mono uppercase hidden sm:inline">
                      Turnkey Milestone
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-[#F4FF00] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-[#A8AFB8] text-sm leading-relaxed mb-6 font-normal">
                    {step.summary}
                  </p>

                  {/* Real Industrial Photograph */}
                  <div className="relative h-56 sm:h-64 overflow-hidden mb-6 bg-[#0B0B0B]">
                    <DynamicMedia 
                      assetKey={step.assetKey}
                      fallbackUrl={step.fallback}
                      alt={step.alt}
                      className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 text-[10px] font-mono text-white/70 uppercase">
                      {step.title} — Verified Engineering Scope
                    </div>
                  </div>

                  {/* Key Deliverables Chips */}
                  <div className="flex flex-wrap gap-2">
                    {step.deliverables.map((item, dIdx) => (
                      <span key={dIdx} className="text-[11px] font-mono text-white/80 bg-[#171717] px-3 py-1.5 border border-white/[0.05] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[#F4FF00]" />
                        {item}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
