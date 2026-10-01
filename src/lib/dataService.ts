import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { db } from './firebase';

export interface ProductRecord {
  id: string;
  title: string;
  category: string;
  assetKey: string;
  imageUrl: string;
  desc: string;
  specs: { label: string; value: string }[];
  features: string[];
  published: boolean;
  updatedAt?: any;
}

export interface ProjectRecord {
  id: string;
  title: string;
  location: string;
  capacity: string;
  category: string;
  assetKey: string;
  imageUrl: string;
  scope: string;
  specs: { label: string; value: string }[];
  deliverables: string[];
  status: 'Completed' | 'In Progress' | 'Commissioned';
  completionRate: number;
  published: boolean;
  updatedAt?: any;
}

export interface LeadRecord {
  id: string;
  reference: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  projectType: string;
  capacity: string;
  material?: string;
  notes?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Closed';
  assignedTo?: string;
  internalNotes?: string[];
  createdAt?: any;
  date?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Editor';
  status: 'Active' | 'Away';
  department: string;
  lastLogin?: string;
}

export interface SiteSettings {
  orgName: string;
  logoUrl?: string;
  hideBrandText?: boolean;
  phone: string;
  email: string;
  address: string;
  timezone: string;
  linkedin: string;
  youtube: string;
  twitter: string;
  brochureUrl: string;
  metaTitle: string;
  metaDescription: string;
  notifyOnLead: boolean;
  dailyDigest: boolean;
  highCapacityAlerts: boolean;
}

export const INITIAL_PRODUCTS: ProductRecord[] = [
  {
    id: 'prod-flat-bottom',
    title: 'Flat Bottom Commercial Silos',
    category: 'Silos',
    assetKey: 'product_flat_bottom',
    imageUrl: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop',
    desc: 'Heavy-duty commercial storage engineered for long-term grain preservation. Built with high-tensile Z600 galvanized corrugated steel sheets and exterior structural column stiffeners.',
    specs: [
      { label: 'Capacity Range', value: '1,000 to 20,000 MT per bin' },
      { label: 'Zinc Coating', value: 'Z600 (450 g/m²) Hot-Dip Galvanized' },
      { label: 'Roof Slope', value: '30° High-Load Structural Cone' },
      { label: 'Standards', value: 'Eurocode EN 1993-4-1 / ANSI / ASAE' }
    ],
    features: ['High-static aeration manifold', 'Multi-point digital temp sensor cables', 'Zero-entry motorized sweep auger integration'],
    published: true,
  },
  {
    id: 'prod-hopper-bottom',
    title: 'Hopper Bottom Silos (45° / 60°)',
    category: 'Silos',
    assetKey: 'product_hopper',
    imageUrl: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=1200&auto=format&fit=crop',
    desc: 'Self-emptying gravity discharge silos designed for rapid turnaround operations, wet grain holding before driers, and flour/feed mill batch feeding.',
    specs: [
      { label: 'Capacity Range', value: '50 to 2,500 MT' },
      { label: 'Cone Angle', value: '45° for cereals, 60° for damp/sticky grain' },
      { label: 'Support Structure', value: 'Heavy galvanized H-beam structural legs' },
      { label: 'Discharge Gate', value: 'Rack & pinion manual or pneumatic slide' }
    ],
    features: ['Rapid complete gravity discharge', 'Eliminates sweep auger requirements', 'Ring beam seismic wind bracing'],
    published: true,
  },
  {
    id: 'prod-bucket-elevators',
    title: 'Heavy-Duty Bucket Elevators',
    category: 'Material Handling',
    assetKey: 'product_elevator',
    imageUrl: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=1200&auto=format&fit=crop',
    desc: 'Continuous vertical lifting built for 24/7 demanding terminal intake. Engineered to prevent kernel scuffing while maintaining rated throughput under maximum head pressures.',
    specs: [
      { label: 'Throughput', value: 'Up to 1,000 TPH (tonnes per hour)' },
      { label: 'Casing', value: 'Self-supporting double-leg galvanized steel' },
      { label: 'Safety', value: 'Explosion relief panels, speed sensor, backstop' },
      { label: 'Belt/Chain', value: 'Oil-resistant antistatic rubber or forged chain' }
    ],
    features: ['Replaceable Hardox wear liners on hood', 'Crown-faced rubber lagged drive pulley', 'Automated gravity screw take-up boot'],
    published: true,
  },
  {
    id: 'prod-drag-chain',
    title: 'Enclosed Drag Chain Conveyors',
    category: 'Material Handling',
    assetKey: 'product_chain',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    desc: 'Dust-tight, weather-sealed horizontal and inclined bulk grain transport. Designed with UHMW polyethylene flights and Hardox bottom wear plates.',
    specs: [
      { label: 'Throughput', value: '50 to 800 TPH continuous flow' },
      { label: 'Flight Design', value: 'UHMW-PE non-sparking segmented flights' },
      { label: 'Casing Gauge', value: 'Heavy 3mm–5mm galvanized steel panels' },
      { label: 'Drive Unit', value: 'Direct-coupled hollow shaft bevel-helical' }
    ],
    features: ['Self-cleaning contoured tail section', 'Overflow relief door with electrical limit switch', 'Drop-forged hardened case chain links'],
    published: true,
  },
  {
    id: 'prod-drum-cleaner',
    title: 'Rotary Drum Grain Pre-Cleaners',
    category: 'Cleaning & Processing',
    assetKey: 'product_drum',
    imageUrl: 'https://images.unsplash.com/photo-1563223552-30d01adceac3?q=80&w=1200&auto=format&fit=crop',
    desc: 'High-throughput intake scalping drum that eliminates straw, corn cobs, stones, and chaff before grain enters bucket elevators or storage bins.',
    specs: [
      { label: 'Cleaning Capacity', value: 'Up to 300 TPH commercial intake' },
      { label: 'Screen Drums', value: 'Interchangeable perforated steel screens' },
      { label: 'Aspiration', value: 'Integrated aspiration air dust hood' },
      { label: 'Maintenance', value: 'Quick-release clamp for fast screen swaps' }
    ],
    features: ['Zero vibration counterbalanced drum', 'Internal spiral for continuous discharge of oversize debris', 'Aspiration channel with cyclone recovery'],
    published: true,
  },
  {
    id: 'prod-aeration-fans',
    title: 'High-Static Pressure Aeration Fans',
    category: 'Accessories',
    assetKey: 'product_fan',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop',
    desc: 'Centrifugal and axial aeration blowers engineered to overcome deep grain bed static pressure in 10,000+ MT silos.',
    specs: [
      { label: 'Motor Rating', value: '7.5 kW to 75 kW high-efficiency IE3' },
      { label: 'Housing', value: 'Hot-dip galvanized heavy-gauge sheet steel' },
      { label: 'Impeller', value: 'Dynamically balanced backward-curved aluminum' },
      { label: 'Noise Control', value: 'Silencer baffles reducing noise below 82 dBA' }
    ],
    features: ['Weatherproof rain hood and transition duct', 'IP55 motor protection with PTC thermistors', 'Airflow damper for precise pressure adjustment'],
    published: true,
  }
];

