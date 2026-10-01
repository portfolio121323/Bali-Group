import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Filter, 
  Check, 
  Save, 
  RotateCcw,
  X,
  Plus,
  HardDrive,
  Eye,
  CheckCircle2,
  FileText,
  Sparkles,
  Loader2,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  doc, 
  getDoc,
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  updateDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAssets } from '@/lib/contexts/AssetsContext';
import { useAdminToast } from './AdminToast';
import { ImageUploadField } from './ImageUploadField';
import { processDeviceImage, formatFileSize } from '@/lib/imageUtils';

export interface MediaSlot {
  key: string;
  name: string;
  section: 'Home Page' | 'Turnkey Process' | 'Products' | 'Projects' | 'Industries' | 'General';
  destination: string;
  defaultUrl: string;
  dimensions: string;
  description?: string;
}

export const DEFAULT_MEDIA_SLOTS: MediaSlot[] = [
  // 1. Home Page Key Hero
  {
    key: 'hero_bg',
    name: 'Hero Viewport Background Banner',
    section: 'Home Page',
    destination: 'Homepage Top Hero Screen (Full Viewport)',
    defaultUrl: 'https://images.unsplash.com/photo-1588624135540-c3d5e2197dd1?q=80&w=2940&auto=format&fit=crop',
    dimensions: '1920 x 1080 px',
    description: 'Cinematic primary background displayed across the full viewport at the top of the homepage.'
  },

  // 2. Grain Journey (Homepage Section 3 - 7 Stages)
  {
    key: 'grain_journey_receiving',
    name: 'Grain Journey: Stage 01 - Receiving',
    section: 'Home Page',
    destination: 'Homepage Section 3 (Grain Journey Pipeline - Stage 01)',
    defaultUrl: 'https://images.unsplash.com/photo-1578330752538-23ab6d321ee7?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'High-speed automated bulk intake stations for road hopper trucks and rail wagons.'
  },
  {
    key: 'grain_journey_cleaning',
    name: 'Grain Journey: Stage 02 - Pre-Cleaning',
    section: 'Home Page',
    destination: 'Homepage Section 3 (Grain Journey Pipeline - Stage 02)',
    defaultUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Multi-stage mechanical separation removing straw, stones, dust, and non-grain particulates.'
  },
  {
    key: 'grain_journey_conveying',
    name: 'Grain Journey: Stage 03 - Conveying',
    section: 'Home Page',
    destination: 'Homepage Section 3 (Grain Journey Pipeline - Stage 03)',
    defaultUrl: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Gentle, zero-spill vertical lifting and enclosed horizontal drag transit.'
  },
  {
    key: 'grain_journey_storage',
    name: 'Grain Journey: Stage 04 - Storage',
    section: 'Home Page',
    destination: 'Homepage Section 3 (Grain Journey Pipeline - Stage 04)',
    defaultUrl: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'High-tensile corrugated steel silos engineered for long-term climatic resilience.'
  },
  {
    key: 'grain_journey_monitoring',
    name: 'Grain Journey: Stage 05 - Monitoring',
    section: 'Home Page',
    destination: 'Homepage Section 3 (Grain Journey Pipeline - Stage 05)',
    defaultUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Continuous 24/7 digital thermodynamic control tracking grain temp, humidity, and CO2 hotspot detection.'
  },
  {
    key: 'grain_journey_processing',
    name: 'Grain Journey: Stage 06 - Processing',
    section: 'Home Page',
    destination: 'Homepage Section 3 (Grain Journey Pipeline - Stage 06)',
    defaultUrl: 'https://images.unsplash.com/photo-1563223552-30d01adceac3?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Seamless downstream feed into flour milling lines, rice polishers, or ethanol fermenters.'
  },
  {
    key: 'grain_journey_dispatch',
    name: 'Grain Journey: Stage 07 - Dispatch',
    section: 'Home Page',
    destination: 'Homepage Section 3 (Grain Journey Pipeline - Stage 07)',
    defaultUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'High-throughput automated outloading into trucks, bulk railcars, or container vessels.'
  },

  // 3. Product Ecosystem (Homepage Section 4 & /products Page)
  {
    key: 'product_flat_bottom',
    name: 'Flat Bottom Commercial Silos',
    section: 'Products',
    destination: 'Homepage Section 4 (Card 1) & /products Catalogue (Silos)',
    defaultUrl: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Heavy galvanized commercial flat-bottom steel grain silos up to 20,000 MT per bin.'
  },
  {
    key: 'product_elevator',
    name: 'Bucket Elevators & Conveyors',
    section: 'Products',
    destination: 'Homepage Section 4 (Card 2) & /products Catalogue (Material Handling)',
    defaultUrl: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Continuous vertical elevators and horizontal drag conveyors up to 1,000 TPH.'
  },
  {
    key: 'product_milling',
    name: 'Processing & Intake Lines',
    section: 'Products',
    destination: 'Homepage Section 4 (Card 3 - Milling Integration)',
    defaultUrl: 'https://images.unsplash.com/photo-1563223552-30d01adceac3?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Conditioning and pre-cleaning flow systems for commercial flour and rice mills.'
  },
  {
    key: 'product_fan',
    name: 'Aeration & SCADA Controls',
    section: 'Products',
    destination: 'Homepage Section 4 (Card 4) & /products Catalogue (Accessories)',
    defaultUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'High-static pressure fans, moisture telemetry, and centralized SCADA sync.'
  },
  {
    key: 'product_chain',
    name: 'Catwalks & Sweep Augers',
    section: 'Products',
    destination: 'Homepage Section 4 (Card 5) & /products Catalogue (Drag Conveyors)',
    defaultUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Galvanized catwalk structures, safety cages, and zero-entry motorized bin sweeps.'
  },
  {
    key: 'epc_design',
    name: 'Complete Industrial Plants / Turnkey EPC',
    section: 'Products',
    destination: 'Homepage Section 4 (Card 6) & Turnkey Process Phase 03',
    defaultUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Full-spectrum turnkey engineering covering 3D BIM design through handoff.'
  },
  {
    key: 'product_hopper',
    name: 'Hopper Bottom Grain Silos (45° / 60°)',
    section: 'Products',
    destination: '/products Page Catalogue (Hopper Silos)',
    defaultUrl: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Conical hopper bottom silos engineered for total gravity cleanout.'
  },
  {
    key: 'product_drum',
    name: 'Rotary Drum Pre-Cleaners & Scalpers',
    section: 'Products',
    destination: '/products Page Catalogue (Cleaning & Pre-Processing)',
    defaultUrl: 'https://images.unsplash.com/photo-1563223552-30d01adceac3?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Dual-screen rotary scalping drums removing straw, chaff, and foreign matter.'
  },

  // 4. Turnkey EPC Process Lifecycle (Homepage Section 5 - 7 Phases)
  {
    key: 'epc_consultation',
    name: 'Turnkey Phase 01: Consultation & Site Study',
    section: 'Turnkey Process',
    destination: 'Homepage Turnkey EPC Lifecycle Milestone 01',
    defaultUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Geotechnical soil investigation, wind load assessment, and logistics feasibility.'
  },
  {
    key: 'epc_engineering',
    name: 'Turnkey Phase 02: Process Engineering',
    section: 'Turnkey Process',
    destination: 'Homepage Turnkey EPC Lifecycle Milestone 02',
    defaultUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Mass-balance calculations, thermodynamic aeration sizing, and flow diagrams.'
  },
  {
    key: 'epc_manufacturing',
    name: 'Turnkey Phase 04: Precision Manufacturing',
    section: 'Turnkey Process',
    destination: 'Homepage Turnkey EPC Lifecycle Milestone 04',
    defaultUrl: 'https://images.unsplash.com/photo-1565514120038-16dc5c234b6b?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'CNC high-tensile corrugation roll-forming and continuous hot-dip zinc plating.'
  },
  {
    key: 'epc_installation',
    name: 'Turnkey Phase 05: Civil Foundation & Assembly',
    section: 'Turnkey Process',
    destination: 'Homepage Turnkey EPC Lifecycle Milestone 05',
    defaultUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Hydraulic jack-up system, precision concentric wall alignment, and ring beams.'
  },
  {
    key: 'epc_testing',
    name: 'Turnkey Phase 06: SCADA Integration & Dry Runs',
    section: 'Turnkey Process',
    destination: 'Homepage Turnkey EPC Lifecycle Milestone 06',
    defaultUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Electrical control room interlocks, vibration sensors, and automated dry runs.'
  },
  {
    key: 'epc_support',
    name: 'Turnkey Phase 07: Asset Handover & 24/7 Support',
    section: 'Turnkey Process',
    destination: 'Homepage Turnkey EPC Lifecycle Milestone 07',
    defaultUrl: 'https://images.unsplash.com/photo-1581092921461-7031e4bf0e5f?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Operating manuals, technician training, warranty coverage, and remote monitoring.'
  },

  // 5. Global Projects & Case Studies (Homepage Section 8 & /projects Page)
  {
    key: 'project_cover',
    name: 'Dubai Deepwater Port Terminal (120,000 MT)',
    section: 'Projects',
    destination: 'Homepage Global Footprint Card 1 & /projects Case Study 1',
    defaultUrl: 'https://images.unsplash.com/photo-1578330752538-23ab6d321ee7?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: '12x 10,000 MT Flat Bottom Silos + 1,000 TPH Shiploader Intake.'
  },
  {
    key: 'project_rice',
    name: 'Punjab Commercial Rice Mill (40,000 MT)',
    section: 'Projects',
    destination: 'Homepage Global Footprint Card 2 & /projects Case Study 2',
    defaultUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: '8x Hopper Silos + Complete Aspiration Cleaning & Tempering Line.'
  },
  {
    key: 'project_ethanol',
    name: 'São Paulo Ethanol Storage Infrastructure (80,000 MT)',
    section: 'Projects',
    destination: 'Homepage Global Footprint Card 3 & /projects Case Study 3',
    defaultUrl: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Maize reception buffers, high-throughput conveyors, explosion venting.'
  },
  {
    key: 'project_kenya',
    name: 'Nairobi National Strategic Food Reserve (200,000 MT)',
    section: 'Projects',
    destination: 'Homepage Global Footprint Card 4 & /projects Case Study 4',
    defaultUrl: 'https://images.unsplash.com/photo-1581092921461-7031e4bf0e5f?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Full turnkey EPC complex with digital SCADA moisture telemetry.'
  },
  {
    key: 'project_thai',
    name: 'Rayong Commercial Agri-Port Bulk Terminal (60,000 MT)',
    section: 'Projects',
    destination: '/projects Page Portfolio Case Study 5',
    defaultUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Specialized tropical ventilation, twin bucket elevators, automated bagging lines.'
  },

  // 6. Target Sectors & Applications (Homepage Section 6 & /industries Page)
  {
    key: 'industry_commercial',
    name: 'Commercial Grain Trading & Port Logistics',
    section: 'Industries',
    destination: 'Homepage Served Markets Sector 01 & /industries Page',
    defaultUrl: 'https://images.unsplash.com/photo-1578330752538-23ab6d321ee7?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'High-throughput receiving, storing, and ship-loading infrastructure.'
  },
  {
    key: 'industry_rice',
    name: 'Rice, Flour & Feed Milling Facilities',
    section: 'Industries',
    destination: 'Homepage Served Markets Sector 02 & /industries Page',
    defaultUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Grain processing, aspiration, and ingredient conditioning integration.'
  },
  {
    key: 'industry_feed_ethanol',
    name: 'Feed & Animal Nutrition Plants',
    section: 'Industries',
    destination: 'Homepage Served Markets Sector 03 & /industries Page',
    defaultUrl: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Hopper bottom bins with steep discharge angles and specialized batching.'
  },
  {
    key: 'industry_ethanol',
    name: 'Biofuels & Ethanol Grain Distilleries',
    section: 'Industries',
    destination: 'Homepage Served Markets Sector 04 & /industries Page',
    defaultUrl: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'High-volume feedstock handling with explosion-proof safety systems.'
  },
  {
    key: 'industry_port_terminals',
    name: 'Deepwater Port Terminals & Marine Berths',
    section: 'Industries',
    destination: 'Homepage Served Markets Sector 05 & /industries Page',
    defaultUrl: 'https://images.unsplash.com/photo-1581092921461-7031e4bf0e5f?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Marine vessel bulk loading booms and export complexes for coastal conditions.'
  },

  // 7. Company & Facility Operations Hub
  {
    key: 'company_facility',
    name: 'Chandigarh Manufacturing Facility & Operations Hub',
    section: 'General',
    destination: '/company Page Operational Hub Dossier',
    defaultUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop',
    dimensions: '1200 x 800 px',
    description: 'Heavy fabrication facility, automated CNC roll-forming line, and central engineering office.'
  },

  // 8. Global Brand Identity & Logo
  {
    key: 'site_logo',
    name: 'Website Primary Logo / Brand Mark',
    section: 'General',
    destination: 'Global Header Navigation Bar & Pre-Footer Identity',
    defaultUrl: '',
    dimensions: 'Square Emblem (512x512) or Horizontal Wordmark (400x100) px',
    description: 'Corporate logo displayed across the website header and footer. Supports PNG, SVG, JPG, WebP with transparency.'
  },
  {
    key: 'site_logo_footer',
    name: 'Footer Secondary Logo / Alternate Mark (Optional)',
    section: 'General',
    destination: 'Website Pre-Footer (falls back to Primary Logo if unset)',
    defaultUrl: '',
    dimensions: 'Square or Horizontal SVG / PNG',
    description: 'Optional distinct logo mark for the bottom footer section. If unset, uses the primary website logo.'
  }
];

