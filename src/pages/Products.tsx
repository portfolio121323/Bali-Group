import { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight, ArrowUpRight, Check, X, Shield, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DynamicMedia } from '@/components/DynamicMedia';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CATEGORIES = ['All', 'Silos', 'Material Handling', 'Cleaning & Processing', 'Accessories'];

interface ProductItem {
  id: number;
  category: string;
  title: string;
  assetKey: string;
  fallback: string;
  desc: string;
  specs: { label: string; value: string }[];
  features: string[];
}

const PRODUCTS: ProductItem[] = [
  {
    id: 1,
    category: 'Silos',
    title: 'Flat Bottom Commercial Silos',
    assetKey: 'product_flat_bottom',
    fallback: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop',
    desc: 'Heavy-duty commercial storage engineered for long-term grain preservation. Built with high-tensile Z600 galvanized corrugated steel sheets and exterior structural column stiffeners.',
    specs: [
      { label: 'Capacity Range', value: '1,000 to 20,000 MT per bin' },
      { label: 'Zinc Coating', value: 'Z600 (450 g/m²) Hot-Dip Galvanized' },
      { label: 'Roof Slope', value: '30° High-Load Structural Cone' },
      { label: 'Standards', value: 'Eurocode EN 1993-4-1 / ANSI / ASAE' }
    ],
    features: ['High-static aeration manifold', 'Multi-point digital temp sensor cables', 'Zero-entry motorized sweep auger integration']
  },
  {
    id: 2,
    category: 'Silos',
    title: 'Hopper Bottom Silos (45° / 60°)',
    assetKey: 'product_hopper',
    fallback: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=1200&auto=format&fit=crop',
    desc: 'Self-emptying gravity discharge silos designed for rapid turnaround operations, wet grain holding before driers, and flour/feed mill batch feeding.',
    specs: [
      { label: 'Capacity Range', value: '50 to 2,500 MT' },
      { label: 'Cone Angle', value: '45° for cereals, 60° for damp/sticky grain' },
      { label: 'Support Structure', value: 'Heavy galvanized H-beam structural legs' },
      { label: 'Discharge Gate', value: 'Rack & pinion manual or pneumatic slide' }
    ],
    features: ['Rapid complete gravity discharge', 'Eliminates sweep auger requirements', 'Ring beam seismic wind bracing']
  },
  {
    id: 3,
    category: 'Material Handling',
    title: 'Heavy-Duty Bucket Elevators',
    assetKey: 'product_elevator',
    fallback: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=1200&auto=format&fit=crop',
    desc: 'Continuous vertical lifting built for 24/7 demanding terminal intake. Engineered to prevent kernel scuffing while maintaining rated throughput under maximum head pressures.',
    specs: [
      { label: 'Throughput', value: 'Up to 1,000 TPH (tonnes per hour)' },
      { label: 'Casing', value: 'Self-supporting double-leg galvanized steel' },
      { label: 'Safety', value: 'Explosion relief panels, speed sensor, backstop' },
      { label: 'Belt/Chain', value: 'Oil-resistant antistatic rubber or forged chain' }
    ],
    features: ['Replaceable Hardox wear liners on hood', 'Crown-faced rubber lagged drive pulley', 'Automated gravity screw take-up boot']
  },
  {
    id: 4,
    category: 'Material Handling',
    title: 'Enclosed Drag Chain Conveyors',
    assetKey: 'product_chain',
    fallback: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    desc: 'Dust-tight horizontal and inclined transit for raw grains, meal, and pellets. Engineered with UHMWPE flight wear-strips for quiet, low-friction conveying.',
    specs: [
      { label: 'Capacity', value: '50 to 800 TPH' },
      { label: 'Incline Angle', value: 'Horizontal up to 45° bends' },
      { label: 'Trough Bottom', value: 'Hardox replaceable bottom and side liners' },
      { label: 'Drive', value: 'Shaft-mounted helical bevel gearmotor' }
    ],
    features: ['Self-cleaning rounded bottom tails', 'Slack chain safety limit sensor', 'Intermediate automated slide discharge gates']
  },
  {
    id: 5,
    category: 'Cleaning & Processing',
    title: 'Rotary Drum Pre-Cleaners & Scalpers',
    assetKey: 'product_drum',
    fallback: 'https://images.unsplash.com/photo-1563223552-30d01adceac3?q=80&w=1200&auto=format&fit=crop',
    desc: 'High-throughput pre-cleaning separating oversized straw, cob pieces, twine, and stones from intake grain prior to elevator lift or bin storage.',
    specs: [
      { label: 'Screening Rate', value: '50 to 300 TPH intake' },
      { label: 'Drum Cylinders', value: 'Dual concentric rotating mesh screens' },
      { label: 'Aspiration', value: 'Integrated light dust suction channel' },
      { label: 'Maintenance', value: 'Quick-change bolt-on screen panels' }
    ],
    features: ['Zero grain loss during scalping', 'Counter-rotating self-cleaning brushes', 'Aspiration channel with air velocity damper']
  },
  {
    id: 6,
    category: 'Accessories',
    title: 'High-Static Pressure Aeration Fans',
    assetKey: 'product_fan',
    fallback: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop',
    desc: 'Centrifugal and axial high-static pressure fans specifically calibrated to penetrate deep grain columns and prevent hot spots or condensation.',
    specs: [
      { label: 'Static Pressure', value: 'Up to 3,500 Pa' },
      { label: 'Airflow Rate', value: '2,000 to 45,000 m³/h' },
      { label: 'Motor Protection', value: 'IP55 / IP65 Class F insulation' },
      { label: 'Housing', value: 'Hot-dip galvanized heavy spun casing' }
    ],
    features: ['Dynamically balanced backward-curved impellers', 'Integrated silencers & transition adapters', 'PLC automated start-stop moisture controls']
  }
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [productsList, setProductsList] = useState<ProductItem[]>(PRODUCTS);

  useEffect(() => {
    if (!db) return;
    try {
      const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const liveProducts: ProductItem[] = snapshot.docs
            .map((d, i) => {
              const data = d.data();
              return {
                id: (i + 1) as any,
                category: data.category || 'Silos',
                title: data.title || '',
                assetKey: data.assetKey || '',
                fallback: data.imageUrl || 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop',
                desc: data.desc || '',
                specs: data.specs || [],
                features: data.features || [],
                published: data.published !== false
              };
            })
            .filter(p => (p as any).published);
          if (liveProducts.length > 0) {
            setProductsList(liveProducts);
          }
        }
      }, (err) => {
        console.warn('[Products] Products sync warning:', err.message || err);
      });
      return () => {
        try {
          unsubscribe();
        } catch (_) {}
      };
    } catch (e) {
      console.warn('[Products] Failed to attach products listener:', e);
    }
  }, []);

  const filteredProducts = productsList.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-[#F6F6F4] min-h-screen pt-36 pb-24">
        
        {/* Header Section */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-10 bg-[#0B0B0B]" />
                <span className="text-[#0B0B0B] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                  TECHNICAL SPECIFICATION DIRECTORY
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0B0B0B] uppercase tracking-tight leading-[1.02]">
                ENGINEERED <br />
                <span className="text-[#A8AFB8]">EQUIPMENT.</span>
              </h1>
              <p className="text-[#303236] text-sm md:text-base max-w-xl mt-4 leading-relaxed font-normal">
                Explore our precision-engineered grain storage, bulk handling, pre-cleaning, and auxiliary systems. Every unit is manufactured to international industrial standards.
              </p>
            </div>
            
            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8AFB8]" />
                <input 
                  type="text"
                  placeholder="Search products & specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#E9EAEC] pl-11 pr-4 py-3.5 focus:border-[#0B0B0B] focus:outline-none transition-colors text-sm font-medium text-[#0B0B0B] shadow-sm rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex flex-wrap gap-2 border-b border-[#E9EAEC] pb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-none",
                  activeCategory === cat 
                    ? "bg-[#0B0B0B] text-[#F4FF00] shadow-md" 
                    : "bg-white text-[#303236] hover:text-[#0B0B0B] border border-[#E9EAEC] hover:border-[#0B0B0B]/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                  className="bg-white border border-[#E9EAEC] hover:border-[#0B0B0B] flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl group"
                >
                  <div>
                    {/* Media Header */}
                    <div className="relative h-64 overflow-hidden bg-[#171717]">
                      <DynamicMedia 
                        assetKey={product.assetKey}
                        fallbackUrl={product.fallback}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.95]"
                      />
                      <div className="absolute top-4 left-4 bg-[#0B0B0B] text-white font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-white/10">
                        {product.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-[#0B0B0B] mb-3 tracking-tight group-hover:text-[#0B0B0B] transition-colors">
                        {product.title}
                      </h3>

                      <p className="text-[#303236] text-sm leading-relaxed mb-6 font-normal">
                        {product.desc}
                      </p>

                      {/* Specs Matrix Preview */}
                      <div className="bg-[#F6F6F4] p-3.5 sm:p-4 border border-[#E9EAEC] mb-6 space-y-2 text-xs font-mono">
                        {product.specs.slice(0, 2).map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center gap-3 py-0.5 border-b border-[#E9EAEC]/60 last:border-b-0 pb-1.5 last:pb-0">
                            <span className="text-[#555A64] font-medium tracking-tight">{s.label}:</span>
                            <span className="font-bold text-[#0B0B0B] text-right">{s.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Key Features */}
                      <div className="space-y-2">
                        {product.features.map((f, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-[#303236]">
                            <Check className="w-3.5 h-3.5 text-[#0B0B0B] shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-8 pb-8 pt-4 border-t border-[#E9EAEC] flex items-center justify-between gap-4">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-xs font-bold tracking-wider uppercase text-[#0B0B0B] hover:text-[#0B0B0B] flex items-center gap-2 group/btn cursor-pointer"
                    >
                      <span>VIEW FULL SPEC SHEET</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    <Link 
                      to={`/quote?product=${encodeURIComponent(product.title)}`}
                      className="bg-[#F4FF00] hover:bg-[#0B0B0B] text-[#0B0B0B] hover:text-white px-3.5 py-2 text-xs font-bold tracking-wider uppercase transition-colors"
                    >
                      ENQUIRE
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Product Technical Spec Sheet Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0B]/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-[#0B0B0B] w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-6 bg-[#0B0B0B] text-white flex items-center justify-between">
                  <div>
                    <span className="text-[#F4FF00] font-mono text-xs font-bold tracking-widest uppercase block mb-1">
                      TECHNICAL SPECIFICATION DOSSIER
                    </span>
                    <h2 className="text-2xl font-bold uppercase tracking-tight">{selectedProduct.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto space-y-6 flex-grow">
                  <p className="text-[#303236] text-sm leading-relaxed">
                    {selectedProduct.desc}
                  </p>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#0B0B0B] mb-3 font-mono flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#F4FF00]" /> Engineering Specifications:
                    </h4>
                    <div className="bg-[#F6F6F4] border border-[#E9EAEC] divide-y divide-[#E9EAEC]">
                      {selectedProduct.specs.map((s, idx) => (
                        <div key={idx} className="p-3.5 flex justify-between items-center text-xs font-mono">
                          <span className="text-[#555A64] uppercase font-medium">{s.label}</span>
                          <span className="font-bold text-[#0B0B0B] text-right">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#0B0B0B] mb-3 font-mono flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#F4FF00]" /> Standard Industrial Features:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProduct.features.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-[#303236] bg-[#F6F6F4] p-3 border border-[#E9EAEC]">
                          <Check className="w-4 h-4 text-[#0B0B0B] shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-[#F6F6F4] border-t border-[#E9EAEC] flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-[#A8AFB8]">
                    MANUFACTURED IN CHANDIGARH, INDIA
                  </span>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setSelectedProduct(null)}
                      className="px-6 py-2.5 border border-[#0B0B0B] text-xs font-bold uppercase tracking-wider text-[#0B0B0B] hover:bg-white transition-colors"
                    >
                      Close
                    </button>
                    <Link 
                      to={`/quote?product=${encodeURIComponent(selectedProduct.title)}`}
                      className="bg-[#F4FF00] hover:bg-[#0B0B0B] text-[#0B0B0B] hover:text-white px-6 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors"
                    >
                      Request Detailed Quote
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}
