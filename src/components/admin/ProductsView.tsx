import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Upload, 
  Image as ImageIcon,
  ExternalLink,
  Save,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductRecord } from '@/lib/dataService';
import { useAdminToast } from './AdminToast';
import { ImageUploadField } from './ImageUploadField';

interface ProductsViewProps {
  products: ProductRecord[];
  onSaveProduct: (product: ProductRecord) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  mediaAssets?: Record<string, any>;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
  mediaAssets = {},
}) => {
  const { toast } = useAdminToast();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal / Drawer state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'specs' | 'features' | 'seo'>('basic');
  const [isSaving, setIsSaving] = useState(false);

  // Current editing product draft
  const [editingProduct, setEditingProduct] = useState<ProductRecord>({
    id: '',
    title: '',
    category: 'Silos',
    assetKey: '',
    imageUrl: '',
    desc: '',
    specs: [
      { label: 'Capacity Range', value: '' },
      { label: 'Zinc Coating', value: 'Z600 (450 g/m²)' },
      { label: 'Standards', value: 'Eurocode EN 1993-4-1 / ANSI' }
    ],
    features: ['High-tensile corrugated steel', 'Automated aeration manifold'],
    published: true,
  });

  const categories = ['All', 'Silos', 'Material Handling', 'Cleaning & Processing', 'Accessories'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Published' ? p.published : !p.published);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      title: '',
      category: 'Silos',
      assetKey: `product_${Date.now()}`,
      imageUrl: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop',
      desc: '',
      specs: [
        { label: 'Capacity Range', value: '500 to 15,000 MT' },
        { label: 'Zinc Coating', value: 'Z600 Hot-Dip Galvanized' },
        { label: 'Design Code', value: 'Eurocode EN 1993-4-1' },
      ],
      features: ['Automated mass flow discharge', 'Multi-point digital temp cables'],
      published: true,
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: ProductRecord) => {
    setEditingProduct({
      ...product,
      specs: product.specs || [],
      features: product.features || [],
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (product: ProductRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = { ...product, published: !product.published };
      await onSaveProduct(updated);
      toast({
        title: updated.published ? 'Product Published' : 'Product Un-published',
        message: `${product.title} visibility updated on website.`,
        type: 'success',
      });
    } catch (err: any) {
      toast({ title: 'Update Failed', message: err.message, type: 'error' });
    }
  };

  const handleSaveModal = async () => {
    if (!editingProduct.title.trim()) {
      toast({ title: 'Validation Error', message: 'Product title is required.', type: 'error' });
      return;
    }
    setIsSaving(true);
    try {
      await onSaveProduct(editingProduct);
      toast({
        title: 'Product Saved',
        message: `${editingProduct.title} updated in database & website catalog.`,
        type: 'success',
      });
      setIsModalOpen(false);
    } catch (err: any) {
      toast({ title: 'Save Failed', message: err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (productId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await onDeleteProduct(productId);
      toast({ title: 'Product Deleted', message: `${title} removed from catalog.`, type: 'info' });
    } catch (err: any) {
      toast({ title: 'Delete Failed', message: err.message, type: 'error' });
    }
  };

  // Spec manipulation helpers
  const handleAddSpec = () => {
    setEditingProduct(prev => ({
      ...prev,
      specs: [...prev.specs, { label: 'New Specification', value: '' }]
    }));
  };

  const handleUpdateSpec = (idx: number, field: 'label' | 'value', val: string) => {
    setEditingProduct(prev => {
      const next = [...prev.specs];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, specs: next };
    });
  };

  const handleRemoveSpec = (idx: number) => {
    setEditingProduct(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== idx)
    }));
  };

  // Feature manipulation helpers
  const handleAddFeature = () => {
    setEditingProduct(prev => ({
      ...prev,
      features: [...prev.features, 'New engineered feature']
    }));
  };

  const handleUpdateFeature = (idx: number, val: string) => {
    setEditingProduct(prev => {
      const next = [...prev.features];
      next[idx] = val;
      return { ...prev, features: next };
    });
  };

  const handleRemoveFeature = (idx: number) => {
    setEditingProduct(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#111111] dark:text-white tracking-tight">
            Products
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-gray-400 mt-1">
            Manage flat/hopper bottom silos, elevators, conveyors, and processing equipment.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#111111] text-white hover:bg-neutral-800 dark:bg-white dark:text-[#111111] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#17191C] p-4 rounded-[10px] border border-[#E7E7E5] dark:border-[#26292D] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search product name, description, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F7F5] dark:bg-[#23262A] border border-[#E7E7E5] dark:border-[#26292D] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#111111] dark:text-white focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F7F7F5] dark:bg-[#23262A] border border-[#E7E7E5] dark:border-[#26292D] rounded-lg px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7F7F5] dark:bg-[#23262A] border border-[#E7E7E5] dark:border-[#26292D] rounded-lg px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 self-end md:self-auto bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
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
        </div>
      </div>

      {/* Products Display (Table or Grid) */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-[#17191C] rounded-lg border border-gray-200 dark:border-[#2C2F34] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#121416] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#2C2F34]">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Thumbnail</th>
                  <th className="px-5 py-3.5 font-semibold">Product Name</th>
                  <th className="px-5 py-3.5 font-semibold">Category</th>
                  <th className="px-5 py-3.5 font-semibold">Key Specs</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => (
                    <tr 
                      key={prod.id} 
                      onClick={() => handleOpenEdit(prod)}
                      className="hover:bg-gray-50/70 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3">
                        <div className="w-12 h-10 bg-gray-100 dark:bg-white/5 rounded overflow-hidden border border-gray-200 dark:border-white/10 shrink-0">
                          <img 
                            src={prod.imageUrl || 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=1200&auto=format&fit=crop'} 
                            alt={prod.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-bold text-[#0B0B0B] dark:text-white max-w-xs truncate">
                          {prod.title}
                        </div>
                        <div className="text-[11px] text-gray-400 dark:text-gray-400 line-clamp-1 max-w-sm">
                          {prod.desc}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-gray-600 dark:text-gray-400">
                        {prod.category}
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {prod.specs?.[0]?.label}: {prod.specs?.[0]?.value || 'Configurable'}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={(e) => handleTogglePublish(prod, e)}
                          className={cn(
                            "px-2.5 py-0.5 text-[10px] font-mono font-bold rounded flex items-center gap-1.5 transition-colors",
                            prod.published 
                              ? "bg-[#EFFF00] text-[#0B0D0E] border border-[#EFFF00]" 
                              : "bg-[#1B1F22] text-[#8A9097] border border-[#2B3034]"
                          )}
                          title="Click to toggle publish status"
                        >
                          <span className={cn("w-1.5 h-1.5 rounded-full", prod.published ? "bg-[#0B0D0E]" : "bg-[#8A9097]")} />
                          <span>{prod.published ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-gray-500 hover:text-black dark:hover:text-white"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(prod.id, prod.title, e)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded text-red-500"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                      No products matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id}
              className="bg-white dark:bg-[#17191C] rounded-lg border border-gray-200 dark:border-[#2C2F34] overflow-hidden shadow-xs flex flex-col justify-between hover:border-black dark:hover:border-white transition-all group"
            >
              <div>
                <div className="relative aspect-video bg-gray-100 dark:bg-white/5 overflow-hidden">
                  <img 
                    src={prod.imageUrl} 
                    alt={prod.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={cn(
                    "absolute top-3 right-3 px-2 py-0.5 text-[10px] font-mono font-bold rounded shadow-xs",
                    prod.published 
                      ? "bg-[#EFFF00] text-[#0B0D0E] font-bold" 
                      : "bg-[#0B0D0E] text-[#B9BDC1] border border-[#2B3034]"
                  )}>
                    {prod.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] font-mono bg-black/80 text-white rounded">
                    {prod.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-[#0B0B0B] dark:text-white uppercase tracking-tight mb-2">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                    {prod.desc}
                  </p>

                  {/* Specs Pill List */}
                  <div className="space-y-1.5 pt-3 border-t border-gray-100 dark:border-white/5 text-[11px] font-mono">
                    {prod.specs?.slice(0, 2).map((s, sIdx) => (
                      <div key={sIdx} className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span className="text-gray-400">{s.label}:</span>
                        <span className="font-semibold text-black dark:text-white truncate max-w-[140px]">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-gray-50 dark:bg-[#141618] border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <button
                  onClick={(e) => handleTogglePublish(prod, e)}
                  className="text-xs text-gray-500 hover:text-black dark:hover:text-white font-medium"
                >
                  {prod.published ? 'Unpublish' : 'Publish'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(prod)}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-gray-700 dark:text-gray-300"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(prod.id, prod.title, e)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#17191C] border border-gray-200 dark:border-[#2C2F34] rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#0B0B0B] dark:text-white">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 dark:border-[#2C2F34] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">
                  {editingProduct.id.startsWith('prod-') && !products.some(p => p.id === editingProduct.id) 
                    ? 'Add New Industrial Product' 
                    : `Edit: ${editingProduct.title || 'Product'}`}
                </h2>
                <p className="text-xs text-gray-500">
                  Updates technical specifications and public catalog presentation
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Tabs Navigation */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-gray-200 dark:border-[#2C2F34] bg-gray-50/50 dark:bg-[#141618] text-xs font-semibold overflow-x-auto">
              {[
                { id: 'basic', label: 'Basic Information' },
                { id: 'media', label: 'Media & Photo' },
                { id: 'specs', label: 'Technical Specifications' },
                { id: 'features', label: 'Engineered Features' },
                { id: 'seo', label: 'Visibility & Status' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "pb-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap",
                    activeTab === tab.id 
                      ? "border-[#0B0B0B] dark:border-[#F4FF00] text-[#0B0B0B] dark:text-[#F4FF00] font-bold" 
                      : "border-transparent text-gray-500 hover:text-black dark:hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Tab Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              
              {/* TAB 1: Basic Information */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold block mb-1">Product Title *</label>
                    <input
                      type="text"
                      value={editingProduct.title}
                      onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                      placeholder="e.g. Flat Bottom Commercial Silos"
                      className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2.5 text-xs focus:outline-none focus:border-black dark:focus:border-[#F4FF00]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold block mb-1">Category *</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2.5 text-xs focus:outline-none"
                      >
                        <option value="Silos">Silos</option>
                        <option value="Material Handling">Material Handling</option>
                        <option value="Cleaning & Processing">Cleaning & Processing</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Asset Key Link</label>
                      <input
                        type="text"
                        value={editingProduct.assetKey || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, assetKey: e.target.value })}
                        placeholder="e.g. product_flat_bottom"
                        className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2.5 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Engineering Description *</label>
                    <textarea
                      rows={4}
                      value={editingProduct.desc}
                      onChange={(e) => setEditingProduct({ ...editingProduct, desc: e.target.value })}
                      placeholder="Provide thorough engineering summary of capacity, wall stiffness, galvanization, and applications."
                      className="w-full bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs focus:outline-none focus:border-black dark:focus:border-[#F4FF00]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Media */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <ImageUploadField
                    value={editingProduct.imageUrl}
                    onChange={(url) => setEditingProduct({ ...editingProduct, imageUrl: url })}
                    label="Primary Equipment & Product Photo"
                    recommendedDimensions="1200 x 800 px (Landscape 16:9 or 4:3)"
                    aspectRatio="video"
                  />
                </div>
              )}

              {/* TAB 3: Technical Specifications */}
              {activeTab === 'specs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">Structured Technical Parameters</h3>
                      <p className="text-gray-500">Key engineering values displayed in the equipment specification sheet</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="bg-gray-100 dark:bg-white/10 hover:bg-[#F4FF00] hover:text-black px-3 py-1.5 rounded font-bold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Specification
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingProduct.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => handleUpdateSpec(sIdx, 'label', e.target.value)}
                          placeholder="Spec Name (e.g. Capacity)"
                          className="w-1/3 bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs font-mono font-bold"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleUpdateSpec(sIdx, 'value', e.target.value)}
                          placeholder="Value (e.g. 1,000 to 20,000 MT)"
                          className="flex-1 bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(sIdx)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Engineered Features */}
              {activeTab === 'features' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">Key Engineered Features</h3>
                      <p className="text-gray-500">Bullet points highlighting durability, safety, and operational advantages</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="bg-gray-100 dark:bg-white/10 hover:bg-[#F4FF00] hover:text-black px-3 py-1.5 rounded font-bold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Feature
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingProduct.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <span className="text-gray-400 font-mono">#{fIdx + 1}</span>
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleUpdateFeature(fIdx, e.target.value)}
                          placeholder="e.g. Multi-point digital temp sensor cables"
                          className="flex-1 bg-gray-50 dark:bg-[#24272B] border border-gray-300 dark:border-[#2C2F34] rounded px-3 py-2 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(fIdx)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Visibility & SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-[#24272B] rounded border border-gray-200 dark:border-[#2C2F34] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">Website Visibility Status</p>
                      <p className="text-gray-500 text-xs">
                        When published, this product is immediately available in the public catalog and quote configurator.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, published: !editingProduct.published })}
                      className={cn(
                        "px-4 py-2 font-bold text-xs rounded transition-colors",
                        editingProduct.published 
                          ? "bg-[#F4FF00] text-black" 
                          : "bg-gray-300 text-gray-800 dark:bg-white/10 dark:text-gray-300"
                      )}
                    >
                      {editingProduct.published ? 'Active / Published' : 'Draft / Hidden'}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-[#2C2F34] bg-gray-50 dark:bg-[#141618] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-white/10 rounded font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 text-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveModal}
                className="bg-[#0B0B0B] text-white hover:bg-neutral-800 dark:bg-[#F4FF00] dark:text-[#0B0B0B] px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save & Publish Product'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
