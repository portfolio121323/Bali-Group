import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  ShoppingBag, 
  FolderGit2, 
  Inbox, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  Plus, 
  X,
  ArrowRight
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickAction: (action: string) => void;
  leads?: any[];
  products?: any[];
  projects?: any[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onQuickAction,
  leads = [],
  products = [],
  projects = [],
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered by parent or outside
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navItems = [
    { label: 'Go to Dashboard', icon: LayoutDashboard, path: '/admin', group: 'Navigation' },
    { label: 'Go to Products Catalog', icon: ShoppingBag, path: '/admin/products', group: 'Navigation' },
    { label: 'Go to Projects Portfolio', icon: FolderGit2, path: '/admin/projects', group: 'Navigation' },
    { label: 'Go to Leads & RFPs', icon: Inbox, path: '/admin/leads', group: 'Navigation' },
    { label: 'Go to Process Flow (From Grain In to Grain Out)', icon: FileText, path: '/admin/process-flow', group: 'Navigation' },
    { label: 'Go to Website Content CMS', icon: FileText, path: '/admin/content', group: 'Navigation' },
    { label: 'Go to Media & Assets Library', icon: ImageIcon, path: '/admin/media', group: 'Navigation' },
    { label: 'Go to Team & Permissions', icon: Users, path: '/admin/team', group: 'Navigation' },
    { label: 'Go to Enterprise Settings', icon: Settings, path: '/admin/settings', group: 'Navigation' },
  ];

  const quickActions = [
    { label: 'Add New Product', icon: Plus, action: 'add-product', group: 'Quick Actions' },
    { label: 'Add New Project', icon: Plus, action: 'add-project', group: 'Quick Actions' },
    { label: 'Upload Media Asset', icon: Plus, action: 'upload-media', group: 'Quick Actions' },
    { label: 'Export Leads CSV', icon: Inbox, action: 'export-leads', group: 'Quick Actions' },
  ];

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        actions: quickActions,
        nav: navItems,
        results: [],
      };
    }

    const matchedNav = navItems.filter((item) => item.label.toLowerCase().includes(q));
    const matchedActions = quickActions.filter((item) => item.label.toLowerCase().includes(q));

    const matchedLeads = leads
      .filter((l) => 
        (l.reference && l.reference.toLowerCase().includes(q)) ||
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        (l.industry && l.industry.toLowerCase().includes(q))
      )
      .slice(0, 3)
      .map((l) => ({
        label: `${l.reference || 'Lead'} — ${l.name || l.company || 'Enquiry'} (${l.capacity || 'General'} MT)`,
        icon: Inbox,
        path: '/admin/leads',
        group: 'Matching Leads',
      }));

    const matchedProducts = products
      .filter((p) => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      )
      .slice(0, 3)
      .map((p) => ({
        label: `${p.title} (${p.category})`,
        icon: ShoppingBag,
        path: '/admin/products',
        group: 'Matching Products',
      }));

    const matchedProjects = projects
      .filter((p) => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q))
      )
      .slice(0, 3)
      .map((p) => ({
        label: `${p.title} (${p.location})`,
        icon: FolderGit2,
        path: '/admin/projects',
        group: 'Matching Projects',
      }));

    return {
      actions: matchedActions,
      nav: matchedNav,
      results: [...matchedProducts, ...matchedProjects, ...matchedLeads],
    };
  }, [query, leads, products, projects]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="bg-[#141719] border border-[#2B3034] rounded-[14px] shadow-2xl max-w-2xl w-full overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#2B3034] bg-[#101214]">
          <Search className="w-5 h-5 text-[#8A9097]" />
          <input
            type="text"
            placeholder="Search products, projects, leads, or type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-[#8A9097] font-sans"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-[#1B1F22] rounded text-[#8A9097] border border-[#2B3034]">
            ESC
          </kbd>
          <button onClick={onClose} className="text-[#8A9097] hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
          {filteredItems.results.length > 0 && (
            <div>
              <p className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#EFFF00] px-3 py-1">
                Direct Records
              </p>
              {filteredItems.results.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs hover:bg-[#1B1F22] text-[#B9BDC1] hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#8A9097]" />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8A9097]" />
                  </button>
                );
              })}
            </div>
          )}

          {filteredItems.actions.length > 0 && (
            <div>
              <p className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#8A9097] px-3 py-1">
                Quick Actions
              </p>
              {filteredItems.actions.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onQuickAction(act.action);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs hover:bg-[#EFFF00] hover:text-[#0B0D0E] text-[#B9BDC1] group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#EFFF00] group-hover:text-[#0B0D0E]" />
                      <span className="font-semibold">{act.label}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-60">ACTION</span>
                  </button>
                );
              })}
            </div>
          )}

          {filteredItems.nav.length > 0 && (
            <div>
              <p className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#8A9097] px-3 py-1">
                Admin Modules
              </p>
              {filteredItems.nav.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs hover:bg-[#1B1F22] text-[#B9BDC1] hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#8A9097]" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8A9097]">{item.path}</span>
                  </button>
                );
              })}
            </div>
          )}

          {filteredItems.results.length === 0 && filteredItems.actions.length === 0 && filteredItems.nav.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-xs">
              No matching modules or records found for "{query}".
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-[#121416] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span>Navigate with arrows or click</span>
          <span className="text-gray-400">BALI GROUP CONSOLE v2.6</span>
        </div>
      </div>
    </div>
  );
};
