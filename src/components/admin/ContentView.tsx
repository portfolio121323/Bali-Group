import React, { useState } from 'react';
import { 
  FileText, 
  Edit3, 
  ExternalLink, 
  Check, 
  Save, 
  X, 
  Eye, 
  Image as ImageIcon,
  ArrowRight,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAdminToast } from './AdminToast';

interface PageContentItem {
  id: string;
  name: string;
  path: string;
  lastUpdated: string;
  status: 'Live' | 'Draft';
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  seo: {
    metaTitle: string;
    metaDesc: string;
  };
}

const DEFAULT_PAGES: PageContentItem[] = [
  {
    id: 'home',
    name: 'Home Page',
    path: '/',
    lastUpdated: 'Today',
    status: 'Live',
    hero: {
      badge: 'TURNKEY GRAIN SILOS & BULK EPC',
      title: 'Commercial Grain Storage & Turnkey Material Handling',
      subtitle: 'Engineering heavy-duty galvanized corrugated steel silos, continuous bucket elevators, and automated processing complexes across 40+ countries.',
      ctaPrimary: 'Configure Turnkey Silo Plant',
      ctaSecondary: 'Explore Products',
    },
    seo: {
      metaTitle: 'Bali Group | Turnkey Grain Silos & Bulk Material Handling',
      metaDesc: 'Commercial grain storage silos, heavy-duty bucket elevators, and turnkey commercial milling EPC from Chandigarh, India. Serving 40+ countries.',
    }
  },
  {
    id: 'solutions',
    name: 'Solutions & Turnkey EPC',
    path: '/solutions',
    lastUpdated: 'Yesterday',
    status: 'Live',
    hero: {
      badge: 'END-TO-END SILO COMPLEX DELIVERY',
      title: 'Full-Lifecycle EPC for Grain Storage Infrastructure',
      subtitle: 'From geotechnical survey and structural engineering to manufacturing, mechanical erection, SCADA electrical automation, and commissioning.',
      ctaPrimary: 'Request Engineering Consultation',
      ctaSecondary: 'View EPC Steps',
    },
    seo: {
      metaTitle: 'Turnkey Grain Silo EPC Solutions | Bali Group',
      metaDesc: 'Complete turnkey grain storage terminal engineering, procurement, and construction services.',
    }
  },
  {
    id: 'products',
    name: 'Products & Equipment',
    path: '/products',
    lastUpdated: '2 days ago',
    status: 'Live',
    hero: {
      badge: 'ENGINEERED HEAVY-DUTY EQUIPMENT',
      title: 'Industrial Grain Storage & Material Handling Systems',
      subtitle: 'Z600 hot-dip galvanized flat-bottom silos, 60° hopper silos, high-throughput bucket elevators, and drag chain conveyors built for 24/7 terminal duty.',
      ctaPrimary: 'Download Technical Catalog',
      ctaSecondary: 'Configure Silo Specs',
    },
    seo: {
      metaTitle: 'Industrial Grain Silos & Conveyors | Bali Group Products',
      metaDesc: 'Explore flat bottom commercial silos, hopper discharge silos, heavy duty elevators, and conveyors.',
    }
  },
  {
    id: 'industries',
    name: 'Industries & Sectors',
    path: '/industries',
    lastUpdated: '3 days ago',
    status: 'Live',
    hero: {
      badge: 'SECTOR-SPECIFIC SILO ENGINEERING',
      title: 'Industrial Storage Solutions for Every Bulk Commodity',
      subtitle: 'Engineered storage and handling solutions tailored to the unique flow characteristics, moisture requirements, and explosion risks of each agro-industrial sector.',
      ctaPrimary: 'Explore Industry Solutions',
      ctaSecondary: 'Download Sector Briefs',
    },
    seo: {
      metaTitle: 'Agro-Industrial Silo Solutions by Sector | Bali Group',
      metaDesc: 'Tailored silo complexes for deepwater ports, commercial rice mills, ethanol distilleries, and grain reserves.',
    }
  },
  {
    id: 'engineering',
    name: 'Engineering & Technology',
    path: '/engineering',
    lastUpdated: '4 days ago',
    status: 'Live',
    hero: {
      badge: 'PRECISION STRUCTURAL INTEGRITY',
      title: 'Engineered for 50-Year Operational Lifespans',
      subtitle: 'State-of-the-art roll forming, high-tensile hot-dip galvanizing, FEA structural stress modeling, and automated grain quality management systems.',
      ctaPrimary: 'Review Design Codes',
      ctaSecondary: 'SCADA Integration',
    },
    seo: {
      metaTitle: 'Engineering Standards & Automation | Bali Group',
      metaDesc: 'Eurocode EN 1993-4-1 compliant silo design, Z600 galvanizing, and digital temperature cable matrices.',
    }
  },
  {
    id: 'projects',
    name: 'Projects Portfolio',
    path: '/projects',
    lastUpdated: '1 week ago',
    status: 'Live',
    hero: {
      badge: 'GLOBAL EPC TRACK RECORD',
      title: 'Delivering Turnkey Silo Complexes Worldwide',
      subtitle: 'Explore our portfolio of commercial grain storage terminals, rice milling complexes, and port facilities across 40+ countries.',
      ctaPrimary: 'Download Project Dossier',
      ctaSecondary: 'Filter by Industry',
    },
    seo: {
      metaTitle: 'Turnkey Grain Silo Projects | Bali Group Portfolio',
      metaDesc: 'Review completed commercial port grain terminals and milling storage facilities worldwide.',
    }
  },
  {
    id: 'company',
    name: 'Company & Heritage',
    path: '/company',
    lastUpdated: '1 week ago',
    status: 'Live',
    hero: {
      badge: '50+ YEARS OF INDUSTRIAL EXCELLENCE',
      title: 'Engineering India’s Premier Grain Storage Infrastructure',
      subtitle: 'From humble beginnings in Chandigarh to manufacturing heavy-duty grain handling complexes that preserve food security across 40+ nations worldwide.',
      ctaPrimary: 'Explore Heritage',
      ctaSecondary: 'Manufacturing Capabilities',
    },
    seo: {
      metaTitle: 'About Bali Group | 50+ Years Agro-Industrial Manufacturing',
      metaDesc: 'Learn about Bali Group heritage, manufacturing plants in Chandigarh, and global grain storage leadership.',
    }
  },
  {
    id: 'contact',
    name: 'Contact & RFQ Desk',
    path: '/contact',
    lastUpdated: '2 weeks ago',
    status: 'Live',
    hero: {
      badge: 'DIRECT ENGINEERING CONSULTATION',
      title: 'Get in Touch with our Technical EPC Desk',
      subtitle: 'Speak directly with our senior structural and mechanical engineers for plant sizing, budgetary estimates, and feasibility assessments.',
      ctaPrimary: 'Submit RFP',
      ctaSecondary: 'Call Technical Desk',
    },
    seo: {
      metaTitle: 'Contact Bali Group Silos | Engineering Office Chandigarh',
      metaDesc: 'Connect with Bali Group engineers for turnkey silo quotations, technical inquiries, and project tenders.',
    }
  },
  {
    id: 'footer',
    name: 'Global Footer & Contact Info',
    path: '/',
    lastUpdated: '1 month ago',
    status: 'Live',
    hero: {
      badge: 'BALI GROUP CORPORATE',
      title: 'Global Manufacturing & Export Office',
      subtitle: '906, Industrial Area Phase-2, Chandigarh, India - 160002. +91 88727 99999',
      ctaPrimary: 'Download Brochure',
      ctaSecondary: 'Privacy Policy',
    },
    seo: {
      metaTitle: 'Bali Group Silos Corporate Contacts',
      metaDesc: 'Head office, plant locations, and export department contacts.',
    }
  }
];

