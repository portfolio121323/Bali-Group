import React, { useState, useEffect } from 'react';
import { 
  ArrowDownToLine, 
  Filter, 
  ArrowLeftRight, 
  Database, 
  Activity, 
  Cpu, 
  Truck, 
  Check, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Eye, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Loader2,
  HardDrive,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAssets } from '@/lib/contexts/AssetsContext';
import { useAdminToast } from './AdminToast';
import { ImageUploadField } from './ImageUploadField';
import { cn } from '@/lib/utils';

export interface ProcessStageData {
  id: string;
  step: string;
  title: string;
  summary: string;
  equipment: string[];
  capacitySpec: string;
  photoUrl: string;
  diagramDetails: string;
}

export interface GrainJourneyContentData {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  stages: ProcessStageData[];
}

export const DEFAULT_GRAIN_JOURNEY: GrainJourneyContentData = {
  eyebrow: 'ENGINEERED PROCESS FLOW',
  headlineLine1: 'FROM GRAIN IN',
  headlineLine2: 'TO GRAIN OUT.',
  description: 'Every step is mathematically engineered to maintain raw grain quality, maximize throughput, and eliminate processing downtime across continuous commercial operations.',
  stages: [
    { 
      id: 'receiving', 
      step: '01',
      title: 'Receiving', 
      summary: 'High-speed automated bulk intake stations for road hopper trucks and rail wagons with dust suppression.',
      equipment: ['Hydraulic Truck Tippers', 'Drive-Over Intake Hoppers', 'Aspiration Dust Collection Hoods'],
      capacitySpec: 'Intake throughput up to 1,000 TPH',
      photoUrl: 'https://images.unsplash.com/photo-1578330752538-23ab6d321ee7?q=80&w=1200&auto=format&fit=crop',
      diagramDetails: 'Sub-surface reception pit with self-cleaning tapered hopper grids'
    },
    { 
      id: 'cleaning', 
      step: '02',
      title: 'Pre-Cleaning', 
      summary: 'Multi-stage mechanical separation removing straw, stones, dust, and non-grain particulates before storage.',
      equipment: ['Rotary Drum Scalpers', 'Air-Recycling Aspiration Channels', 'Magnetic In-Line Traps'],
      capacitySpec: 'Cleaning efficiency > 99.2%',
      photoUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop',
      diagramDetails: 'Dual-screen rotating cylinders with counter-flow air separation'
    },
    { 
      id: 'conveying', 
      step: '03',
      title: 'Conveying', 
      summary: 'Gentle, zero-spill vertical lifting and enclosed horizontal transit engineered to preserve grain kernel integrity.',
      equipment: ['Heavy-Duty Bucket Elevators', 'Enclosed Drag Chain Conveyors', 'Catenary Belt Conveyors'],
      capacitySpec: 'Minimal grain breakage (< 0.1%)',
      photoUrl: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=1200&auto=format&fit=crop',
      diagramDetails: 'Hardox wear-resistant replaceable liners on discharge hoods'
    },
    { 
      id: 'storage', 
      step: '04',
      title: 'Storage', 
      summary: 'High-tensile corrugated steel silos engineered for climatic resilience, seismic stability, and long-term storage.',
      equipment: ['Flat Bottom Commercial Silos', 'Hopper Bottom Silos (45°/60°)', 'Corrugated Structural Wall Sheets'],
      capacitySpec: 'Single silo volumes up to 20,000 MT',
      photoUrl: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop',
      diagramDetails: 'High-grade Z600 zinc galvanized steel structural envelope'
    },
    { 
      id: 'monitoring', 
      step: '05',
      title: 'Monitoring', 
      summary: 'Continuous 24/7 digital thermodynamic control tracking grain temp, humidity, and CO2 hotspot detection.',
      equipment: ['Digital Multi-Point Temp Cables', 'Automated Centrifugal Aeration Fans', 'Roof Exhausters & Air Vents'],
      capacitySpec: 'Real-time telemetry & SCADA alarms',
      photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
      diagramDetails: 'Direct integration with central programmable logic controllers'
    },
    { 
      id: 'processing', 
      step: '06',
      title: 'Processing', 
      summary: 'Seamless downstream feed into flour milling lines, rice polishers, ethanol fermenters, or feed mixers.',
      equipment: ['Precision Metering Augers', 'Gravity Destoners', 'Grain Conditioners & Dampeners'],
      capacitySpec: 'Continuous automated batching',
      photoUrl: 'https://images.unsplash.com/photo-1563223552-30d01adceac3?q=80&w=1200&auto=format&fit=crop',
      diagramDetails: 'Direct PLC sync with milling plant operations'
    },
    { 
      id: 'dispatch', 
      step: '07',
      title: 'Dispatch', 
      summary: 'High-throughput automated outloading into trucks, bulk railcars, or container vessels with integrated weighing.',
      equipment: ['Telescopic Loading Bellows', 'Continuous Batch Flow Scales', 'Overhead Truck Loadout Hoppers'],
      capacitySpec: 'Rapid turnaround < 8 minutes per 40T truck',
      photoUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1200&auto=format&fit=crop',
      diagramDetails: 'Dustless telescopic bellows with integrated suction filters'
    },
  ]
};