// Product Sync Map between assetKey and Firestore products document ID
const PRODUCT_DOC_MAP: Record<string, string> = {
  product_flat_bottom: 'prod-flat-bottom',
  product_hopper: 'prod-hopper-bottom',
  product_elevator: 'prod-bucket-elevators',
  product_chain: 'prod-drag-chain',
  product_drum: 'prod-drum-cleaner',
  product_fan: 'prod-aeration-fans',
};

// Project Sync Map between assetKey and Firestore projects document ID
const PROJECT_DOC_MAP: Record<string, string> = {
  project_cover: 'proj-dubai-port',
  project_rice: 'proj-punjab-rice',
  project_ethanol: 'proj-brazil-ethanol',
  project_kenya: 'proj-kenya-reserve',
  project_thai: 'proj-thailand-port',
};

export const MediaView: React.FC = () => {
  const { assets } = useAssets();
  const { toast } = useAdminToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [selectedSlot, setSelectedSlot] = useState<MediaSlot | null>(null);
  const [activeAssetUrl, setActiveAssetUrl] = useState('');
  const [altInput, setAltInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // New Custom Asset Modal State
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [newAssetKey, setNewAssetKey] = useState('');
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetDestination, setNewAssetDestination] = useState('');
  const [newAssetSection, setNewAssetSection] = useState<'Home Page' | 'Turnkey Process' | 'Products' | 'Projects' | 'Industries' | 'General'>('General');
  const [newAssetImage, setNewAssetImage] = useState('');

  // Quick file upload ref for quick card actions
  const cardFileInputRef = useRef<HTMLInputElement>(null);
  const [quickUploadSlotKey, setQuickUploadSlotKey] = useState<string | null>(null);

  const sections = ['All', 'Home Page', 'Turnkey Process', 'Products', 'Projects', 'Industries', 'General'];

  // Include any custom uploaded assets from Firestore that are not in default list
  const customSlots: MediaSlot[] = Object.keys(assets)
    .filter(key => !DEFAULT_MEDIA_SLOTS.some(s => s.key === key))
    .map(key => ({
      key,
      name: assets[key]?.alt || `Custom Asset (${key})`,
      section: 'General',
      destination: (assets[key] as any)?.destination || `Custom Page or Dynamic Slot (${key})`,
      defaultUrl: assets[key]?.url || '',
      dimensions: 'Custom Dimension',
      description: 'Custom asset uploaded from PC / device.'
    }));

  const allSlots = [...DEFAULT_MEDIA_SLOTS, ...customSlots];

  const filteredSlots = allSlots.filter(slot => {
    const matchesSearch = slot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          slot.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          slot.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (slot.description && slot.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSection = sectionFilter === 'All' || slot.section === sectionFilter;
    return matchesSearch && matchesSection;
  });

  const handleOpenDetail = (slot: MediaSlot) => {
    setSelectedSlot(slot);
    setActiveAssetUrl(assets[slot.key]?.url || slot.defaultUrl);
    setAltInput(assets[slot.key]?.alt || slot.name);
  };

  // Helper to sync asset upload to products and projects collections if matched
  const syncToProductAndProjectCollections = async (slotKey: string, dataUrl: string) => {
    try {
      // 1. Direct doc map sync for products
      if (PRODUCT_DOC_MAP[slotKey]) {
        await setDoc(doc(db, 'products', PRODUCT_DOC_MAP[slotKey]), {
          imageUrl: dataUrl,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      // 2. Query any products matching assetKey
      const prodQ = query(collection(db, 'products'), where('assetKey', '==', slotKey));
      const prodSnap = await getDocs(prodQ);
      prodSnap.forEach(async (d) => {
        await updateDoc(doc(db, 'products', d.id), {
          imageUrl: dataUrl,
          updatedAt: serverTimestamp(),
        });
      });

      // 3. Direct doc map sync for projects
      if (PROJECT_DOC_MAP[slotKey]) {
        await setDoc(doc(db, 'projects', PROJECT_DOC_MAP[slotKey]), {
          imageUrl: dataUrl,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      // 4. Query any projects matching assetKey
      const projQ = query(collection(db, 'projects'), where('assetKey', '==', slotKey));
      const projSnap = await getDocs(projQ);
      projSnap.forEach(async (d) => {
        await updateDoc(doc(db, 'projects', d.id), {
          imageUrl: dataUrl,
          updatedAt: serverTimestamp(),
        });
      });

      // 5. If it's a grain journey stage slot (e.g. grain_journey_receiving)
      if (slotKey.startsWith('grain_journey_')) {
        const stageId = slotKey.replace('grain_journey_', '');
        try {
          const gjDocRef = doc(db, 'site_content', 'grain_journey');
          const gjSnap = await getDoc(gjDocRef);
          if (gjSnap.exists()) {
            const gjData = gjSnap.data() as any;
            if (Array.isArray(gjData.stages)) {
              // Keep site_content/grain_journey under 10 KB by stripping base64 strings.
              // Base64 photos are stored in their own individual site_assets/{slotKey} documents.
              const updatedStages = gjData.stages.map((st: any) => {
                if (st.id === stageId) {
                  return {
                    ...st,
                    photoUrl: dataUrl.startsWith('data:') ? '' : dataUrl,
                  };
                }
                return {
                  ...st,
                  photoUrl: st.photoUrl?.startsWith('data:') ? '' : (st.photoUrl || ''),
                };
              });
              await setDoc(gjDocRef, {
                ...gjData,
                stages: updatedStages,
                updatedAt: serverTimestamp(),
              }, { merge: true });
            }
          }
        } catch (gjErr) {
          console.warn('Sync to site_content/grain_journey error:', gjErr);
        }
      }
    } catch (err) {
      console.warn('Sync to products/projects error:', err);
    }
  };

  // Quick upload handler directly from card
  const handleQuickUploadTrigger = (slotKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickUploadSlotKey(slotKey);
    cardFileInputRef.current?.click();
  };

  const handleQuickFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !quickUploadSlotKey) return;

    try {
      setIsUploading(true);
      const processed = await processDeviceImage(file, { maxDimension: 1600, quality: 0.85 });
      const targetSlot = allSlots.find(s => s.key === quickUploadSlotKey);
      
      // Save to site_assets
      await setDoc(doc(db, 'site_assets', quickUploadSlotKey), {
        url: processed.dataUrl,
        alt: targetSlot?.name || 'Bali Group Industrial Asset',
        destination: targetSlot?.destination || '',
        updatedAt: serverTimestamp(),
      });

      // Synchronize directly with matching products/projects collections
      await syncToProductAndProjectCollections(quickUploadSlotKey, processed.dataUrl);

      toast({
        title: 'Image Live on Website',
        message: `${targetSlot?.name || quickUploadSlotKey} updated for: ${targetSlot?.destination || 'Destination'}`,
        type: 'success',
      });
    } catch (err: any) {
      toast({ title: 'Upload Failed', message: err.message || 'Could not process image.', type: 'error' });
    } finally {
      setIsUploading(false);
      setQuickUploadSlotKey(null);
      e.target.value = '';
    }
  };

  // Save changes from inside Detail Modal
  const handleSaveModalAsset = async () => {
    if (!selectedSlot) return;
    setIsUploading(true);
    try {
      await setDoc(doc(db, 'site_assets', selectedSlot.key), {
        url: activeAssetUrl,
        alt: altInput || selectedSlot.name,
        destination: selectedSlot.destination,
        updatedAt: serverTimestamp(),
      });

      // Synchronize directly with matching products/projects collections
      await syncToProductAndProjectCollections(selectedSlot.key, activeAssetUrl);

      toast({
        title: 'Destination Synchronized',
        message: `Updated image live on: ${selectedSlot.destination}`,
        type: 'success',
      });
      setSelectedSlot(null);
    } catch (err: any) {
      toast({ title: 'Save Failed', message: err.message, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  // Reset custom upload back to factory default
  const handleResetToDefault = async (slotKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Reset this asset to factory default industrial photograph?')) return;
    try {
      await deleteDoc(doc(db, 'site_assets', slotKey));
      toast({ title: 'Asset Reset', message: 'Restored factory industrial photography.', type: 'info' });
      if (selectedSlot?.key === slotKey) {
        setSelectedSlot(null);
      }
    } catch (err: any) {
      toast({ title: 'Reset Failed', message: err.message, type: 'error' });
    }
  };

  // Create new custom asset from device
  const handleCreateCustomAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetKey.trim() || !newAssetImage) {
      toast({ title: 'Missing Info', message: 'Please provide an asset key and upload a photo from your PC.', type: 'error' });
      return;
    }

    const cleanKey = newAssetKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    setIsUploading(true);

    try {
      await setDoc(doc(db, 'site_assets', cleanKey), {
        url: newAssetImage,
        alt: newAssetName.trim() || cleanKey,
        destination: newAssetDestination.trim() || 'Custom Website Component',
        section: newAssetSection,
        updatedAt: serverTimestamp(),
      });
      toast({
        title: 'New Asset Active',
        message: `Asset "${cleanKey}" ready for use on the website.`,
        type: 'success',
      });
      setShowAddCustomModal(false);
      setNewAssetKey('');
      setNewAssetName('');
      setNewAssetDestination('');
      setNewAssetImage('');
    } catch (err: any) {
      toast({ title: 'Creation Failed', message: err.message, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hidden file input for single-click card replacement */}
      <input
        ref={cardFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
        onChange={handleQuickFileChange}
        className="hidden"
      />

      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[30px] font-bold text-[#0B0D0E] tracking-tight">
            Media & Asset Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1 font-normal">
            Every image on the Bali Group website is directly linked to an exact destination below. Upload any photo from your PC to update that section live.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddCustomModal(true)}
          className="bg-[#0B0D0E] hover:bg-[#1B1F22] text-white border border-[#2B3034] text-xs font-bold px-4 py-2.5 rounded-[8px] flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#EFFF00]" />
          <span>Upload New Asset from PC</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#141719] p-4 rounded-[12px] border border-[#2B3034] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9097]" />
            <input
              type="text"
              placeholder="Search by asset name, destination, or slot key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#101214] border border-[#2B3034] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-[#8A9097] focus:outline-none focus:border-[#EFFF00]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {sections.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSectionFilter(sec)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                  sectionFilter === sec
                    ? "bg-[#EFFF00] text-[#0B0D0E]"
                    : "bg-[#1B1F22] text-[#B9BDC1] hover:text-white border border-[#2B3034]"
                )}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-[#8A9097] font-mono shrink-0">
          Showing {filteredSlots.length} of {allSlots.length} destinations
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredSlots.map((slot) => {
          const isCustomized = !!assets[slot.key]?.url;
          const currentUrl = assets[slot.key]?.url || slot.defaultUrl;

          return (
            <div
              key={slot.key}
              onClick={() => handleOpenDetail(slot)}
              className="group bg-[#141719] border border-[#2B3034] hover:border-[#EFFF00] rounded-[12px] overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg"
            >
              <div>
                {/* Image Thumbnail with Overlay */}
                <div className="relative aspect-video bg-[#0B0D0E] overflow-hidden">
                  <img
                    src={currentUrl}
                    alt={slot.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Section Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-[#0B0D0E]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-[#2B3034] uppercase font-mono">
                      {slot.section}
                    </span>
                  </div>

                  {/* Custom upload indicator */}
                  {isCustomized && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-[#EFFF00] text-[#0B0D0E] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3 h-3" />
                        Live
                      </span>
                    </div>
                  )}

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                    <button
                      type="button"
                      onClick={(e) => handleQuickUploadTrigger(slot.key, e)}
                      className="bg-[#EFFF00] text-[#0B0D0E] hover:bg-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md transition-colors"
                      title="Select and upload a photo from your PC directly"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from PC</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(slot);
                      }}
                      className="bg-[#1B1F22] border border-[#2B3034] text-white hover:text-[#EFFF00] font-semibold text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                      title="Open full inspector"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="font-bold text-white text-xs leading-snug line-clamp-1 group-hover:text-[#EFFF00] transition-colors">
                      {slot.name}
                    </h3>
                  </div>

                  {/* Destination Tag */}
                  <div className="p-2 bg-[#101214] border border-[#2B3034] rounded-lg">
                    <div className="text-[10px] font-mono text-[#8A9097] uppercase mb-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#EFFF00] shrink-0" />
                      <span>Website Destination</span>
                    </div>
                    <p className="text-[11px] font-medium text-[#EFFF00] line-clamp-1">
                      {slot.destination}
                    </p>
                  </div>

                  {slot.description && (
                    <p className="text-[11px] text-[#8A9097] line-clamp-2 leading-relaxed font-normal">
                      {slot.description}
                    </p>
                  )}

                  <div className="pt-2 border-t border-[#2B3034]/70 flex items-center justify-between text-[10px] font-mono text-[#8A9097]">
                    <span className="text-[#B9BDC1] truncate max-w-[130px]" title={slot.key}>
                      key: {slot.key}
                    </span>
                    <span>{slot.dimensions}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Quick Actions */}
              <div className="px-4 py-2.5 bg-[#101214] border-t border-[#2B3034] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(e) => handleQuickUploadTrigger(slot.key, e)}
                  className="text-[#EFFF00] hover:underline font-semibold flex items-center gap-1 text-[11px]"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload from PC</span>
                </button>

                {isCustomized && (
                  <button
                    type="button"
                    onClick={(e) => handleResetToDefault(slot.key, e)}
                    className="text-[#8A9097] hover:text-[#C55A5A] transition-colors flex items-center gap-1 text-[10px]"
                    title="Reset to original default photo"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Asset Detail & PC Upload Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#141719] border border-[#2B3034] rounded-[14px] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs text-white">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#2B3034] flex items-center justify-between bg-[#101214]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#1B1F22] border border-[#2B3034] text-[10px] font-mono font-bold text-[#EFFF00] uppercase">
                    {selectedSlot.section}
                  </span>
                  <span className="text-[#8A9097] font-mono text-[10px]">
                    slot: {selectedSlot.key}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
                  {selectedSlot.name}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedSlot(null)} 
                className="p-2 text-[#8A9097] hover:text-white hover:bg-[#1B1F22] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              
              {/* Destination Banner */}
              <div className="p-3.5 bg-[#101214] border border-[#2B3034] rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1B1F22] border border-[#2B3034] flex items-center justify-center text-[#EFFF00] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#8A9097] uppercase block">
                      Target Website Destination
                    </span>
                    <span className="text-xs font-bold text-[#EFFF00]">
                      {selectedSlot.destination}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#8A9097]">
                  {selectedSlot.dimensions}
                </span>
              </div>

              {/* Device Image Uploader */}
              <ImageUploadField
                value={activeAssetUrl}
                onChange={(url) => setActiveAssetUrl(url)}
                label="Upload High-Resolution Photo from PC / Device"
                recommendedDimensions={selectedSlot.dimensions}
                aspectRatio="video"
              />

              {/* Alt Text / Caption Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white block">
                  SEO Alt Text & Engineering Caption
                </label>
                <input
                  type="text"
                  value={altInput}
                  onChange={(e) => setAltInput(e.target.value)}
                  placeholder="Descriptive caption for accessibility and search indexing..."
                  className="w-full bg-[#101214] border border-[#2B3034] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#EFFF00]"
                />
              </div>

              {/* Real-time Sync Note */}
              <div className="p-3 bg-[#101214] border border-[#2B3034] rounded-lg flex items-start gap-3">
                <HardDrive className="w-4 h-4 text-[#EFFF00] shrink-0 mt-0.5" />
                <div className="text-[11px] text-[#B9BDC1] leading-relaxed">
                  <span className="text-white font-semibold">Live Real-Time Synchronization:</span> When you save, this image automatically pushes to <strong className="text-white">{selectedSlot.destination}</strong> across all connected users and devices without needing a page refresh.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#2B3034] bg-[#101214] flex items-center justify-between">
              {assets[selectedSlot.key]?.url ? (
                <button
                  type="button"
                  onClick={() => handleResetToDefault(selectedSlot.key)}
                  className="px-3 py-2 text-[#C55A5A] hover:bg-[#2B1B1B] rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Factory Default</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="px-4 py-2 border border-[#2B3034] rounded-lg font-semibold text-[#B9BDC1] hover:text-white hover:bg-[#1B1F22] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={handleSaveModalAsset}
                  className="bg-[#EFFF00] hover:bg-white text-[#0B0D0E] font-bold px-5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0B0D0E]" />
                  ) : (
                    <Save className="w-4 h-4 text-[#0B0D0E]" />
                  )}
                  <span>{isUploading ? 'Saving...' : 'Deploy to Website'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add Custom Asset from PC Modal */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#141719] border border-[#2B3034] rounded-[14px] shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden text-xs text-white">
            
            <div className="p-5 border-b border-[#2B3034] flex items-center justify-between bg-[#101214]">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Upload Custom Asset from PC / Device
                </h2>
                <p className="text-[11px] text-[#8A9097] mt-0.5">
                  Select any photo from your computer or phone and define its destination.
                </p>
              </div>
              <button 
                onClick={() => setShowAddCustomModal(false)} 
                className="p-2 text-[#8A9097] hover:text-white hover:bg-[#1B1F22] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomAsset} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Asset Title / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Export Terminal Night Operations"
                  value={newAssetName}
                  onChange={(e) => {
                    setNewAssetName(e.target.value);
                    if (!newAssetKey) {
                      setNewAssetKey(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'));
                    }
                  }}
                  className="w-full bg-[#101214] border border-[#2B3034] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EFFF00]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Website Destination Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Homepage Header Banner / Solutions Gallery"
                  value={newAssetDestination}
                  onChange={(e) => setNewAssetDestination(e.target.value)}
                  className="w-full bg-[#101214] border border-[#2B3034] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EFFF00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">
                    Slot Key (Unique ID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. custom_terminal_night"
                    value={newAssetKey}
                    onChange={(e) => setNewAssetKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                    className="w-full bg-[#101214] border border-[#2B3034] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#EFFF00]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white block mb-1">
                    Website Section
                  </label>
                  <select
                    value={newAssetSection}
                    onChange={(e) => setNewAssetSection(e.target.value as any)}
                    className="w-full bg-[#101214] border border-[#2B3034] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EFFF00]"
                  >
                    <option value="Home Page">Home Page</option>
                    <option value="Turnkey Process">Turnkey Process</option>
                    <option value="Products">Products</option>
                    <option value="Projects">Projects</option>
                    <option value="Industries">Industries</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* Upload image directly from device */}
              <ImageUploadField
                value={newAssetImage}
                onChange={(url) => setNewAssetImage(url)}
                label="Select Photo from PC / Device *"
                recommendedDimensions="1200 x 800 px"
                aspectRatio="video"
              />

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2B3034]">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 border border-[#2B3034] rounded-lg font-semibold text-[#B9BDC1] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !newAssetImage}
                  className="bg-[#EFFF00] hover:bg-white text-[#0B0D0E] font-bold px-5 py-2 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>Upload & Register Asset</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
