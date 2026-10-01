import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  ArrowDownToLine, 
  Filter, 
  ArrowLeftRight, 
  Database, 
  Activity, 
  Cpu, 
  Truck, 
  Check,
  Workflow,
  Layers,
  Settings,
  ShieldCheck,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DynamicMedia } from '@/components/DynamicMedia';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  DEFAULT_GRAIN_JOURNEY, 
  GrainJourneyContentData, 
  ProcessStageData 
} from '@/components/admin/ProcessFlowView';

const STAGE_ICON_MAP: Record<string, LucideIcon> = {
  receiving: ArrowDownToLine,
  cleaning: Filter,
  conveying: ArrowLeftRight,
  storage: Database,
  monitoring: Activity,
  processing: Cpu,
  dispatch: Truck,
};

function resolveStageIcon(stage: ProcessStageData, index: number): LucideIcon {
  const normalizedId = (stage.id || '').toLowerCase().trim();
  if (STAGE_ICON_MAP[normalizedId]) {
    return STAGE_ICON_MAP[normalizedId];
  }
  const fallbackIcons = [
    ArrowDownToLine,
    Filter,
    ArrowLeftRight,
    Database,
    Activity,
    Cpu,
    Truck,
    Workflow,
    Layers,
    Settings,
    ShieldCheck
  ];
  return fallbackIcons[index % fallbackIcons.length] || Workflow;
}

