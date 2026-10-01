import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Globe, ChevronDown, Menu, X, ArrowRight, ArrowUpRight, ShieldCheck, Factory, Settings, Layers } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAssets } from '../lib/contexts/AssetsContext';

const SOLUTIONS_MENU = [
  {
    title: 'Grain Storage Systems',
    desc: 'Commercial flat bottom & hopper silos up to 20,000 MT per unit.',
    path: '/products',
    icon: Factory
  },
  {
    title: 'Bulk Handling Lines',
    desc: 'Bucket elevators & conveyors engineered for continuous industrial throughput.',
    path: '/products',
    icon: Settings
  },
  {
    title: 'Milling & Distillery EPC',
    desc: 'Integrated cleaning, intake, tempering and automated transfer lines.',
    path: '/engineering',
    icon: Layers
  },
  {
    title: 'Turnkey Project Delivery',
    desc: 'Single-source responsibility from geotechnical site study to commissioning.',
    path: '/#turnkey',
    icon: ShieldCheck
  }
];

const PRODUCTS_MENU = [
  {
    title: 'SILOS & STORAGE',
    items: [
      { name: 'Flat Bottom Silos', desc: 'Commercial storage up to 20,000 MT' },
      { name: 'Hopper Bottom Silos', desc: '45° and 60° gravity discharge' },
      { name: 'Feed & Port Silos', desc: 'Rapid dispatch and high turnaround' },
      { name: 'Ethanol Plant Silos', desc: 'Heavy-duty grain reception buffers' }
    ]
  },
  {
    title: 'MATERIAL HANDLING',
    items: [
      { name: 'Bucket Elevators', desc: 'Vertical lifting up to 1000 TPH' },
      { name: 'Chain Conveyors', desc: 'Enclosed, dust-tight transfer' },
      { name: 'Belt Conveyors', desc: 'Gentle long-distance grain flow' },
      { name: 'Screw Conveyors', desc: 'Precision metering and intake' }
    ]
  },
  {
    title: 'CLEANING & PROCESSING',
    items: [
      { name: 'Rotary Drum Cleaners', desc: 'Pre-cleaning high foreign matter' },
      { name: 'Aspiration Channels', desc: 'Air separation of light impurities' },
      { name: 'Destoners & Scalpers', desc: 'Dense contaminant isolation' },
      { name: 'Milling Line Integration', desc: 'Flour & rice mill feed systems' }
    ]
  },
  {
    title: 'AUXILIARY SYSTEMS',
    items: [
      { name: 'Aeration Fans & Ducts', desc: 'High-static pressure conditioning' },
      { name: 'Sweep Augers', desc: 'Zero-entry complete bin cleanout' },
      { name: 'Temperature Monitoring', desc: 'Multi-point digital grain cables' },
      { name: 'Catwalks & Towers', desc: 'Heavy galvanized structural steel' }
    ]
  }
];

