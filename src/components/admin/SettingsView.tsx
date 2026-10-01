import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Building, 
  Mail, 
  Share2, 
  Globe, 
  Bell, 
  Shield, 
  Server, 
  Save, 
  Check,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Eye,
  Loader2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SiteSettings, DEFAULT_SETTINGS } from '@/lib/dataService';
import { useAdminToast } from './AdminToast';
import { useAssets } from '@/lib/contexts/AssetsContext';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { processDeviceImage } from '@/lib/imageUtils';

export const SettingsView: React.FC = () => {
  const { toast } = useAdminToast();
  const { assets } = useAssets();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<
    'general' | 'contact' | 'social' | 'seo' | 'notifications' | 'system'
  >('general');

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('bali_admin_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Logo state
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [hideBrandText, setHideBrandText] = useState<boolean>(false);
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);
  const [isSavingLogo, setIsSavingLogo] = useState(false);

  // Sync logo state with assets context / settings
  useEffect(() => {
    if (assets['site_logo']?.url) {
      setLogoUrl(assets['site_logo'].url);
    } else if (settings.logoUrl) {
      setLogoUrl(settings.logoUrl);
    }

    if (assets['site_logo_hide_text']?.url !== undefined) {
      setHideBrandText(assets['site_logo_hide_text'].url === 'true');
    } else if (settings.hideBrandText !== undefined) {
      setHideBrandText(settings.hideBrandText);
    }
  }, [assets]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedSettings = {
        ...settings,
        logoUrl,
        hideBrandText
      };
      localStorage.setItem('bali_admin_settings', JSON.stringify(updatedSettings));

      if (db) {
        // Save settings document
        await setDoc(doc(db, 'site_content', 'settings'), {
          ...updatedSettings,
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Save logo to site_assets for live instant sync across all visitors
        if (logoUrl) {
          await setDoc(doc(db, 'site_assets', 'site_logo'), {
            url: logoUrl,
            alt: 'Website Logo',
            updatedAt: serverTimestamp()
          }, { merge: true });
        }
        await setDoc(doc(db, 'site_assets', 'site_logo_hide_text'), {
          url: hideBrandText ? 'true' : 'false',
          alt: 'Hide brand text setting',
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      toast({
        title: 'Settings Saved',
        message: 'Enterprise configuration and website logo updated successfully.',
        type: 'success',
      });
    } catch (e: any) {
      console.error('Settings save warning:', e);
      toast({
        title: 'Saved Locally',
        message: 'Settings saved to browser storage.',
        type: 'info',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Dedicated Save Logo handler
  const handleSaveLogoDirect = async (urlToSave: string, hideTextToSave: boolean) => {
    setIsSavingLogo(true);
    try {
      if (db) {
        if (urlToSave) {
          await setDoc(doc(db, 'site_assets', 'site_logo'), {
            url: urlToSave,
            alt: 'Website Logo',
            updatedAt: serverTimestamp()
          }, { merge: true });
        } else {
          await deleteDoc(doc(db, 'site_assets', 'site_logo'));
        }

        await setDoc(doc(db, 'site_assets', 'site_logo_hide_text'), {
          url: hideTextToSave ? 'true' : 'false',
          alt: 'Hide brand text setting',
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      const updated = {
        ...settings,
        logoUrl: urlToSave,
        hideBrandText: hideTextToSave
      };
      setSettings(updated);
      localStorage.setItem('bali_admin_settings', JSON.stringify(updated));

      toast({
        title: urlToSave ? 'Website Logo Updated' : 'Default Logo Restored',
        message: urlToSave 
          ? 'Your new brand logo is now live across the header, footer, and admin panel.' 
          : 'Reverted to the classic yellow BG industrial emblem.',
        type: 'success'
      });
    } catch (err: any) {
      console.error('Failed to update logo in Firestore:', err);
      toast({
        title: 'Logo Updated Locally',
        message: 'Updated in local session. Firestore synchronization notice: ' + (err.message || ''),
        type: 'info'
      });
    } finally {
      setIsSavingLogo(false);
    }
  };

  const handleDeviceLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        message: 'Please choose an image file (SVG, PNG, JPG, or WebP).',
        type: 'error'
      });
      return;
    }

    try {
      setIsProcessingLogo(true);
      const result = await processDeviceImage(file, { maxDimension: 800, quality: 0.9 });
      setLogoUrl(result.dataUrl);
      await handleSaveLogoDirect(result.dataUrl, hideBrandText);
    } catch (err: any) {
      console.error('Error processing logo image:', err);
      toast({
        title: 'Processing Failed',
        message: 'Could not process the selected image.',
        type: 'error'
      });
    } finally {
      setIsProcessingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResetToDefaultLogo = async () => {
    setLogoUrl('');
    setHideBrandText(false);
    await handleSaveLogoDirect('', false);
  };

  const tabs = [
    { id: 'general', label: 'General Organization', icon: Building },
    { id: 'contact', label: 'Contact Information', icon: Mail },
    { id: 'social', label: 'Social & Media Links', icon: Share2 },
    { id: 'seo', label: 'SEO Defaults', icon: Globe },
    { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
    { id: 'system', label: 'Cloud & System Environment', icon: Server },
  ] as const;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#111111] dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-gray-400 mt-1">
            Configure global contact coordinates, social channels, SEO metadata, and cloud parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#111111] text-white hover:bg-neutral-800 dark:bg-white dark:text-[#111111] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="bg-white dark:bg-[#17191C] rounded-[10px] border border-[#E7E7E5] dark:border-[#26292D] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Vertical Nav */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#E7E7E5] dark:border-[#26292D] p-3 space-y-1 bg-[#F9F9F8] dark:bg-[#141618]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left transition-colors font-medium",
                  isActive 
                    ? "bg-[#111111] text-white dark:bg-white dark:text-[#111111] font-semibold shadow-xs" 
                    : "text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 md:p-8 text-xs text-[#0B0B0B] dark:text-white space-y-6">
          
          {/* TAB 1: General */}
          {activeTab === 'general' && (
            <div className="space-y-8 max-w-2xl">
              
              {/* WEBSITE LOGO & BRANDING SECTION */}
              <div className="bg-[#F9F9F8] dark:bg-[#1A1D20] p-6 rounded-xl border border-[#E7E7E5] dark:border-[#2C2F34] space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#EFFF00] dark:text-[#EFFF00] bg-[#111] p-0.5 rounded" />
                      <h3 className="text-sm font-bold uppercase tracking-wide">Website Logo & Brand Emblem</h3>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      Upload your official corporate logo. It appears in the main navigation bar, mobile menu, footer, and admin sidebar.
                    </p>
                  </div>
                  {logoUrl ? (
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Custom Logo
                    </span>
                  ) : (
                    <span className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                      Default BG Emblem
                    </span>
                  )}
                </div>

                {/* Live Preview Display */}
                <div>
                  <label className="font-bold block mb-2 text-xs text-gray-700 dark:text-gray-300">
                    Live Header Simulation Preview
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Dark Header Preview */}
                    <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {logoUrl ? (
                          <div className="flex items-center justify-center h-10 w-auto max-w-[120px]">
                            <img 
                              src={logoUrl} 
                              alt="Logo Preview" 
                              className="max-h-10 max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 bg-[#F4FF00] flex items-center justify-center font-black text-[#0B0B0B] text-base">
                            BG
                          </div>
                        )}
                        {!hideBrandText && (
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm leading-tight">
                              {settings.orgName || 'BALI GROUP'}
                            </span>
                            <span className="text-[9px] uppercase tracking-widest text-[#A8AFB8]">
                              Industrial Engineering
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-white/40 uppercase">Dark Bar</span>
                    </div>

                    {/* Light Preview */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {logoUrl ? (
                          <div className="flex items-center justify-center h-10 w-auto max-w-[120px]">
                            <img 
                              src={logoUrl} 
                              alt="Logo Preview" 
                              className="max-h-10 max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 bg-[#F4FF00] flex items-center justify-center font-black text-[#0B0B0B] text-base border border-neutral-300">
                            BG
                          </div>
                        )}
                        {!hideBrandText && (
                          <div className="flex flex-col">
                            <span className="font-bold text-[#0B0B0B] text-sm leading-tight">
                              {settings.orgName || 'BALI GROUP'}
                            </span>
                            <span className="text-[9px] uppercase tracking-widest text-gray-500">
                              Industrial Engineering
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase">Light Bar</span>
                    </div>

                  </div>
                </div>

                {/* Upload & Controls */}
                <div className="space-y-4 pt-2 border-t border-[#E7E7E5] dark:border-[#2C2F34]">
                  
                  {/* File Upload Button + Hidden Input */}
                  <div>
                    <label className="font-bold block mb-1 text-xs">Upload Logo from Device</label>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleDeviceLogoUpload}
                      accept="image/png,image/svg+xml,image/jpeg,image/webp,image/gif"
                      className="hidden" 
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessingLogo || isSavingLogo}
                        className="bg-[#111111] hover:bg-neutral-800 text-white dark:bg-white dark:text-[#111111] dark:hover:bg-gray-100 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        {isProcessingLogo ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing Logo...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Select Image File (PNG, SVG, JPG, WebP)</span>
                          </>
                        )}
                      </button>

                      {logoUrl && (
                        <button
                          type="button"
                          onClick={handleResetToDefaultLogo}
                          disabled={isSavingLogo}
                          className="px-3.5 py-2.5 rounded-lg border border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Restore original yellow BG emblem"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset to Default</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5">
                      Transparent PNG or SVG is recommended. Automatically optimized & compressed to preserve fast loading.
                    </p>
                  </div>

                  {/* Direct URL Input */}
                  <div>
                    <label className="font-bold block mb-1 text-xs">Or Enter Logo Image URL</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/logo.svg"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="flex-1 bg-white dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveLogoDirect(logoUrl, hideBrandText)}
                        disabled={isSavingLogo}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#111] dark:text-white px-3.5 py-2 rounded text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {isSavingLogo ? 'Saving...' : 'Apply URL'}
                      </button>
                    </div>
                  </div>

                  {/* Hide Brand Name Option */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={hideBrandText}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setHideBrandText(val);
                          handleSaveLogoDirect(logoUrl, val);
                        }}
                        className="rounded text-[#111111] focus:ring-0 mt-0.5"
                      />
                      <div className="text-xs">
                        <span className="font-semibold block">Hide company text alongside logo</span>
                        <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                          Check this if your uploaded logo image already has the "BALI GROUP" text written inside the image itself.
                        </span>
                      </div>
                    </label>
                  </div>

                </div>
              </div>

              {/* ORGANIZATION PROFILE SECTION */}
              <div className="space-y-4 pt-4 border-t border-[#E7E7E5] dark:border-[#2C2F34]">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide mb-1">Organization Profile</h3>
                  <p className="text-gray-500 text-xs">Primary legal entity identity and operating timezone.</p>
                </div>

                <div>
                  <label className="font-bold block mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    value={settings.orgName}
                    onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Manufacturing Headquarters Address</label>
                  <textarea
                    rows={3}
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Primary Operating Timezone</label>
                  <input
                    type="text"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Contact */}
          {activeTab === 'contact' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-1">Contact Information</h3>
                <p className="text-gray-500 text-xs">Public communication lines shown across website header and footer.</p>
              </div>

              <div>
                <label className="font-bold block mb-1">Central Sales & EPC Telephone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Inquiries Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Technical Catalog PDF Download URL</label>
                <input
                  type="text"
                  value={settings.brochureUrl}
                  onChange={(e) => setSettings({ ...settings, brochureUrl: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Social */}
          {activeTab === 'social' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-1">Social & Industry Channels</h3>
                <p className="text-gray-500 text-xs">Official corporate profile links.</p>
              </div>

              <div>
                <label className="font-bold block mb-1">LinkedIn Corporate Page</label>
                <input
                  type="text"
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">YouTube Channel / Case Study Videos</label>
                <input
                  type="text"
                  value={settings.youtube}
                  onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Twitter / X Handle</label>
                <input
                  type="text"
                  value={settings.twitter}
                  onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 4: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-1">Default Search Engine Metadata</h3>
                <p className="text-gray-500 text-xs">Fallback meta tags for international industrial search discovery.</p>
              </div>

              <div>
                <label className="font-bold block mb-1">Default Title Tag</label>
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Default Meta Description</label>
                <textarea
                  rows={3}
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 5: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-5 max-w-xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-1">RFP Dispatch & Email Alerts</h3>
                <p className="text-gray-500 text-xs">Configure real-time notifications for incoming tenders.</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#24272B] rounded border border-gray-200 dark:border-[#2C2F34] cursor-pointer">
                  <div>
                    <span className="font-bold block">Instant Email on New RFP Submission</span>
                    <span className="text-[11px] text-gray-500">Sends immediate specification payload to engineering desk</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyOnLead}
                    onChange={(e) => setSettings({ ...settings, notifyOnLead: e.target.checked })}
                    className="w-4 h-4 accent-[#0B0B0B] dark:accent-[#F4FF00]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#24272B] rounded border border-gray-200 dark:border-[#2C2F34] cursor-pointer">
                  <div>
                    <span className="font-bold block">Daily Executive Digest</span>
                    <span className="text-[11px] text-gray-500">Summary of total quotes, status progressions, and traffic stats</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.dailyDigest}
                    onChange={(e) => setSettings({ ...settings, dailyDigest: e.target.checked })}
                    className="w-4 h-4 accent-[#0B0B0B] dark:accent-[#F4FF00]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#24272B] rounded border border-gray-200 dark:border-[#2C2F34] cursor-pointer">
                  <div>
                    <span className="font-bold block">Priority Alert on High-Capacity Inquiries (&gt; 20,000 MT)</span>
                    <span className="text-[11px] text-gray-500">Flags large commercial port & national reserve inquiries</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.highCapacityAlerts}
                    onChange={(e) => setSettings({ ...settings, highCapacityAlerts: e.target.checked })}
                    className="w-4 h-4 accent-[#0B0B0B] dark:accent-[#F4FF00]"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: System Environment */}
          {activeTab === 'system' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-1">Cloud Infrastructure & Telemetry</h3>
                <p className="text-gray-500 text-xs">Runtime status and connected database identifiers.</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-[#24272B] rounded border border-gray-200 dark:border-[#2C2F34] space-y-2 font-mono text-[11px]">
                <div className="flex justify-between py-1 border-b border-gray-200 dark:border-white/5">
                  <span className="text-gray-500">Database Engine:</span>
                  <span className="font-bold text-[#111111] dark:text-[#EFFF00]">Firebase Firestore (Production)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200 dark:border-white/5">
                  <span className="text-gray-500">Project ID:</span>
                  <span className="font-bold">tactile-idiom-k8gvj</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200 dark:border-white/5">
                  <span className="text-gray-500">Database ID:</span>
                  <span className="font-bold truncate max-w-[220px]">ai-studio-baligroupsilosco-d980d16b-5def-440c-af77-a2588568e65b</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200 dark:border-white/5">
                  <span className="text-gray-500">Frontend Environment:</span>
                  <span className="font-bold">Vite React + Tailwind CSS v4</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Security Rules:</span>
                  <span className="font-bold text-[#111111] dark:text-[#EFFF00]">Deployed & Enforced</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