export const ContentView: React.FC = () => {
  const { toast } = useAdminToast();
  const [pages, setPages] = useState<PageContentItem[]>(() => {
    const saved = localStorage.getItem('bali_admin_site_content');
    return saved ? JSON.parse(saved) : DEFAULT_PAGES;
  });

  const [selectedPage, setSelectedPage] = useState<PageContentItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePage = (updated: PageContentItem) => {
    setIsSaving(true);
    setTimeout(() => {
      const nextPages = pages.map(p => p.id === updated.id ? { ...updated, lastUpdated: 'Just now' } : p);
      setPages(nextPages);
      localStorage.setItem('bali_admin_site_content', JSON.stringify(nextPages));
      setSelectedPage(null);
      setIsSaving(false);
      toast({
        title: 'Content Published',
        message: `${updated.name} updated across website.`,
        type: 'success',
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#111111] dark:text-white tracking-tight">
            Content
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-gray-400 mt-1">
            Manage headlines, hero call-to-actions, engineering copy, and SEO meta tags across all website routes.
          </p>
        </div>
      </div>

      {/* Featured Process Flow Section Customizer Banner */}
      <div className="bg-gradient-to-r from-[#17191C] via-[#202328] to-[#17191C] border-2 border-[#EFFF00]/50 rounded-[12px] p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#EFFF00] text-[#0B0D0E] font-bold text-[10px] font-mono uppercase tracking-wider">
              HOMEPAGE FEATURED SECTION
            </span>
            <span className="text-[#8A9097] text-xs font-mono">
              From Grain In To Grain Out
            </span>
          </div>
          <h2 className="text-lg font-black text-white uppercase tracking-tight">
            Engineered Process Flow (Grain Journey)
          </h2>
          <p className="text-xs text-[#B9BDC1] max-w-2xl leading-relaxed">
            Customize the section eyebrow, headlines, 7 commercial engineering stages, integrated machinery items, capacity metrics, and stage photos.
          </p>
        </div>

        <Link
          to="/admin/process-flow"
          className="bg-[#EFFF00] hover:bg-white text-[#0B0D0E] font-bold text-xs px-5 py-3 rounded-[8px] flex items-center justify-center gap-2 transition-all shrink-0 uppercase tracking-wider shadow-sm"
        >
          <span>Customize Process Flow</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pages.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-[#17191C] rounded-[10px] border border-[#E7E7E5] dark:border-[#26292D] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-[#6B7280] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{p.path}</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#1B1F22] text-[#EFFF00] border border-[#EFFF00]/30">
                  {p.status}
                </span>
              </div>

              <h2 className="text-base font-bold text-[#0B0B0B] dark:text-white uppercase tracking-tight mb-2">
                {p.name}
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                "{p.hero.title}"
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px] font-mono">
                Updated {p.lastUpdated}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  to={p.path}
                  target="_blank"
                  className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white"
                  title="View Live Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setSelectedPage(p)}
                  className="bg-[#0B0B0B] text-white hover:bg-neutral-800 dark:bg-[#F4FF00] dark:text-[#0B0B0B] px-3 py-1.5 rounded font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Content</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Page Edit Modal */}
      {selectedPage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#17191C] border border-gray-200 dark:border-[#2C2F34] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-xs text-[#0B0B0B] dark:text-white">
            
            <div className="p-5 border-b border-gray-200 dark:border-[#2C2F34] flex items-center justify-between bg-gray-50 dark:bg-[#141618]">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">
                  Editing CMS: {selectedPage.name}
                </h2>
                <p className="text-gray-500 text-xs">Modify hero banner, engineering copy, and search meta tags</p>
              </div>
              <button onClick={() => setSelectedPage(null)} className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              
              {/* Hero Section */}
              <div className="space-y-3">
                <h3 className="font-bold uppercase tracking-wider text-[11px] text-gray-400">Hero Section</h3>

                <div>
                  <label className="font-bold block mb-1">Badge / Tagline</label>
                  <input
                    type="text"
                    value={selectedPage.hero.badge}
                    onChange={(e) => setSelectedPage({
                      ...selectedPage,
                      hero: { ...selectedPage.hero, badge: e.target.value }
                    })}
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Main Headline</label>
                  <input
                    type="text"
                    value={selectedPage.hero.title}
                    onChange={(e) => setSelectedPage({
                      ...selectedPage,
                      hero: { ...selectedPage.hero, title: e.target.value }
                    })}
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Supporting Engineering Paragraph</label>
                  <textarea
                    rows={3}
                    value={selectedPage.hero.subtitle}
                    onChange={(e) => setSelectedPage({
                      ...selectedPage,
                      hero: { ...selectedPage.hero, subtitle: e.target.value }
                    })}
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Primary Button Label</label>
                    <input
                      type="text"
                      value={selectedPage.hero.ctaPrimary}
                      onChange={(e) => setSelectedPage({
                        ...selectedPage,
                        hero: { ...selectedPage.hero, ctaPrimary: e.target.value }
                      })}
                      className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Secondary Button Label</label>
                    <input
                      type="text"
                      value={selectedPage.hero.ctaSecondary}
                      onChange={(e) => setSelectedPage({
                        ...selectedPage,
                        hero: { ...selectedPage.hero, ctaSecondary: e.target.value }
                      })}
                      className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Meta */}
              <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-white/10">
                <h3 className="font-bold uppercase tracking-wider text-[11px] text-gray-400">Search Engine Optimization (SEO)</h3>

                <div>
                  <label className="font-bold block mb-1">Page Meta Title</label>
                  <input
                    type="text"
                    value={selectedPage.seo.metaTitle}
                    onChange={(e) => setSelectedPage({
                      ...selectedPage,
                      seo: { ...selectedPage.seo, metaTitle: e.target.value }
                    })}
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={selectedPage.seo.metaDesc}
                    onChange={(e) => setSelectedPage({
                      ...selectedPage,
                      seo: { ...selectedPage.seo, metaDesc: e.target.value }
                    })}
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                  />
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-gray-200 dark:border-[#2C2F34] bg-gray-50 dark:bg-[#141618] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedPage(null)}
                className="px-4 py-2 border border-gray-300 dark:border-white/10 rounded font-semibold text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSavePage(selectedPage)}
                className="bg-[#0B0B0B] text-white hover:bg-neutral-800 dark:bg-[#F4FF00] dark:text-[#0B0B0B] px-6 py-2.5 rounded font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Publishing...' : 'Save & Publish Page'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
