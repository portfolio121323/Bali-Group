import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Building2, 
  MapPin, 
  Layers, 
  UserCheck, 
  Send, 
  X, 
  CheckCircle2, 
  Archive, 
  Save,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeadRecord } from '@/lib/dataService';
import { useAdminToast } from './AdminToast';

interface LeadsViewProps {
  leads: LeadRecord[];
  onUpdateLeadStatus: (leadId: string, status: LeadRecord['status'], note?: string) => Promise<void>;
  onArchiveLead?: (leadId: string) => Promise<void>;
  selectedLead?: LeadRecord | null;
  onSelectLead?: (lead: LeadRecord | null) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onUpdateLeadStatus,
  onArchiveLead,
  selectedLead: controlledSelectedLead,
  onSelectLead,
}) => {
  const { toast } = useAdminToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');

  // Active drawer lead
  const [activeLead, setActiveLead] = useState<LeadRecord | null>(controlledSelectedLead || null);
  const [newNote, setNewNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Sync if controlled externally
  React.useEffect(() => {
    if (controlledSelectedLead !== undefined) {
      setActiveLead(controlledSelectedLead);
    }
  }, [controlledSelectedLead]);

  const handleSelect = (lead: LeadRecord | null) => {
    setActiveLead(lead);
    if (onSelectLead) onSelectLead(lead);
  };

  const filteredLeads = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (l.reference && l.reference.toLowerCase().includes(q)) ||
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.company && l.company.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.projectType && l.projectType.toLowerCase().includes(q));
    
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchesIndustry = industryFilter === 'All' || l.industry === industryFilter;

    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const handleStatusChange = async (newStatus: LeadRecord['status']) => {
    if (!activeLead) return;
    setIsUpdatingStatus(true);
    try {
      await onUpdateLeadStatus(activeLead.id, newStatus);
      setActiveLead(prev => prev ? { ...prev, status: newStatus } : null);
      toast({
        title: 'Status Updated',
        message: `Lead ${activeLead.reference} status set to ${newStatus}.`,
        type: 'success',
      });
    } catch (err: any) {
      toast({ title: 'Update Failed', message: err.message, type: 'error' });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddInternalNote = async () => {
    if (!activeLead || !newNote.trim()) return;
    try {
      const updatedNotes = [...(activeLead.internalNotes || []), `${new Date().toLocaleDateString()} - ${newNote.trim()}`];
      await onUpdateLeadStatus(activeLead.id, activeLead.status, newNote.trim());
      setActiveLead(prev => prev ? { ...prev, internalNotes: updatedNotes } : null);
      setNewNote('');
      toast({ title: 'Note Saved', message: 'Internal audit note logged.', type: 'success' });
    } catch (err: any) {
      toast({ title: 'Note Failed', message: err.message, type: 'error' });
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Reference,Client,Company,Email,Phone,Industry,Requirement,Capacity,Status,Date'];
    const rows = filteredLeads.map(l => 
      `"${l.reference || ''}","${l.name || ''}","${l.company || ''}","${l.email || ''}","${l.phone || ''}","${l.industry || ''}","${l.projectType || ''}","${l.capacity || ''}","${l.status || 'New'}","${l.date || ''}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bali_Group_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Export Generated', message: 'CSV downloaded successfully.', type: 'info' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#111111] dark:text-white tracking-tight">
            Leads & Technical Quotes
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-gray-400 mt-1">
            Commercial pipeline, client contact records, and grain silo sizing requests.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-white dark:bg-[#17191C] border border-[#E7E7E5] dark:border-[#26292D] hover:bg-gray-50 dark:hover:bg-white/5 text-[#111111] dark:text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#17191C] p-4 rounded-[10px] border border-[#E7E7E5] dark:border-[#26292D] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reference, client name, company, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F7F5] dark:bg-[#23262A] border border-[#E7E7E5] dark:border-[#26292D] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#111111] dark:text-white focus:outline-none focus:border-gray-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7F7F5] dark:bg-[#23262A] border border-[#E7E7E5] dark:border-[#26292D] rounded-lg px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="text-xs text-[#6B7280]">
          Total: <span className="font-semibold text-[#111111] dark:text-white">{filteredLeads.length}</span> Records
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#17191C] rounded-[10px] border border-[#E7E7E5] dark:border-[#26292D] shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF9] dark:bg-[#141618] text-[#6B7280] dark:text-gray-400 border-b border-[#E7E7E5] dark:border-[#26292D]">
              <tr>
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Client / Company</th>
                <th className="px-5 py-3 font-medium">Requirement</th>
                <th className="px-5 py-3 font-medium">Capacity</th>
                <th className="px-5 py-3 font-medium">Contact Info</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEFED] dark:divide-[#26292D]">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => handleSelect(lead)}
                    className="hover:bg-[#F9F9F8] dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-[#111111] dark:text-white">
                      {lead.reference || 'BG-ENQ-2026'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-[#111111] dark:text-white max-w-[150px] truncate">
                        {lead.name || 'Industrial Buyer'}
                      </div>
                      <div className="text-[11px] text-[#6B7280] max-w-[150px] truncate">
                        {lead.company || lead.industry || 'Agricultural EPC'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#6B7280] dark:text-gray-300 max-w-[160px] truncate">
                      {lead.projectType || 'Turnkey Silo Plant'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-800 dark:text-gray-200 font-medium">
                      {lead.capacity ? `${Number(lead.capacity).toLocaleString()} MT` : 'Bulk'}
                    </td>
                    <td className="px-5 py-3.5 text-[#6B7280] text-[11px]">
                      <div>{lead.email}</div>
                      <div>{lead.phone}</div>
                    </td>
                    <td className="px-5 py-3.5 text-[#6B7280] text-[11px]">
                      {lead.date || 'Recent'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        "px-2.5 py-0.5 text-[10px] font-semibold rounded inline-block",
                        lead.status === 'New' && "bg-[#EFFF00] text-[#0B0D0E]",
                        lead.status === 'Contacted' && "bg-[#1B1F22] text-white border border-[#2B3034]",
                        lead.status === 'Qualified' && "bg-[#23272B] text-[#B9BDC1] border border-[#2B3034]",
                        (lead.status === 'Converted' || lead.status === 'Closed') && "bg-[#1B1F22] text-[#EFFF00] border border-[#EFFF00]/30"
                      )}>
                        {lead.status || 'New'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(lead);
                        }}
                        className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 hover:bg-[#F4FF00] hover:text-black rounded-md text-[11px] font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[#6B7280]">
                    No inquiries found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-[#17191C] border-l border-gray-200 dark:border-[#2C2F34] w-full max-w-xl h-full shadow-2xl flex flex-col text-xs text-[#0B0B0B] dark:text-white animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-200 dark:border-[#2C2F34] flex items-center justify-between bg-gray-50/50 dark:bg-[#141618]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-black tracking-wider text-[#0B0B0B] dark:text-[#EFFF00]">
                    {activeLead.reference || 'BG-ENQ-2026'}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase",
                    activeLead.status === 'New' ? "bg-[#EFFF00] text-[#0B0D0E]" :
                    activeLead.status === 'Contacted' ? "bg-[#1B1F22] text-white border border-[#2B3034]" :
                    activeLead.status === 'Qualified' ? "bg-[#23272B] text-[#B9BDC1] border border-[#2B3034]" :
                    activeLead.status === 'Converted' ? "bg-[#1B1F22] text-[#EFFF00] border border-[#EFFF00]/30" :
                    "bg-[#1B1F22] text-[#8A9097] border border-[#2B3034]"
                  )}>
                    {activeLead.status || 'New'}
                  </span>
                </div>
                <p className="text-gray-500 text-[11px]">Submitted {activeLead.date || 'via Website Form'}</p>
              </div>
              <button 
                onClick={() => handleSelect(null)}
                className="p-2 text-gray-400 hover:text-black dark:hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Client Info Card */}
              <div className="bg-gray-50 dark:bg-[#24272B] p-4 rounded border border-gray-200 dark:border-[#2C2F34] space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase text-gray-400 block">
                  Client Information
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-500 block text-[11px]">Contact Name</span>
                    <span className="font-bold text-sm">{activeLead.name || 'Anonymous Client'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Company / Organization</span>
                    <span className="font-bold text-sm">{activeLead.company || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Email Address</span>
                    <a href={`mailto:${activeLead.email}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      {activeLead.email || 'None provided'}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Telephone / WhatsApp</span>
                    <a href={`tel:${activeLead.phone}`} className="font-semibold text-gray-800 dark:text-gray-200 font-mono">
                      {activeLead.phone || 'None provided'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Requirement Card */}
              <div className="bg-gray-50 dark:bg-[#24272B] p-4 rounded border border-gray-200 dark:border-[#2C2F34] space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase text-gray-400 block">
                  Project Requirement
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-500 block text-[11px]">Project Classification</span>
                    <span className="font-bold">{activeLead.projectType || 'Grain Silos'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Target Capacity</span>
                    <span className="font-bold font-mono">{activeLead.capacity ? `${Number(activeLead.capacity).toLocaleString()} MT` : 'Custom'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Industry Sector</span>
                    <span className="font-bold">{activeLead.industry || 'Commercial Storage'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Grain Material</span>
                    <span className="font-bold">{activeLead.material || 'Wheat / Paddy / Maize'}</span>
                  </div>
                </div>

                {activeLead.notes && (
                  <div className="pt-3 border-t border-gray-200 dark:border-white/5">
                    <span className="text-gray-500 block text-[11px] mb-1">Client Specifications Note</span>
                    <p className="bg-white dark:bg-[#17191C] p-3 rounded border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 leading-relaxed font-mono text-[11px]">
                      {activeLead.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Update Controls */}
              <div>
                <span className="font-bold block mb-2 uppercase tracking-wider text-[10px] text-gray-400">
                  Update Lifecycle Status
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['New', 'Contacted', 'Qualified', 'Converted', 'Closed'] as const).map((st) => (
                    <button
                      key={st}
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange(st)}
                      className={cn(
                        "py-2 rounded font-bold text-[10px] uppercase font-mono transition-all",
                        activeLead.status === st
                          ? "bg-[#0B0D0E] text-[#EFFF00] dark:bg-[#EFFF00] dark:text-[#0B0D0E] shadow-xs"
                          : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-3 pt-2">
                <span className="font-bold block uppercase tracking-wider text-[10px] text-gray-400">
                  Engineering Notes & History
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log a client conversation or technical sizing review..."
                    className="flex-1 bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                  />
                  <button
                    onClick={handleAddInternalNote}
                    className="bg-[#0B0B0B] text-white hover:bg-neutral-800 dark:bg-[#F4FF00] dark:text-[#0B0B0B] px-4 py-2 rounded font-bold text-xs uppercase"
                  >
                    Save Note
                  </button>
                </div>

                <div className="space-y-2">
                  {activeLead.internalNotes && activeLead.internalNotes.length > 0 ? (
                    activeLead.internalNotes.map((nt, idx) => (
                      <div key={idx} className="p-2.5 bg-gray-50 dark:bg-[#24272B] rounded text-[11px] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/5 flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span>{nt}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic text-[11px]">No internal engineering notes yet.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-[#2C2F34] bg-gray-50 dark:bg-[#141618] flex items-center justify-between">
              <a
                href={`mailto:${activeLead.email}?subject=Bali%20Group%20Engineering%20Proposal%20${activeLead.reference || ''}`}
                className="bg-[#0B0B0B] text-white hover:bg-neutral-800 dark:bg-[#F4FF00] dark:text-[#0B0B0B] px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email Client Proposal</span>
              </a>

              <button
                onClick={() => handleSelect(null)}
                className="px-4 py-2 border border-gray-300 dark:border-white/10 rounded font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
