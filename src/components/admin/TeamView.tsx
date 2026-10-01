import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Shield, 
  ShieldCheck, 
  Mail, 
  Clock, 
  Check, 
  Trash2, 
  X, 
  Save, 
  Lock 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TeamMember, INITIAL_TEAM } from '@/lib/dataService';
import { useAdminToast } from './AdminToast';

export const TeamView: React.FC = () => {
  const { toast } = useAdminToast();
  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('bali_admin_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    email: '',
    role: 'Admin',
    status: 'Active',
    department: 'Engineering Operations',
    lastLogin: 'Never',
  });

  const handleSaveMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({ title: 'Validation Error', message: 'Name and Email are required.', type: 'error' });
      return;
    }

    const member: TeamMember = {
      ...newMember,
      id: `team-${Date.now()}`,
    };

    const nextTeam = [...team, member];
    setTeam(nextTeam);
    localStorage.setItem('bali_admin_team', JSON.stringify(nextTeam));
    setIsModalOpen(false);
    toast({
      title: 'Member Added',
      message: `${member.name} granted ${member.role} privileges.`,
      type: 'success',
    });
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (team.length <= 1) {
      toast({ title: 'Cannot Delete', message: 'At least one Super Admin is required.', type: 'warning' });
      return;
    }
    if (!confirm(`Revoke access for ${name}?`)) return;

    const nextTeam = team.filter(t => t.id !== id);
    setTeam(nextTeam);
    localStorage.setItem('bali_admin_team', JSON.stringify(nextTeam));
    toast({ title: 'Access Revoked', message: `${name} has been removed.`, type: 'info' });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#111111] dark:text-white tracking-tight">
            Team & Access
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-gray-400 mt-1">
            Manage administrative personnel, executive approvals, and department permissions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#111111] text-white hover:bg-neutral-800 dark:bg-white dark:text-[#111111] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Permissions Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#17191C] p-5 rounded-[10px] border border-[#E7E7E5] dark:border-[#26292D] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-2.5 h-2.5 bg-[#F4FF00] rounded-full inline-block border border-black/20" />
            <h3 className="font-semibold text-xs text-[#111111] dark:text-white">
              Super Admin
            </h3>
          </div>
          <p className="text-xs text-[#6B7280] dark:text-gray-400 mb-3">
            Unrestricted access to all modules, team security, settings, and database rules.
          </p>
          <div className="text-[11px] text-[#0B0D0E] dark:text-[#EFFF00] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#EFFF00]" /> Full Root Access
          </div>
        </div>

        <div className="bg-white dark:bg-[#17191C] p-5 rounded-[10px] border border-[#E7E7E5] dark:border-[#26292D] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-2.5 h-2.5 bg-white border border-[#2B3034] rounded-full inline-block" />
            <h3 className="font-semibold text-xs text-[#111111] dark:text-white">
              Admin
            </h3>
          </div>
          <p className="text-xs text-[#6B7280] dark:text-gray-400 mb-3">
            Can manage products, projects, quote inquiries, lead notes, and media uploads.
          </p>
          <div className="text-[11px] text-[#111111] dark:text-white font-medium flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#B9BDC1]" /> Operational Permissions
          </div>
        </div>

        <div className="bg-white dark:bg-[#17191C] p-5 rounded-[10px] border border-[#E7E7E5] dark:border-[#26292D] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-2.5 h-2.5 bg-gray-400 rounded-full inline-block" />
            <h3 className="font-semibold text-xs text-[#111111] dark:text-white">
              Editor
            </h3>
          </div>
          <p className="text-xs text-[#6B7280] dark:text-gray-400 mb-3">
            Can update website CMS content blocks and view public documentation.
          </p>
          <div className="text-[11px] text-[#6B7280] dark:text-gray-400 font-medium flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Content Only
          </div>
        </div>
      </div>

      {/* Team Roster Table */}
      <div className="bg-white dark:bg-[#17191C] rounded-lg border border-gray-200 dark:border-[#2C2F34] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#121416] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#2C2F34]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">User</th>
                <th className="px-5 py-3.5 font-semibold">Department</th>
                <th className="px-5 py-3.5 font-semibold">Role</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Last Active</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/70 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#0B0B0B] text-[#F4FF00] font-black flex items-center justify-center text-xs">
                        {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-bold text-[#0B0B0B] dark:text-white block">{m.name}</span>
                        <span className="text-[11px] text-gray-500">{m.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 font-mono">
                    {m.department}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn(
                      "px-2.5 py-0.5 text-[10px] font-mono font-bold rounded",
                      m.role === 'Super Admin' ? "bg-[#F4FF00] text-[#0B0B0B]" :
                      m.role === 'Admin' ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300" :
                      "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300"
                    )}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-[#111111] dark:text-[#EFFF00] font-mono text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 bg-[#EFFF00] rounded-full ring-1 ring-black/20" />
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 font-mono text-[11px]">
                    {m.lastLogin || 'Today'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {m.role !== 'Super Admin' && (
                      <button
                        onClick={() => handleRemoveMember(m.id, m.name)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded text-red-500"
                        title="Revoke Permissions"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#17191C] border border-gray-200 dark:border-[#2C2F34] rounded-lg shadow-2xl max-w-md w-full p-6 text-xs text-[#0B0B0B] dark:text-white space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <h2 className="text-base font-black uppercase tracking-tight">Add Administrative User</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-black dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Jaspreet Singh"
                  className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Corporate Email *</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="name@baligroupsilos.com"
                  className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Access Role *</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Department</label>
                  <input
                    type="text"
                    value={newMember.department}
                    onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                    placeholder="e.g. Project EPC"
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-white/10 rounded font-semibold text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMember}
                className="bg-[#0B0B0B] text-white hover:bg-neutral-800 dark:bg-[#F4FF00] dark:text-[#0B0B0B] px-5 py-2 rounded font-bold uppercase tracking-wider"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