export const ProcessFlowView: React.FC = () => {
  const { toast } = useAdminToast();
  const { assets } = useAssets();
  const [content, setContent] = useState<GrainJourneyContentData>(DEFAULT_GRAIN_JOURNEY);
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newEquipmentItem, setNewEquipmentItem] = useState('');

  // Subscribe to live Firestore content
  useEffect(() => {
    const docRef = doc(db, 'site_content', 'grain_journey');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as GrainJourneyContentData;
        if (data && data.stages && data.stages.length > 0) {
          setContent(data);
        }
      }
      setIsLoading(false);
    }, (err) => {
      console.warn('Error reading grain journey content:', err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const activeStage = content.stages[activeStageIdx] || content.stages[0];
  const activeAssetKey = `grain_journey_${activeStage?.id || 'receiving'}`;
  const resolvedStagePhoto = 
    (activeStage?.photoUrl && activeStage.photoUrl.startsWith('data:') ? activeStage.photoUrl : null) ||
    assets[activeAssetKey]?.url || 
    activeStage?.photoUrl || 
    DEFAULT_GRAIN_JOURNEY.stages[activeStageIdx]?.photoUrl || 
    '';

  const handleUpdateSectionCopy = (field: keyof Omit<GrainJourneyContentData, 'stages'>, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateStage = (field: keyof ProcessStageData, value: any) => {
    setContent(prev => {
      const newStages = [...prev.stages];
      newStages[activeStageIdx] = {
        ...newStages[activeStageIdx],
        [field]: value
      };
      return {
        ...prev,
        stages: newStages
      };
    });
  };

  const handleUpdateStagePhoto = async (url: string) => {
    handleUpdateStage('photoUrl', url);

    // Synchronize immediately to individual site_assets document (has its own 1MB quota, only ~80KB)
    if (activeStage && activeStage.id) {
      try {
        await setDoc(doc(db, 'site_assets', `grain_journey_${activeStage.id}`), {
          url: url,
          alt: `${activeStage.title} Sub-System Equipment`,
          destination: `Homepage Section 3 (Grain Journey Stage ${activeStage.step})`,
          updatedAt: serverTimestamp(),
        }, { merge: true });

        // Update site_content/grain_journey stages document with lightweight metadata
        // CRITICAL: NEVER store large base64 data URLs in site_content/grain_journey!
        // Storing multiple base64 images in a single doc exceeds Firestore's 1MB limit (1,048,576 bytes).
        const docRef = doc(db, 'site_content', 'grain_journey');
        const gjSnap = await getDoc(docRef);
        if (gjSnap.exists()) {
          const gjData = gjSnap.data() as any;
          if (Array.isArray(gjData.stages)) {
            const nextStages = gjData.stages.map((st: any) => {
              if (st.id === activeStage.id) {
                return {
                  ...st,
                  photoUrl: url.startsWith('data:') ? '' : url,
                };
              }
              return {
                ...st,
                photoUrl: st.photoUrl?.startsWith('data:') ? '' : (st.photoUrl || ''),
              };
            });
            await setDoc(docRef, {
              ...gjData,
              stages: nextStages,
              updatedAt: serverTimestamp(),
            }, { merge: true });
          }
        }

        toast({
          title: `Stage ${activeStage.step} Photo Updated`,
          message: `Equipment photograph live on website for Stage ${activeStage.step} (${activeStage.title}).`,
          type: 'success',
        });
      } catch (err: any) {
        console.warn('Sync stage photo error:', err);
      }
    }
  };

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEquipmentItem.trim()) return;
    const currentEquipment = activeStage.equipment || [];
    handleUpdateStage('equipment', [...currentEquipment, newEquipmentItem.trim()]);
    setNewEquipmentItem('');
  };

  const handleRemoveEquipment = (index: number) => {
    const currentEquipment = activeStage.equipment || [];
    handleUpdateStage('equipment', currentEquipment.filter((_, i) => i !== index));
  };

  const handleSaveToFirestore = async () => {
    setIsSaving(true);
    try {
      // 1. Synchronize each stage's image to individual site_assets document (each gets its own 1MB quota)
      for (const stage of content.stages) {
        if (stage.photoUrl && stage.id) {
          try {
            await setDoc(doc(db, 'site_assets', `grain_journey_${stage.id}`), {
              url: stage.photoUrl,
              alt: `${stage.title} Sub-System Equipment`,
              destination: `Homepage Section 3 (Grain Journey Stage ${stage.step})`,
              updatedAt: serverTimestamp(),
            }, { merge: true });
          } catch (syncErr) {
            console.warn(`Sync failed for stage ${stage.id}:`, syncErr);
          }
        }
      }

      // 2. Sanitize stages: strip all base64 data URLs so site_content/grain_journey stays under 10 KB!
      const sanitizedStages = content.stages.map((st) => ({
        ...st,
        photoUrl: st.photoUrl?.startsWith('data:') ? '' : (st.photoUrl || ''),
      }));

      // 3. Save lightweight section content (< 5 KB!) to site_content/grain_journey
      await setDoc(doc(db, 'site_content', 'grain_journey'), {
        ...content,
        stages: sanitizedStages,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Process Flow Saved',
        message: 'Grain Journey section updated and live across the website.',
        type: 'success',
      });
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        message: err.message || 'Could not update Process Flow section.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!confirm('Reset all Process Flow & Grain Journey text and stages to default engineering specs?')) return;
    setContent(DEFAULT_GRAIN_JOURNEY);
    try {
      await setDoc(doc(db, 'site_content', 'grain_journey'), {
        ...DEFAULT_GRAIN_JOURNEY,
        updatedAt: serverTimestamp(),
      });
      toast({
        title: 'Reset Completed',
        message: 'Restored original industrial process flow specifications.',
        type: 'info',
      });
    } catch (err: any) {
      toast({ title: 'Reset Error', message: err.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#1B1F22] border border-[#2B3034] text-[10px] font-mono font-bold text-[#EFFF00] uppercase">
              HOMEPAGE SECTION 03
            </span>
            <span className="text-[#8A9097] text-xs font-mono">
              7 Commercial Stages
            </span>
          </div>
          <h1 className="text-2xl sm:text-[30px] font-bold text-[#0B0D0E] tracking-tight">
            Engineered Process Flow (Grain Journey)
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1 font-normal">
            Edit the "From Grain In To Grain Out" interactive pipeline showcased on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="/#process-flow"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-[8px] border border-[#2B3034] bg-[#141719] hover:bg-[#1B1F22] text-[#B9BDC1] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4 text-[#EFFF00]" />
            <span>View on Site</span>
            <ExternalLink className="w-3 h-3 text-[#8A9097]" />
          </a>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveToFirestore}
            className="bg-[#EFFF00] hover:bg-white text-[#0B0D0E] font-bold text-xs px-5 py-2.5 rounded-[8px] flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save & Deploy Live</span>
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-[#141719] border border-[#2B3034] rounded-[14px] p-6 space-y-6 text-white shadow-sm">
        
        {/* SECTION 1: Header & Headline Copy */}
        <div className="space-y-4 pb-6 border-b border-[#2B3034]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EFFF00]" />
              <span>Section Header & Title Copy</span>
            </h2>
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="text-[11px] text-[#8A9097] hover:text-[#C55A5A] transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Section to Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#B9BDC1] block mb-1">
                Eyebrow Badge
              </label>
              <input
                type="text"
                value={content.eyebrow}
                onChange={(e) => handleUpdateSectionCopy('eyebrow', e.target.value)}
                placeholder="ENGINEERED PROCESS FLOW"
                className="w-full bg-[#101214] border border-[#2B3034] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EFFF00]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#B9BDC1] block mb-1">
                Headline Line 1
              </label>
              <input
                type="text"
                value={content.headlineLine1}
                onChange={(e) => handleUpdateSectionCopy('headlineLine1', e.target.value)}
                placeholder="FROM GRAIN IN"
                className="w-full bg-[#101214] border border-[#2B3034] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EFFF00]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#B9BDC1] block mb-1">
                Headline Line 2 (Accent)
              </label>
              <input
                type="text"
                value={content.headlineLine2}
                onChange={(e) => handleUpdateSectionCopy('headlineLine2', e.target.value)}
                placeholder="TO GRAIN OUT."
                className="w-full bg-[#101214] border border-[#2B3034] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EFFF00]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#B9BDC1] block mb-1">
              Section Engineering Subtitle
            </label>
            <textarea
              rows={2}
              value={content.description}
              onChange={(e) => handleUpdateSectionCopy('description', e.target.value)}
              placeholder="Every step is mathematically engineered to maintain raw grain quality..."
              className="w-full bg-[#101214] border border-[#2B3034] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EFFF00]"
            />
          </div>
        </div>

        {/* SECTION 2: Stage Selector (7 Stages Tabs) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EFFF00]" />
              <span>Select Stage to Edit (01 - 07)</span>
            </h2>
            <span className="text-[11px] font-mono text-[#8A9097]">
              Active: Stage {activeStage.step} ({activeStage.title})
            </span>
          </div>

          {/* Step Pill Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {content.stages.map((stage, idx) => {
              const isSelected = activeStageIdx === idx;
              return (
                <button
                  key={stage.id || idx}
                  type="button"
                  onClick={() => setActiveStageIdx(idx)}
                  className={cn(
                    "p-3 rounded-lg border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer",
                    isSelected
                      ? "bg-[#1B1F22] border-[#EFFF00] shadow-sm shadow-[#EFFF00]/10"
                      : "bg-[#101214] border-[#2B3034] hover:border-white/20 text-[#8A9097] hover:text-white"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-xs font-mono font-bold",
                      isSelected ? "text-[#EFFF00]" : "text-[#8A9097]"
                    )}>
                      {stage.step}
                    </span>
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      isSelected ? "bg-[#EFFF00]" : "bg-[#2B3034]"
                    )} />
                  </div>
                  <span className={cn(
                    "text-xs font-bold truncate block",
                    isSelected ? "text-white" : "text-[#B9BDC1]"
                  )}>
                    {stage.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Detailed Active Stage Editor */}
        <div className="p-6 bg-[#101214] border border-[#2B3034] rounded-[12px] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B3034] pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#EFFF00] uppercase font-bold">
                STAGE // {activeStage.step} OF 07
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                {activeStage.title} Sub-System Configuration
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#1B1F22] border border-[#2B3034] text-[10px] font-mono text-[#8A9097]">
                ID: grain_journey_{activeStage.id}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Text & Machine Data */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#B9BDC1] block mb-1">
                    Stage Name / Title *
                  </label>
                  <input
                    type="text"
                    value={activeStage.title}
                    onChange={(e) => handleUpdateStage('title', e.target.value)}
                    placeholder="e.g. Storage"
                    className="w-full bg-[#141719] border border-[#2B3034] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EFFF00]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#B9BDC1] block mb-1">
                    Step Number / Code *
                  </label>
                  <input
                    type="text"
                    value={activeStage.step}
                    onChange={(e) => handleUpdateStage('step', e.target.value)}
                    placeholder="e.g. 04"
                    className="w-full bg-[#141719] border border-[#2B3034] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#EFFF00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#B9BDC1] block mb-1">
                  Diagram & Engineering Sub-System Reference
                </label>
                <input
                  type="text"
                  value={activeStage.diagramDetails}
                  onChange={(e) => handleUpdateStage('diagramDetails', e.target.value)}
                  placeholder="e.g. Sub-surface reception pit with self-cleaning tapered hopper grids"
                  className="w-full bg-[#141719] border border-[#2B3034] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EFFF00]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#B9BDC1] block mb-1">
                  Engineering Summary / Description *
                </label>
                <textarea
                  rows={3}
                  value={activeStage.summary}
                  onChange={(e) => handleUpdateStage('summary', e.target.value)}
                  placeholder="Detailed breakdown of how this stage operates..."
                  className="w-full bg-[#141719] border border-[#2B3034] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EFFF00]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#B9BDC1] block mb-1">
                  Engineering Performance Metric *
                </label>
                <input
                  type="text"
                  value={activeStage.capacitySpec}
                  onChange={(e) => handleUpdateStage('capacitySpec', e.target.value)}
                  placeholder="e.g. Single silo volumes up to 20,000 MT"
                  className="w-full bg-[#141719] border border-[#2B3034] rounded-lg px-3 py-2 text-xs font-mono text-[#EFFF00] focus:outline-none focus:border-[#EFFF00]"
                />
              </div>

              {/* Machinery Items Chips */}
              <div className="space-y-2 pt-2 border-t border-[#2B3034]">
                <label className="text-xs font-semibold text-[#B9BDC1] block">
                  Integrated Equipment & Machinery Chips:
                </label>

                <div className="flex flex-wrap gap-2">
                  {activeStage.equipment.map((item, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1.5 rounded bg-[#17191C] border border-[#2B3034] text-xs text-white flex items-center gap-2 group"
                    >
                      <Check className="w-3.5 h-3.5 text-[#EFFF00]" />
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEquipment(i)}
                        className="text-[#8A9097] hover:text-[#C55A5A] transition-colors ml-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add new equipment input */}
                <form onSubmit={handleAddEquipment} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newEquipmentItem}
                    onChange={(e) => setNewEquipmentItem(e.target.value)}
                    placeholder="Add equipment (e.g. Double-Leg Bucket Elevator)..."
                    className="flex-1 bg-[#141719] border border-[#2B3034] rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#EFFF00]"
                  />
                  <button
                    type="submit"
                    className="bg-[#1B1F22] border border-[#2B3034] hover:bg-[#EFFF00] hover:text-[#0B0D0E] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Industrial Photograph Upload */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white block">
                  Primary Industrial Photograph (Stage {activeStage.step})
                </label>
                <span className="text-[10px] font-mono text-[#EFFF00] px-2 py-0.5 rounded bg-[#1B1F22] border border-[#2B3034]">
                  {activeAssetKey}
                </span>
              </div>

              <ImageUploadField
                value={resolvedStagePhoto}
                onChange={handleUpdateStagePhoto}
                label={`Stage 0${activeStageIdx + 1} Equipment Photo`}
                recommendedDimensions="1200 x 800 px (Landscape)"
                aspectRatio="video"
              />

              <div className="p-3 bg-[#141719] border border-[#2B3034] rounded-lg text-[11px] text-[#8A9097] leading-relaxed space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold block">Live Destination:</span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">Auto-Sync Enabled</span>
                </div>
                <p>
                  This photo is rendered directly in the right spotlight visual of the <span className="text-white font-medium">"From Grain In To Grain Out"</span> homepage interactive pipeline (Stage {activeStage.step}: {activeStage.title}).
                </p>
                <p className="text-[10px] text-[#EFFF00]">
                  Uploading a photo here or pasting an image URL immediately updates the live website.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Save Action Bar */}
        <div className="pt-4 border-t border-[#2B3034] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#8A9097]">
            <CheckCircle2 className="w-4 h-4 text-[#EFFF00]" />
            <span>Changes synchronize in real-time with the website upon saving.</span>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveToFirestore}
            className="w-full sm:w-auto bg-[#EFFF00] hover:bg-white text-[#0B0D0E] font-bold text-xs px-6 py-2.5 rounded-[8px] flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-[#0B0D0E]" /> : <Save className="w-4 h-4 text-[#0B0D0E]" />}
            <span>{isSaving ? 'Deploying Changes...' : 'Save & Deploy Process Flow'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