export function Header() {
  const { assets } = useAssets();
  const siteLogo = assets['site_logo']?.url;
  const hideBrandText = assets['site_logo_hide_text']?.url === 'true';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'solutions' | 'products' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setIsSearchOpen(false);
  }, [location]);

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          isScrolled 
            ? "bg-[#0B0B0B]/95 backdrop-blur-md border-b border-white/[0.08] py-4 shadow-2xl" 
            : (location.pathname === '/' ? "bg-gradient-to-b from-[#0B0B0B]/80 to-transparent py-5" : "bg-[#0B0B0B] border-b border-white/[0.08] py-4")
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group z-50">
            {siteLogo ? (
              <div className="flex items-center justify-center shrink-0">
                <img 
                  src={siteLogo} 
                  alt={assets['site_logo']?.alt || "Bali Group Logo"} 
                  className="h-9 max-h-9 w-auto max-w-[180px] object-contain object-left transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-9 h-9 bg-[#F4FF00] flex items-center justify-center font-black text-[#0B0B0B] text-base tracking-tighter transition-transform duration-300 group-hover:scale-105">
                BG
              </div>
            )}
            {!hideBrandText && (
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-white text-lg leading-tight group-hover:text-[#F4FF00] transition-colors">
                  BALI GROUP
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#A8AFB8] font-medium leading-none">
                  Industrial Engineering
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-7">
              
              {/* Solutions Mega Menu Trigger */}
              <div 
                className="relative py-2"
                onMouseEnter={() => setActiveMegaMenu('solutions')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link
                  to="/solutions"
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-semibold tracking-wide transition-colors",
                    activeMegaMenu === 'solutions' ? "text-[#F4FF00]" : "text-white hover:text-[#F4FF00]"
                  )}
                >
                  Solutions <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", activeMegaMenu === 'solutions' && "rotate-180 text-[#F4FF00]")} />
                </Link>

                <AnimatePresence>
                  {activeMegaMenu === 'solutions' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-3 w-[640px] bg-[#171717] border border-white/[0.1] shadow-2xl overflow-hidden p-6 z-50"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {SOLUTIONS_MENU.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <Link 
                              key={idx}
                              to={item.path}
                              className="p-4 bg-[#202124]/50 border border-white/[0.04] hover:border-[#F4FF00]/40 hover:bg-[#202124] transition-all group/item flex flex-col justify-between"
                            >
                              <div className="flex items-start gap-3 mb-2">
                                <div className="p-2 bg-[#0B0B0B] text-[#F4FF00] shrink-0">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <h4 className="text-white font-bold text-sm group-hover/item:text-[#F4FF00] transition-colors">
                                  {item.title}
                                </h4>
                              </div>
                              <p className="text-xs text-[#A8AFB8] leading-relaxed pl-9">
                                {item.desc}
                              </p>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
                        <span className="text-[#A8AFB8]">Single source engineering & turnkey execution</span>
                        <Link to="/quote" className="text-[#F4FF00] font-bold hover:underline flex items-center gap-1">
                          Request Consultation <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Products Mega Menu Trigger */}
              <div 
                className="relative py-2"
                onMouseEnter={() => setActiveMegaMenu('products')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link
                  to="/products"
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-semibold tracking-wide transition-colors",
                    activeMegaMenu === 'products' ? "text-[#F4FF00]" : "text-white hover:text-[#F4FF00]"
                  )}
                >
                  Products <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", activeMegaMenu === 'products' && "rotate-180 text-[#F4FF00]")} />
                </Link>
                
                <AnimatePresence>
                  {activeMegaMenu === 'products' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[920px] bg-[#171717] border border-white/[0.1] shadow-2xl overflow-hidden z-50"
                    >
                      <div className="grid grid-cols-4 p-8 gap-8 bg-[#171717]">
                        {PRODUCTS_MENU.map((col, idx) => (
                          <div key={idx} className="space-y-4">
                            <div className="border-b border-white/[0.08] pb-2">
                              <h4 className="text-[#F4FF00] font-bold text-xs tracking-widest uppercase">
                                {col.title}
                              </h4>
                            </div>
                            <ul className="space-y-3">
                              {col.items.map((item, i) => (
                                <li key={i}>
                                  <Link 
                                    to="/products" 
                                    className="group/prod block"
                                  >
                                    <div className="text-xs font-semibold text-white group-hover/prod:text-[#F4FF00] transition-colors flex items-center justify-between">
                                      <span>{item.name}</span>
                                      <ArrowRight className="w-3 h-3 opacity-0 group-hover/prod:opacity-100 group-hover/prod:translate-x-0.5 transition-all text-[#F4FF00]" />
                                    </div>
                                    <p className="text-[11px] text-[#A8AFB8] mt-0.5 line-clamp-1">
                                      {item.desc}
                                    </p>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="bg-[#202124] px-8 py-4 flex justify-between items-center border-t border-white/[0.08]">
                        <div className="text-xs text-[#A8AFB8] flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#F4FF00] inline-block" />
                          Heavy-duty industrial manufacturing certified to international standards
                        </div>
                        <Link 
                          to="/products" 
                          className="flex items-center gap-2 text-xs font-bold text-[#0B0B0B] bg-[#F4FF00] px-4 py-2 hover:bg-white transition-colors"
                        >
                          OPEN TECHNICAL CATALOGUE <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/industries" className="text-sm font-semibold tracking-wide text-white hover:text-[#F4FF00] transition-colors">
                Industries
              </Link>
              <Link to="/projects" className="text-sm font-semibold tracking-wide text-white hover:text-[#F4FF00] transition-colors">
                Projects
              </Link>
              <Link to="/engineering" className="text-sm font-semibold tracking-wide text-white hover:text-[#F4FF00] transition-colors">
                Engineering
              </Link>
              <Link to="/company" className="text-sm font-semibold tracking-wide text-white hover:text-[#F4FF00] transition-colors">
                Company
              </Link>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <button 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search catalogue"
              className="text-white/80 hover:text-[#F4FF00] p-2 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="text-white/80 hover:text-[#F4FF00] flex items-center gap-1.5 text-xs font-bold px-2 py-1 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#F4FF00]" />
                <span>{selectedLang}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-28 bg-[#171717] border border-white/[0.1] shadow-xl py-1 z-50">
                  {['EN', 'ES', 'AR', 'FR'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-xs transition-colors",
                        selectedLang === lang ? "text-[#0B0B0B] bg-[#F4FF00] font-bold" : "text-white/80 hover:bg-white/5"
                      )}
                    >
                      {lang === 'EN' ? 'English' : lang === 'ES' ? 'Español' : lang === 'AR' ? 'العربية' : 'Français'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/quote" 
              className="bg-[#F4FF00] text-[#0B0B0B] px-6 py-2.5 text-xs font-bold tracking-wider hover:bg-white transition-all duration-200 flex items-center gap-2 group shadow-lg shadow-[#F4FF00]/10"
            >
              GET A QUOTE
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden z-50 p-2 text-white hover:text-[#F4FF00] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-[#0B0B0B] z-40 lg:hidden overflow-y-auto pt-24 pb-12 px-6 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-5 text-xl font-bold text-white border-b border-white/[0.08] pb-8">
                <Link to="/solutions" className="hover:text-[#F4FF00] transition-colors flex items-center justify-between py-2 border-b border-white/[0.04]">
                  Solutions <ArrowRight className="w-4 h-4 text-[#A8AFB8]" />
                </Link>
                <Link to="/products" className="hover:text-[#F4FF00] transition-colors flex items-center justify-between py-2 border-b border-white/[0.04]">
                  Products Catalogue <ArrowRight className="w-4 h-4 text-[#A8AFB8]" />
                </Link>
                <Link to="/industries" className="hover:text-[#F4FF00] transition-colors flex items-center justify-between py-2 border-b border-white/[0.04]">
                  Industries Served <ArrowRight className="w-4 h-4 text-[#A8AFB8]" />
                </Link>
                <Link to="/projects" className="hover:text-[#F4FF00] transition-colors flex items-center justify-between py-2 border-b border-white/[0.04]">
                  Global Projects <ArrowRight className="w-4 h-4 text-[#A8AFB8]" />
                </Link>
                <Link to="/engineering" className="hover:text-[#F4FF00] transition-colors flex items-center justify-between py-2 border-b border-white/[0.04]">
                  Engineering Capabilities <ArrowRight className="w-4 h-4 text-[#A8AFB8]" />
                </Link>
                <Link to="/company" className="hover:text-[#F4FF00] transition-colors flex items-center justify-between py-2">
                  Company Overview <ArrowRight className="w-4 h-4 text-[#A8AFB8]" />
                </Link>
              </div>

              <div className="mt-8 space-y-4">
                <div className="text-xs text-[#A8AFB8] space-y-1">
                  <p className="text-white font-bold">Bali Group Engineering Office</p>
                  <p>906, Industrial Area Phase-2, Chandigarh, India</p>
                  <p className="text-[#F4FF00] font-mono">+91 88727 99999</p>
                </div>
                <Link 
                  to="/quote" 
                  className="bg-[#F4FF00] text-[#0B0B0B] p-4 text-center font-bold text-sm tracking-wider flex items-center justify-center gap-2 hover:bg-white transition-colors"
                >
                  START PROJECT ENQUIRY <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[#0B0B0B]/85 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#171717] border border-white/[0.15] w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
                <Search className="w-5 h-5 text-[#F4FF00] shrink-0" />
                <input 
                  type="text"
                  placeholder="Search silos, conveyors, milling lines, projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent border-none text-white text-base focus:outline-none w-full placeholder:text-[#A8AFB8]"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-[#A8AFB8] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto space-y-3">
                <div className="text-xs uppercase font-bold tracking-widest text-[#F4FF00] mb-2">
                  Suggested Equipment & Topics
                </div>
                {[
                  { title: 'Commercial Flat Bottom Silos', category: 'Storage', link: '/products' },
                  { title: 'Hopper Bottom Grain Silos', category: 'Storage', link: '/products' },
                  { title: 'Heavy-Duty Bucket Elevators', category: 'Material Handling', link: '/products' },
                  { title: 'Enclosed Chain Conveyors', category: 'Material Handling', link: '/products' },
                  { title: 'Rotary Drum Pre-Cleaners', category: 'Processing', link: '/products' },
                  { title: 'Turnkey EPC Engineering Process', category: 'Engineering', link: '/engineering' },
                  { title: 'Global Case Studies & Port Terminals', category: 'Projects', link: '/projects' }
                ].filter(item => !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((result, idx) => (
                  <Link 
                    key={idx}
                    to={result.link}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-3 bg-[#202124]/60 hover:bg-[#202124] border border-white/[0.04] hover:border-[#F4FF00]/40 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-semibold text-white block">{result.title}</span>
                      <span className="text-[11px] text-[#A8AFB8]">{result.category}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#F4FF00]" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  const { assets } = useAssets();
  const footerLogo = assets['site_logo_footer']?.url || assets['site_logo']?.url;
  const hideBrandText = assets['site_logo_hide_text']?.url === 'true';

  return (
    <footer className="bg-[#0B0B0B] text-white pt-24 pb-12 border-t border-white/[0.08] relative overflow-hidden">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 technical-grid pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
        
        {/* Top Pre-Footer Band */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/[0.08]">
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              {footerLogo ? (
                <div className="flex items-center justify-center shrink-0">
                  <img 
                    src={footerLogo} 
                    alt="Bali Group Logo" 
                    className="h-9 max-h-9 w-auto max-w-[180px] object-contain object-left"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 bg-[#F4FF00] flex items-center justify-center font-black text-[#0B0B0B] text-base">
                  BG
                </div>
              )}
              {!hideBrandText && (
                <span className="font-bold tracking-tight text-white text-xl">
                  BALI GROUP
                </span>
              )}
            </Link>
            <p className="text-[#A8AFB8] text-sm leading-relaxed max-w-md mb-8">
              Turnkey grain storage, handling, and processing infrastructure engineered for global commercial grain terminals, milling plants, and industrial agro-processing facilities.
            </p>
            <div className="space-y-1.5 text-xs text-[#A8AFB8]">
              <p className="text-white font-semibold">Headquarters & Manufacturing</p>
              <p>906, Industrial Area Phase-2, Chandigarh, India - 160002</p>
              <p className="pt-2 text-white font-mono text-sm tracking-wide">
                Direct Engineering Line: <span className="text-[#F4FF00]">+91 88727 99999</span>
              </p>
              <p className="text-white">Email: <span className="text-white/80">info@baligroupsilos.com</span></p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 bg-[#F4FF00]" />
                <h4 className="text-white font-bold text-xs tracking-widest uppercase">Products</h4>
              </div>
              <ul className="space-y-3 text-xs text-[#A8AFB8]">
                <li><Link to="/products" className="hover:text-white transition-colors">Flat Bottom Silos</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Hopper Silos</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Bucket Elevators</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Chain Conveyors</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Drum Cleaners</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Aeration Systems</Link></li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 bg-[#F4FF00]" />
                <h4 className="text-white font-bold text-xs tracking-widest uppercase">Industries</h4>
              </div>
              <ul className="space-y-3 text-xs text-[#A8AFB8]">
                <li><Link to="/industries" className="hover:text-white transition-colors">Commercial Grain Trading</Link></li>
                <li><Link to="/industries" className="hover:text-white transition-colors">Rice & Flour Mills</Link></li>
                <li><Link to="/industries" className="hover:text-white transition-colors">Feed & Animal Nutrition</Link></li>
                <li><Link to="/industries" className="hover:text-white transition-colors">Ethanol & Distilleries</Link></li>
                <li><Link to="/industries" className="hover:text-white transition-colors">Deepwater Port Terminals</Link></li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 bg-[#F4FF00]" />
                <h4 className="text-white font-bold text-xs tracking-widest uppercase">Engineering</h4>
              </div>
              <ul className="space-y-3 text-xs text-[#A8AFB8]">
                <li><Link to="/engineering" className="hover:text-white transition-colors">Structural Design</Link></li>
                <li><Link to="/engineering" className="hover:text-white transition-colors">Process Engineering</Link></li>
                <li><Link to="/engineering" className="hover:text-white transition-colors">SCADA Automation</Link></li>
                <li><Link to="/engineering" className="hover:text-white transition-colors">3D BIM Modeling</Link></li>
                <li><Link to="/engineering" className="hover:text-white transition-colors">Plant Commissioning</Link></li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 bg-[#F4FF00]" />
                <h4 className="text-white font-bold text-xs tracking-widest uppercase">Company</h4>
              </div>
              <ul className="space-y-3 text-xs text-[#A8AFB8]">
                <li><Link to="/company" className="hover:text-white transition-colors">About Bali Group</Link></li>
                <li><Link to="/projects" className="hover:text-white transition-colors">Global Portfolio</Link></li>
                <li><Link to="/quote" className="hover:text-white transition-colors">Project Consultation</Link></li>
                <li><Link to="/quote" className="hover:text-white transition-colors">Engineering Support</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A8AFB8]">
          <div className="flex flex-wrap items-center gap-6">
            <span>© {new Date().getFullYear()} Bali Group Silos & Heavy Industries. All rights reserved.</span>
            <span className="hidden md:inline text-white/20">|</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#A8AFB8] hover:text-[#F4FF00] transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#A8AFB8] hover:text-[#F4FF00] transition-colors"
            >
              YouTube
            </a>
            {/* Discreet admin link */}
            <Link 
              to="/admin" 
              className="text-white/25 hover:text-white/70 transition-colors text-[11px] ml-4 font-mono"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B]">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