export const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: 'proj-dubai-port',
    title: 'Deepwater Port Terminal Expansion',
    location: 'Dubai, UAE',
    capacity: '120,000 MT Total Storage',
    category: 'Commercial Ports',
    assetKey: 'project_cover',
    imageUrl: 'https://images.unsplash.com/photo-1578330752538-23ab6d321ee7?q=80&w=1200&auto=format&fit=crop',
    scope: 'Turnkey engineering and installation of 12 commercial flat-bottom silos with high-speed 1,000 TPH marine shiploader intake conveyors and dust suppression systems.',
    specs: [
      { label: 'Silo Configuration', value: '12x 10,000 MT Flat Bottom Silos' },
      { label: 'Intake Capacity', value: '1,000 TPH Marine Berth Conveyor' },
      { label: 'Galvanizing', value: 'Z600 Heavy Marine Environment Coating' },
      { label: 'Completion', value: 'Handed over on-time in 14 months' }
    ],
    deliverables: ['Marine Intake Tower', 'High-Speed Enclosed Belt Conveyors', 'Automated SCADA Control Room', 'High-Static Pressure Aeration'],
    status: 'Completed',
    completionRate: 100,
    published: true,
  },
  {
    id: 'proj-punjab-rice',
    title: 'Integrated Commercial Rice Milling Plant',
    location: 'Punjab, India',
    capacity: '40,000 MT Storage',
    category: 'Rice & Flour Mills',
    assetKey: 'project_rice',
    imageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1200&auto=format&fit=crop',
    scope: 'Complete grain handling and storage complex designed to preserve paddy kernel moisture balance and supply clean tempered grain directly to milling rolls.',
    specs: [
      { label: 'Silo Configuration', value: '8x 5,000 MT Hopper Bottom Silos' },
      { label: 'Pre-Cleaning', value: '250 TPH Rotary Drum Cleaners' },
      { label: 'Discharge', value: 'Continuous 60° gravity discharge hoppers' },
      { label: 'Breakage Limit', value: '< 0.08% grain breakage guaranteed' }
    ],
    deliverables: ['Intake Pit with Truck Tipper', 'Rotary Scalpers & Destoners', 'Digital Temperature Sensing Matrix', 'Milling Feed Augers'],
    status: 'Completed',
    completionRate: 100,
    published: true,
  },
  {
    id: 'proj-brazil-ethanol',
    title: 'High-Capacity Ethanol Distillery Storage',
    location: 'Mato Grosso, Brazil',
    capacity: '80,000 MT Maize Storage',
    category: 'Ethanol & Distilleries',
    assetKey: 'project_ethanol',
    imageUrl: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop',
    scope: 'Corn storage facility feeding a 600,000 liter/day fuel ethanol distillery with 24/7 automated conveyor discharge and automated moisture cooling towers.',
    specs: [
      { label: 'Silo Configuration', value: '8x 10,000 MT Flat Bottom Silos' },
      { label: 'Turnaround Rate', value: '24/7 automated feed to hammer mills' },
      { label: 'Aeration', value: 'Dual-speed centrifugal blowers' },
      { label: 'Civil Scope', value: 'Deep piling ring beam foundations' }
    ],
    deliverables: ['Automated Sweep Augers', 'Aspiration Dust Collection', 'Intake Sampling Spear', 'Explosion Relief Venting'],
    status: 'Commissioned',
    completionRate: 100,
    published: true,
  },
  {
    id: 'proj-kenya-reserve',
    title: 'Strategic Grain Reserve Terminal',
    location: 'Nairobi, Kenya',
    capacity: '60,000 MT Storage',
    category: 'Strategic Reserves',
    assetKey: 'project_kenya',
    imageUrl: 'https://images.unsplash.com/photo-1581092921461-7031e4bf0e5f?q=80&w=1200&auto=format&fit=crop',
    scope: 'National food security project featuring hermetic silo technology, continuous fumigation circulation, and multi-point moisture sensors.',
    specs: [
      { label: 'Silo Configuration', value: '6x 10,000 MT Flat Bottom Silos' },
      { label: 'Intake Velocity', value: '400 TPH Truck Unloading Grid' },
      { label: 'Protection', value: 'Hermetic recirculation gas sealing' },
      { label: 'Handover', value: 'Commissioned with training program' }
    ],
    deliverables: ['Heavy-Duty Elevators', 'Fumigation Piping Ring', 'Grain Chilling Unit Connectors', 'Weighbridge Automation'],
    status: 'Completed',
    completionRate: 100,
    published: true,
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Admin User',
    email: 'admin@baligroupsilos.com',
    role: 'Super Admin',
    status: 'Active',
    department: 'Engineering Operations',
    lastLogin: 'Today, 09:42 AM',
  },
  {
    id: 'team-2',
    name: 'Baldev Singh Bali',
    email: 'baldev.bali@baligroupsilos.com',
    role: 'Super Admin',
    status: 'Active',
    department: 'Executive Board',
    lastLogin: 'Yesterday',
  },
  {
    id: 'team-3',
    name: 'Amanpreet Sharma',
    email: 'aman.sharma@baligroupsilos.com',
    role: 'Admin',
    status: 'Active',
    department: 'Project EPC & Technical Desk',
    lastLogin: '2 hours ago',
  },
  {
    id: 'team-4',
    name: 'Rohan Verma',
    email: 'rohan.v@baligroupsilos.com',
    role: 'Editor',
    status: 'Away',
    department: 'Marketing & Documentation',
    lastLogin: '3 days ago',
  }
];

export const DEFAULT_SETTINGS: SiteSettings = {
  orgName: 'Bali Group Silos',
  logoUrl: '',
  hideBrandText: false,
  phone: '+91 88727 99999',
  email: 'info@baligroupsilos.com',
  address: '906, Industrial Area Phase-2, Chandigarh, India - 160002',
  timezone: 'Asia/Kolkata (IST, UTC+5:30)',
  linkedin: 'https://linkedin.com/company/bali-group-silos',
  youtube: 'https://youtube.com/@baligroupsilos',
  twitter: 'https://twitter.com/baligroupsilos',
  brochureUrl: '/downloads/Bali_Group_Industrial_Silos_Catalog_2026.pdf',
  metaTitle: 'Bali Group | Turnkey Grain Silos & Bulk Material Handling',
  metaDescription: 'Industrial grain storage silos, heavy-duty bucket elevators, and turnkey commercial milling EPC from Chandigarh, India. Serving 40+ countries.',
  notifyOnLead: true,
  dailyDigest: true,
  highCapacityAlerts: true
};
