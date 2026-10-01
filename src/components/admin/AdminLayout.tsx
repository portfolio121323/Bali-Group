import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderGit2, 
  Inbox, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Plus, 
  ChevronDown, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Moon,
  ExternalLink,
  Shield,
  CheckCircle2,
  Clock,
  Workflow
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { CommandPalette } from './CommandPalette';
import { useAdminToast } from './AdminToast';
import { useAssets } from '@/lib/contexts/AssetsContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  leads?: any[];
  products?: any[];
  projects?: any[];
  onQuickAction?: (action: string) => void;
}

const SIDEBAR_GROUPS = [
  {
    title: 'WEBSITE',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
      { icon: FolderGit2, label: 'Projects', path: '/admin/projects' },
      { icon: Workflow, label: 'Process Flow (Grain In/Out)', path: '/admin/process-flow' },
      { icon: FileText, label: 'Content', path: '/admin/content' },
      { icon: ImageIcon, label: 'Media & Assets', path: '/admin/media' },
    ]
  },
  {
    title: 'SALES',
    items: [
      { icon: Inbox, label: 'Leads & Quotes', path: '/admin/leads' },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { icon: Users, label: 'Team', path: '/admin/team' },
      { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ]
  }
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  leads = [],
  products = [],
  projects = [],
  onQuickAction = (_action: string) => {}
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useAdminToast();
  const { assets } = useAssets();
  const siteLogo = assets['site_logo']?.url;

  // Sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('bali_admin_sidebar_collapsed') === 'true';
  });

  // Mobile drawer open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Command palette state
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Dropdown states
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Dark Mode state (default light)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('bali_admin_dark_mode') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('bali_admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('bali_admin_dark_mode', String(next));
      toast({
        title: next ? 'Dark Mode Activated' : 'Light Mode Activated',
        message: 'Admin theme preferences updated.',
        type: 'info'
      });
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Signed Out', message: 'You have been logged out securely.', type: 'info' });
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setCreateMenuOpen(false);
        setNotificationsOpen(false);
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Notifications calculation based on actual leads
  const unreadLeadsCount = leads.filter(l => !l.status || l.status === 'New').length;

  return (
    <div className="min-h-screen flex font-sans bg-[#F5F5F3] text-[#111111] transition-colors duration-200">
      
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity" 
        />
      )}

      {/* Desktop & Mobile Sidebar */}
      <aside className={cn(
        "bg-[#0B0D0E] text-white flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-200 border-r border-[#1F2327] select-none",
        isCollapsed ? "w-[72px]" : "w-[248px]",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        
        {/* Brand Header */}
        <div className="h-[68px] flex items-center px-4 border-b border-[#1F2327] justify-between">
          <Link to="/" className="flex items-center gap-3 overflow-hidden group">
            {siteLogo ? (
              <img 
                src={siteLogo} 
                alt="Logo" 
                className="w-8 h-8 rounded-md object-contain shrink-0" 
              />
            ) : (
              <div className="w-8 h-8 bg-[#EFFF00] text-[#0B0D0E] font-black rounded-md flex shrink-0 items-center justify-center text-xs tracking-tight shadow-sm">
                BG
              </div>
            )}
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-[#EFFF00] transition-colors leading-none truncate">
                  Bali Group
                </span>
                <span className="text-[10px] text-[#8A9097] mt-1 leading-none tracking-wide uppercase font-mono">
                  Enterprise Admin
                </span>
              </div>
            )}
          </Link>

          {/* Collapse button on desktop */}
          <button 
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 text-[#8A9097] hover:text-white rounded hover:bg-[#1B1F22] transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Close button on mobile */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-[#8A9097] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
          {SIDEBAR_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-semibold tracking-wider text-[#6B7280] uppercase mb-2">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-xs transition-all relative group font-medium",
                      isActive 
                        ? "bg-[#1B1F22] text-white font-semibold border-l-[3px] border-[#EFFF00] shadow-xs" 
                        : "text-[#B9BDC1] hover:text-white hover:bg-[#1B1F22]/70"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-[#EFFF00]" : "text-[#8A9097] group-hover:text-white")} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                    
                    {/* Badge for Leads if any new */}
                    {item.label === 'Leads & Quotes' && unreadLeadsCount > 0 && (
                      <span className={cn(
                        "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                        isActive ? "bg-[#EFFF00] text-[#0B0D0E]" : "bg-[#EFFF00] text-[#0B0D0E]"
                      )}>
                        {unreadLeadsCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#1F2327] space-y-1.5 bg-[#0B0D0E]">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            title={isCollapsed ? "View Live Site" : undefined}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#B9BDC1] hover:text-white rounded-[8px] hover:bg-[#1B1F22] transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-[#8A9097]" />
            {!isCollapsed && <span className="truncate">View Public Site</span>}
          </Link>

          <button 
            onClick={handleLogout}
            title={isCollapsed ? "Sign Out" : undefined}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#9E4545] hover:text-[#C55A5A] hover:bg-[#1B1F22] rounded-[8px] transition-colors text-left font-medium"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-200",
        isCollapsed ? "lg:ml-[72px]" : "lg:ml-[248px]"
      )}>
        
        {/* Top Header Bar */}
        <header className="h-[68px] bg-white border-b border-[#E5E5E0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          
          {/* Left: Mobile Menu Toggle + Global Search */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 lg:hidden text-gray-600 hover:text-black rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar (opens Cmd+K or searches) */}
            <button 
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-2.5 w-full sm:max-w-md px-3.5 py-2 rounded-[10px] border border-[#E5E5E0] bg-[#F5F5F3] text-xs text-left transition-all hover:border-[#D1D5DB] hover:bg-white group"
            >
              <Search className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#111111] shrink-0" />
              <span className="flex-1 truncate text-[#6B7280] font-normal">Search products, projects, leads, content...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] rounded border border-[#E5E5E0] bg-white text-[#6B7280] font-mono shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Quick Create + Notifications + Theme + Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 ml-4">
            
            {/* Quick Create Dropdown - Primary Black button with yellow detail */}
            <div className="relative" data-dropdown>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCreateMenuOpen(!createMenuOpen);
                  setNotificationsOpen(false);
                  setProfileMenuOpen(false);
                }}
                className="bg-[#0B0D0E] text-white hover:bg-[#1B1F22] font-semibold px-3.5 py-2 rounded-[10px] text-xs flex items-center gap-2 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#EFFF00]" />
                <span className="hidden sm:inline">Add New</span>
                <ChevronDown className="w-3 h-3 text-[#8A9097] ml-0.5" />
              </button>

              {createMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-[12px] shadow-xl border border-[#2B3034] bg-[#141719] py-1.5 z-50 text-xs text-white">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-[#8A9097] uppercase border-b border-white/[0.08] mb-1 tracking-wider">
                    Quick Create
                  </div>
                  <button
                    onClick={() => {
                      onQuickAction('add-product');
                      setCreateMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[#1B1F22] hover:text-[#EFFF00] text-[#B9BDC1] transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>New Product</span>
                  </button>
                  <button
                    onClick={() => {
                      onQuickAction('add-project');
                      setCreateMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[#1B1F22] hover:text-[#EFFF00] text-[#B9BDC1] transition-colors"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>New Project</span>
                  </button>
                  <button
                    onClick={() => {
                      onQuickAction('upload-media');
                      setCreateMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[#1B1F22] hover:text-[#EFFF00] text-[#B9BDC1] transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload Media</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/content');
                      setCreateMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[#1B1F22] hover:text-[#EFFF00] text-[#B9BDC1] transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Page Content</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-[8px] text-[#5A6066] hover:text-[#0B0D0E] hover:bg-[#F5F5F3] transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#0B0D0E]" /> : <Moon className="w-4 h-4 text-[#5A6066]" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative" data-dropdown>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationsOpen(!notificationsOpen);
                  setCreateMenuOpen(false);
                  setProfileMenuOpen(false);
                }}
                className="relative p-2 rounded-[8px] text-[#5A6066] hover:text-[#0B0D0E] hover:bg-[#F5F5F3] transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadLeadsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EFFF00] rounded-full ring-2 ring-white" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-[12px] shadow-xl border border-[#2B3034] bg-[#141719] py-2 z-50 text-xs text-white">
                  <div className="px-4 py-2 border-b border-white/[0.08] flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">Notifications</span>
                    <span className="text-[11px] text-[#EFFF00] font-mono">{unreadLeadsCount} new</span>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-white/[0.06]">
                    {leads.slice(0, 4).map((l, i) => (
                      <div 
                        key={l.id || i}
                        onClick={() => {
                          navigate('/admin/leads');
                          setNotificationsOpen(false);
                        }}
                        className="p-3 hover:bg-[#1B1F22] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs text-white truncate">
                            {l.reference || 'New RFP Enquiry'}
                          </span>
                          <span className="text-[10px] text-[#8A9097]">{l.date || 'Recent'}</span>
                        </div>
                        <p className="text-[11px] text-[#B9BDC1] line-clamp-1">
                          {l.name || l.company || 'Prospective Client'} • {l.capacity || 'Bulk'} MT ({l.industry || 'Storage'})
                        </p>
                      </div>
                    ))}
                    {leads.length === 0 && (
                      <div className="p-4 text-center text-[#8A9097] text-xs">
                        No recent notifications.
                      </div>
                    )}
                  </div>

                  <div className="px-3 pt-2 border-t border-white/[0.08] text-center">
                    <Link 
                      to="/admin/leads" 
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs font-semibold text-[#EFFF00] hover:underline"
                    >
                      View All Leads &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative border-l border-[#E5E5E0] pl-3 sm:pl-3" data-dropdown>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileMenuOpen(!profileMenuOpen);
                  setCreateMenuOpen(false);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2.5 focus:outline-none text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#0B0D0E] text-[#EFFF00] font-bold flex items-center justify-center text-xs shadow-xs border border-[#1F2327]">
                  A
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-bold leading-none truncate max-w-[120px] text-[#111111]">
                    Admin
                  </p>
                  <p className="text-[10px] text-[#6B7280] mt-0.5 leading-none font-medium">
                    Super Admin
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] hidden md:block" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-[12px] shadow-xl border border-[#2B3034] bg-[#141719] py-1.5 z-50 text-xs text-white">
                  <div className="px-3.5 py-2.5 border-b border-white/[0.08]">
                    <p className="font-semibold text-xs truncate text-white">Admin User</p>
                    <p className="text-[11px] text-[#8A9097] truncate">admin@baligroupsilos.com</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate('/admin/team');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-left hover:bg-[#1B1F22] hover:text-[#EFFF00] text-[#B9BDC1] transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Team & Permissions</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/admin/settings');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-left hover:bg-[#1B1F22] hover:text-[#EFFF00] text-[#B9BDC1] transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-white/[0.08] my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-[#C55A5A] hover:bg-[#1B1F22] transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-6 sm:p-7 md:p-8 max-w-[1520px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Cmd+K Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onQuickAction={(action) => {
          setIsCommandOpen(false);
          onQuickAction(action);
        }}
        leads={leads}
        products={products}
        projects={projects}
      />
    </div>
  );
};
