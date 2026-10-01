import React, { useState } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Edit3, 
  Trash2, 
  MapPin, 
  CheckCircle2, 
  X, 
  Save, 
  Copy,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectRecord } from '@/lib/dataService';
import { useAdminToast } from './AdminToast';
import { ImageUploadField } from './ImageUploadField';

interface ProjectsViewProps {
  projects: ProjectRecord[];
  onSaveProject: (project: ProjectRecord) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSaveProject,
  onDeleteProject,
}) => {
  const { toast } = useAdminToast();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit draft state
  const [editingProject, setEditingProject] = useState<ProjectRecord>({
    id: '',
    title: '',
    location: '',
    capacity: '',
    category: 'Commercial Ports',
    assetKey: '',
    imageUrl: '',
    scope: '',
    specs: [
      { label: 'Silo Configuration', value: '4x 5,000 MT Silos' },
      { label: 'Intake Capacity', value: '500 TPH' }
    ],
    deliverables: ['Intake Pit', 'Bucket Elevators', 'SCADA Room'],
    status: 'In Progress',
    completionRate: 75,
    published: true,
  });

  const categories = [
    'All', 
    'Commercial Ports', 
    'Rice & Flour Mills', 
    'Ethanol & Distilleries', 
    'Strategic Reserves', 
    'Animal Feed'
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.scope.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: '',
      location: 'Chandigarh, India',
      capacity: '20,000 MT',
      category: 'Commercial Ports',
      assetKey: `project_${Date.now()}`,
      imageUrl: 'https://images.unsplash.com/photo-1578330752538-23ab6d321ee7?q=80&w=1200&auto=format&fit=crop',
      scope: '',
      specs: [
        { label: 'Silo Configuration', value: '4x 5,000 MT Flat Bottom Silos' },
        { label: 'Throughput', value: '300 TPH Handling System' },
        { label: 'Galvanizing', value: 'Z600 (450 g/m²) High-Tensile Steel' },
      ],
      deliverables: ['Civil Foundation Drawings', 'Erection Supervision', 'Automated Aeration'],
      status: 'In Progress',
      completionRate: 60,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectRecord) => {
    setEditingProject({
      ...project,
      specs: project.specs || [],
      deliverables: project.deliverables || [],
    });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (project: ProjectRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = { ...project, published: !project.published };
      await onSaveProject(updated);
      toast({
        title: updated.published ? 'Project Published' : 'Project Drafted',
        message: `${project.title} status updated on website portfolio.`,
        type: 'success',
      });
    } catch (err: any) {
      toast({ title: 'Update Failed', message: err.message, type: 'error' });
    }
  };

  const handleDuplicate = async (project: ProjectRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const duplicate: ProjectRecord = {
        ...project,
        id: `proj-${Date.now()}`,
        title: `${project.title} (Copy)`,
        published: false,
      };
      await onSaveProject(duplicate);
      toast({ title: 'Project Duplicated', message: `Created draft copy of ${project.title}`, type: 'success' });
    } catch (err: any) {
      toast({ title: 'Duplicate Failed', message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (projectId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to remove project "${title}"?`)) return;
    try {
      await onDeleteProject(projectId);
      toast({ title: 'Project Deleted', message: `${title} removed from database.`, type: 'info' });
    } catch (err: any) {
      toast({ title: 'Delete Failed', message: err.message, type: 'error' });
    }
  };

  const handleSaveModal = async () => {
    if (!editingProject.title.trim()) {
      toast({ title: 'Validation Error', message: 'Project title is required.', type: 'error' });
      return;
    }
    setIsSaving(true);
    try {
      await onSaveProject(editingProject);
      toast({
        title: 'Project Saved',
        message: `${editingProject.title} updated in database & website portfolio.`,
        type: 'success',
      });
      setIsModalOpen(false);
    } catch (err: any) {
      toast({ title: 'Save Failed', message: err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Specs helper
  const handleAddSpec = () => {
    setEditingProject(p => ({
      ...p,
      specs: [...p.specs, { label: 'Scope Item', value: '' }]
    }));
  };

  const handleUpdateSpec = (idx: number, field: 'label' | 'value', val: string) => {
    setEditingProject(p => {
      const copy = [...p.specs];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, specs: copy };
    });
  };

  const handleRemoveSpec = (idx: number) => {
    setEditingProject(p => ({
      ...p,
      specs: p.specs.filter((_, i) => i !== idx)
    }));
  };

  // Deliverables helper
  const handleAddDeliverable = () => {
    setEditingProject(p => ({
      ...p,
      deliverables: [...p.deliverables, 'Scope Deliverable']
    }));
  };

  const handleUpdateDeliverable = (idx: number, val: string) => {
    setEditingProject(p => {
      const copy = [...p.deliverables];
      copy[idx] = val;
      return { ...p, deliverables: copy };
    });
  };

  const handleRemoveDeliverable = (idx: number) => {
    setEditingProject(p => ({
      ...p,
      deliverables: p.deliverables.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#111111] dark:text-white tracking-tight">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-gray-400 mt-1">
            Showcase turnkey terminal installations, rice mills, and grain aggregators worldwide.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#111111] text-white hover:bg-neutral-800 dark:bg-white dark:text-[#111111] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Filter & View Controls */}
      <div className="bg-white dark:bg-[#17191C] p-4 rounded-[10px] border border-[#E7E7E5] dark:border-[#26292D] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search project title, location, scope..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F7F5] dark:bg-[#23262A] border border-[#E7E7E5] dark:border-[#26292D] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#111111] dark:text-white focus:outline-none focus:border-gray-400"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F7F7F5] dark:bg-[#23262A] border border-[#E7E7E5] dark:border-[#26292D] rounded-lg px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Sectors' : c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7F7F5] dark:bg-[#23262A] border border-[#E7E7E5] dark:border-[#26292D] rounded-lg px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Commissioned">Commissioned</option>
          </select>
        </div>

        <div className="flex items-center gap-1 self-end md:self-auto bg-gray-100 dark:bg-white/5 p-1 rounded">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              "p-1.5 rounded transition-colors",
              viewMode === 'grid' ? "bg-white dark:bg-[#24272B] text-black dark:text-white shadow-xs" : "text-gray-400 hover:text-black dark:hover:text-white"
            )}
            title="Grid Cards View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              "p-1.5 rounded transition-colors",
              viewMode === 'table' ? "bg-white dark:bg-[#24272B] text-black dark:text-white shadow-xs" : "text-gray-400 hover:text-black dark:hover:text-white"
            )}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white dark:bg-[#17191C] rounded-lg border border-gray-200 dark:border-[#2C2F34] overflow-hidden shadow-xs flex flex-col justify-between hover:border-black dark:hover:border-white transition-all group"
            >
              <div>
                <div className="relative aspect-video bg-gray-100 dark:bg-white/5 overflow-hidden">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-black/80 text-white rounded">
                      {proj.category}
                    </span>
                  </div>

                  <span className={cn(
                    "absolute top-3 right-3 px-2 py-0.5 text-[10px] font-mono font-bold rounded shadow-xs",
                    proj.published 
                      ? "bg-[#EFFF00] text-[#0B0D0E] font-bold" 
                      : "bg-[#0B0D0E] text-[#B9BDC1] border border-[#2B3034]"
                  )}>
                    {proj.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono mb-2">
                    <MapPin className="w-3.5 h-3.5 text-[#0B0B0B] dark:text-[#EFFF00]" />
                    <span>{proj.location}</span>
                    <span>•</span>
                    <span className="font-bold text-black dark:text-white">{proj.capacity}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#0B0B0B] dark:text-white uppercase tracking-tight mb-2">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {proj.scope}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-3 border-t border-gray-100 dark:border-white/5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-gray-500">Status: {proj.status}</span>
                      <span className="font-bold">{proj.completionRate || 100}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all",
                          proj.status === 'Completed' || proj.status === 'Commissioned' ? "bg-white" : "bg-[#EFFF00]"
                        )}
                        style={{ width: `${proj.completionRate || 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-gray-50 dark:bg-[#141618] border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => handleTogglePublish(proj, e)}
                  className="text-gray-500 hover:text-black dark:hover:text-white font-medium"
                >
                  {proj.published ? 'Unpublish' : 'Publish'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleDuplicate(proj, e)}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-gray-600 dark:text-gray-300"
                    title="Duplicate Project"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-gray-700 dark:text-gray-300"
                    title="Edit Project"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(proj.id, proj.title, e)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded text-red-500"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-[#17191C] rounded-lg border border-gray-200 dark:border-[#2C2F34] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#121416] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#2C2F34]">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Thumbnail</th>
                  <th className="px-5 py-3.5 font-semibold">Project Name & Location</th>
                  <th className="px-5 py-3.5 font-semibold">Sector</th>
                  <th className="px-5 py-3.5 font-semibold">Capacity</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Visibility</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredProjects.map((proj) => (
                  <tr 
                    key={proj.id}
                    onClick={() => handleOpenEdit(proj)}
                    className="hover:bg-gray-50/70 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3">
                      <div className="w-12 h-10 bg-gray-100 dark:bg-white/5 rounded overflow-hidden border border-gray-200 dark:border-white/10 shrink-0">
                        <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-bold text-[#0B0B0B] dark:text-white max-w-xs truncate">{proj.title}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {proj.location}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{proj.category}</td>
                    <td className="px-5 py-3 font-mono font-bold text-gray-800 dark:text-gray-200">{proj.capacity}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "px-2.5 py-0.5 text-[10px] font-mono font-bold rounded",
                        proj.status === 'Completed' ? "bg-[#1B1F22] text-white border border-[#2B3034]" :
                        proj.status === 'Commissioned' ? "bg-[#1B1F22] text-[#EFFF00] border border-[#EFFF00]/30" :
                        "bg-[#23272B] text-[#B9BDC1] border border-[#2B3034]"
                      )}>
                        {proj.status} ({proj.completionRate || 100}%)
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={(e) => handleTogglePublish(proj, e)}
                        className={cn(
                          "px-2.5 py-0.5 text-[10px] font-mono font-bold rounded",
                          proj.published ? "bg-[#EFFF00] text-[#0B0D0E]" : "bg-[#1B1F22] text-[#8A9097] border border-[#2B3034]"
                        )}
                      >
                        {proj.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleOpenEdit(proj)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleDelete(proj.id, proj.title, e)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#17191C] border border-gray-200 dark:border-[#2C2F34] rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#0B0B0B] dark:text-white text-xs">
            
            <div className="p-5 border-b border-gray-200 dark:border-[#2C2F34] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">
                  {editingProject.id.startsWith('proj-') && !projects.some(p => p.id === editingProject.id)
                    ? 'Add Turnkey EPC Project'
                    : `Edit Project: ${editingProject.title}`}
                </h2>
                <p className="text-gray-500 text-xs">Global installation dossier and case study parameters</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="font-bold block mb-1">Project Name *</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. Deepwater Port Terminal Expansion"
                  className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">Location / Country *</label>
                  <input
                    type="text"
                    value={editingProject.location}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    placeholder="e.g. Dubai, UAE"
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Storage Capacity *</label>
                  <input
                    type="text"
                    value={editingProject.capacity}
                    onChange={(e) => setEditingProject({ ...editingProject, capacity: e.target.value })}
                    placeholder="e.g. 120,000 MT Total"
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Sector *</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Status</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Commissioned">Commissioned</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Completion Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingProject.completionRate}
                    onChange={(e) => setEditingProject({ ...editingProject, completionRate: Number(e.target.value) })}
                    className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2"
                  />
                </div>
              </div>

              <ImageUploadField
                value={editingProject.imageUrl}
                onChange={(url) => setEditingProject({ ...editingProject, imageUrl: url })}
                label="Project Cover Photo"
                recommendedDimensions="1200 x 800 px (Landscape 16:9 or 4:3)"
                aspectRatio="video"
              />

              <div>
                <label className="font-bold block mb-1">Engineering Scope of Work *</label>
                <textarea
                  rows={3}
                  value={editingProject.scope}
                  onChange={(e) => setEditingProject({ ...editingProject, scope: e.target.value })}
                  placeholder="Detailed breakdown of turnkey scope, conveying capacity, aeration, and timelines."
                  className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2"
                />
              </div>

              {/* Specs List */}
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-white/10">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Technical Specifications</span>
                  <button type="button" onClick={handleAddSpec} className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded font-bold">
                    + Add Spec
                  </button>
                </div>
                {editingProject.specs.map((s, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={s.label}
                      onChange={(e) => handleUpdateSpec(idx, 'label', e.target.value)}
                      placeholder="Spec Name"
                      className="w-1/3 bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-2 py-1.5"
                    />
                    <input
                      type="text"
                      value={s.value}
                      onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-2 py-1.5"
                    />
                    <button type="button" onClick={() => handleRemoveSpec(idx)} className="text-red-500 px-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Deliverables List */}
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-white/10">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Key Project Deliverables</span>
                  <button type="button" onClick={handleAddDeliverable} className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded font-bold">
                    + Add Deliverable
                  </button>
                </div>
                {editingProject.deliverables.map((d, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={d}
                      onChange={(e) => handleUpdateDeliverable(idx, e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-2 py-1.5"
                    />
                    <button type="button" onClick={() => handleRemoveDeliverable(idx)} className="text-red-500 px-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-[#2C2F34] bg-gray-50 dark:bg-[#141618] flex justify-between">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-white/10 rounded font-semibold text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveModal}
                className="bg-[#0B0B0B] text-white hover:bg-neutral-800 dark:bg-[#F4FF00] dark:text-[#0B0B0B] px-6 py-2.5 rounded font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save & Publish Project'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