export function GrainJourney() {
  const [content, setContent] = useState<GrainJourneyContentData>(DEFAULT_GRAIN_JOURNEY);
  const [activeIdx, setActiveIdx] = useState(0);

  // Subscribe to live Firestore site_content/grain_journey updates
  useEffect(() => {
    if (!db) return;
    try {
      const unsub = onSnapshot(
        doc(db, 'site_content', 'grain_journey'),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as GrainJourneyContentData;
            if (data && Array.isArray(data.stages) && data.stages.length > 0) {
              setContent(data);
            }
          }
        },
        (err) => {
          console.warn('Live subscription to site_content/grain_journey fell back to default:', err);
        }
      );

      return () => {
        try {
          unsub();
        } catch (_) {}
      };
    } catch (e) {
      console.warn('Failed to listen to site_content/grain_journey:', e);
    }
  }, []);

  const stages = content.stages && content.stages.length > 0 ? content.stages : DEFAULT_GRAIN_JOURNEY.stages;
  const currentIdx = Math.min(activeIdx, Math.max(0, stages.length - 1));
  const activeStage = stages[currentIdx] || stages[0];

  return (
    <section id="process-flow" className="bg-[#171717] py-24 md:py-32 text-white relative overflow-hidden border-b border-white/[0.08]">
      
      {/* Background CAD Grid */}
      <div className="absolute inset-0 technical-grid pointer-events-none opacity-40" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#F4FF00]" />
              <span className="text-[#F4FF00] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                {content.eyebrow || 'ENGINEERED PROCESS FLOW'}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase">
              {content.headlineLine1 || 'FROM GRAIN IN'} <br />
              <span className="text-[#A8AFB8]">{content.headlineLine2 || 'TO GRAIN OUT.'}</span>
            </h2>
          </div>
          <p className="text-[#A8AFB8] text-sm md:text-base max-w-md leading-relaxed">
            {content.description || 'Every step is mathematically engineered to maintain raw grain quality, maximize throughput, and eliminate processing downtime across continuous commercial operations.'}
          </p>
        </div>

        {/* Desktop Process Flow Timeline Line */}
        <div className="hidden lg:block mb-12 relative">
          
          {/* Base Track */}
          <div className="absolute top-7 left-8 right-8 h-[2px] bg-white/10 z-0" />
          
          {/* Active Progress Line */}
          <motion.div 
            className="absolute top-7 left-8 h-[2px] bg-[#F4FF00] z-0 transition-all duration-500 ease-out"
            style={{ width: `${stages.length > 1 ? (currentIdx / (stages.length - 1)) * 92 : 0}%` }}
          />

          <div 
            className="grid gap-4 relative z-10"
            style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
          >
            {stages.map((stage, idx) => {
              const Icon = resolveStageIcon(stage, idx);
              const isActive = currentIdx === idx;
              const isPassed = currentIdx > idx;

              return (
                <button
                  key={stage.id || idx}
                  onClick={() => setActiveIdx(idx)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className="group flex flex-col items-center text-center cursor-pointer transition-all focus:outline-none"
                >
                  {/* Step Node */}
                  <div className={cn(
                    "w-14 h-14 rounded-none flex items-center justify-center transition-all duration-300 relative border-2 mb-4",
                    isActive 
                      ? "bg-[#F4FF00] border-[#F4FF00] text-[#0B0B0B] shadow-lg shadow-[#F4FF00]/20 scale-110" 
                      : isPassed
                      ? "bg-[#202124] border-[#F4FF00]/60 text-[#F4FF00]"
                      : "bg-[#202124] border-white/15 text-[#A8AFB8] group-hover:border-white/40 group-hover:text-white"
                  )}>
                    <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 1.75} />
                    <span className="absolute -top-3 -right-2 px-1.5 py-0.5 bg-[#0B0B0B] border border-white/10 text-[10px] font-mono font-bold text-[#A8AFB8]">
                      {stage.step || String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title & Status */}
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider transition-colors line-clamp-1",
                    isActive ? "text-[#F4FF00]" : "text-white/70 group-hover:text-white"
                  )}>
                    {stage.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Stage Selector */}
        <div className="lg:hidden flex overflow-x-auto gap-3 pb-6 mb-8 scrollbar-none">
          {stages.map((stage, idx) => {
            const Icon = resolveStageIcon(stage, idx);
            const isActive = currentIdx === idx;
            return (
              <button
                key={stage.id || idx}
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider shrink-0 border transition-all",
                  isActive 
                    ? "bg-[#F4FF00] text-[#0B0B0B] border-[#F4FF00]" 
                    : "bg-[#202124] text-white/70 border-white/10 hover:border-white/30"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{stage.step || String(idx + 1).padStart(2, '0')} {stage.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Spotlight Panel */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeStage.id || currentIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-[#202124] border border-white/[0.1] grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
          >
            {/* Left Technical Data */}
            <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#F4FF00] font-mono text-sm font-bold">
                    STAGE // {activeStage.step || String(currentIdx + 1).padStart(2, '0')} OF {String(stages.length).padStart(2, '0')}
                  </span>
                  {activeStage.diagramDetails && (
                    <>
                      <span className="w-1 h-1 bg-white/40" />
                      <span className="text-white/60 text-xs font-mono uppercase">{activeStage.diagramDetails}</span>
                    </>
                  )}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
                  {activeStage.title} Sub-System
                </h3>

                <p className="text-[#A8AFB8] text-base leading-relaxed mb-8">
                  {activeStage.summary}
                </p>

                {activeStage.equipment && activeStage.equipment.length > 0 && (
                  <div className="space-y-4 mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#F4FF00] block font-mono">
                      Integrated Equipment & Machinery:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeStage.equipment.map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs text-white/90 bg-[#171717] px-3.5 py-2.5 border border-white/[0.06]">
                          <Check className="w-3.5 h-3.5 text-[#F4FF00] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Performance Indicator */}
              <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#A8AFB8] uppercase tracking-wider block font-mono">Engineering Performance Metric</span>
                  <span className="text-[#F4FF00] font-bold text-sm sm:text-base font-mono">
                    {activeStage.capacitySpec || 'Industrial continuous duty certified'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#A8AFB8] uppercase tracking-wider block font-mono">Status</span>
                  <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 justify-end">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Certified Standard
                  </span>
                </div>
              </div>
            </div>

            {/* Right Industrial Image / Visual */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden bg-[#0B0B0B] group">
              <DynamicMedia 
                assetKey={activeStage.id ? `grain_journey_${activeStage.id}` : undefined}
                fallbackUrl={activeStage.photoUrl || DEFAULT_GRAIN_JOURNEY.stages[currentIdx]?.photoUrl || ''}
                alt={`${activeStage.title} industrial plant equipment`}
                className="w-full h-full object-cover filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-[#202124]/30 to-[#202124]/80 pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-[#0B0B0B]/85 backdrop-blur-sm p-3 border border-white/10 text-xs text-[#A8AFB8] flex items-center justify-between font-mono z-10">
                <span>STAGE REF: BG-ENG-{activeStage.step || String(currentIdx + 1).padStart(2, '0')}</span>
                <span className="text-[#F4FF00]">TURNKEY EPC SPEC</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
