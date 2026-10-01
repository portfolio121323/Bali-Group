import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAssets } from '@/lib/contexts/AssetsContext';
import { 
  ProductRecord, 
  ProjectRecord, 
  LeadRecord, 
  INITIAL_PRODUCTS, 
  INITIAL_PROJECTS 
} from '@/lib/dataService';

import { AdminToastProvider, useAdminToast } from '@/components/admin/AdminToast';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardView } from '@/components/admin/DashboardView';
import { ProductsView } from '@/components/admin/ProductsView';
import { ProjectsView } from '@/components/admin/ProjectsView';
import { LeadsView } from '@/components/admin/LeadsView';
import { ContentView } from '@/components/admin/ContentView';
import { ProcessFlowView } from '@/components/admin/ProcessFlowView';
import { MediaView } from '@/components/admin/MediaView';
import { TeamView } from '@/components/admin/TeamView';
import { SettingsView } from '@/components/admin/SettingsView';

function AdminContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { assets } = useAssets();
  const { toast } = useAdminToast();

  // Core Data States
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>(() => {
    const cached = localStorage.getItem('bali_admin_products');
    return cached ? JSON.parse(cached) : INITIAL_PRODUCTS;
  });
  const [projects, setProjects] = useState<ProjectRecord[]>(() => {
    const cached = localStorage.getItem('bali_admin_projects');
    return cached ? JSON.parse(cached) : INITIAL_PROJECTS;
  });

  // Selected lead for drawer view
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

  // 1. Subscribe to Firestore `leads`
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched: LeadRecord[] = snapshot.docs.map((d) => {
          const data = d.data();
          const dateStr = data.createdAt?.toDate 
            ? new Date(data.createdAt.toDate()).toLocaleDateString()
            : (data.date || 'Recent');

          return {
            id: d.id,
            reference: data.reference || `BG-ENQ-${d.id.slice(0, 4).toUpperCase()}`,
            name: data.name || '',
            company: data.company || '',
            email: data.email || '',
            phone: data.phone || '',
            industry: data.industry || 'Agricultural Storage',
            projectType: data.projectType || 'Turnkey Silo Plant',
            capacity: data.capacity || '',
            material: data.material || 'Grain / Cereals',
            notes: data.notes || '',
            status: data.status || 'New',
            assignedTo: data.assignedTo || 'Technical EPC Desk',
            internalNotes: data.internalNotes || [],
            date: dateStr,
            createdAt: data.createdAt,
          };
        });

        if (fetched.length > 0) {
          setLeads(fetched);
        } else {
          // Default sample leads if database is brand new
          setLeads([
            {
              id: 'sample-1',
              reference: 'BG-ENQ-2026-089',
              name: 'Vikramjit Singh',
              company: 'Punjab Mega Agro Mills',
              email: 'procurement@punjabagro.in',
              phone: '+91 98140 22334',
              industry: 'Rice & Flour Mills',
              projectType: 'Commercial Rice Mill Storage',
              capacity: '40000',
              material: 'Paddy',
              notes: 'Looking for 8x 5000 MT hopper bottom silos with pre-cleaning drum and 250 TPH bucket elevators.',
              status: 'Qualified',
              assignedTo: 'Amanpreet Sharma',
              internalNotes: ['24/09/2026 - Structural feasibility team shared civil foundation specifications.'],
              date: 'Today',
            },
            {
              id: 'sample-2',
              reference: 'BG-ENQ-2026-088',
              name: 'Al-Mansoor Logistics LLC',
              company: 'Jebel Ali Marine Terminal',
              email: 'epc@almansoorgroup.ae',
              phone: '+971 4 883 9920',
              industry: 'Commercial Ports',
              projectType: 'Deepwater Marine Port Expansion',
              capacity: '120000',
              material: 'Wheat & Barley',
              notes: 'Expansion tender for 12x 10,000 MT flat bottom silos with 1,000 TPH marine intake.',
              status: 'Contacted',
              assignedTo: 'Baldev Singh Bali',
              internalNotes: ['22/09/2026 - Sent technical compliance documentation for Z600 galvanizing.'],
              date: 'Yesterday',
            },
            {
              id: 'sample-3',
              reference: 'BG-ENQ-2026-087',
              name: 'Carlos Oliveira',
              company: 'AgroBio Distillers S.A.',
              email: 'carlos@agrobio.com.br',
              phone: '+55 65 3901-4400',
              industry: 'Ethanol & Distilleries',
              projectType: 'Ethanol Corn Storage Facility',
              capacity: '80000',
              material: 'Maize / Corn',
              notes: 'Feed supply for 600,000 liter/day distillery.',
              status: 'New',
              assignedTo: 'Technical EPC Desk',
              internalNotes: [],
              date: '2 days ago',
            }
          ]);
        }
      }, (error) => {
        console.warn("Leads snapshot error:", error);
      });

      return () => {
        try {
          unsubscribe();
        } catch (_) {}
      };
    } catch (e) {
      console.warn("Failed to attach leads listener:", e);
    }
  }, []);

  // 2. Subscribe to Firestore `products`
  useEffect(() => {
    if (!db) return;
    try {
      const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const fetched: ProductRecord[] = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
          } as ProductRecord));
          setProducts(fetched);
          localStorage.setItem('bali_admin_products', JSON.stringify(fetched));
        } else {
          // Seed initial products to Firestore so public website & admin share database
          INITIAL_PRODUCTS.forEach(async (p) => {
            try {
              await setDoc(doc(db, 'products', p.id), {
                ...p,
                updatedAt: serverTimestamp(),
              });
            } catch (e) {
              console.error(e);
            }
          });
        }
      }, (error) => {
        console.warn("Products snapshot error:", error);
      });

      return () => {
        try {
          unsubscribe();
        } catch (_) {}
      };
    } catch (e) {
      console.warn("Failed to attach products listener:", e);
    }
  }, []);

  // 3. Subscribe to Firestore `projects`
  useEffect(() => {
    if (!db) return;
    try {
      const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
        if (!snapshot.empty) {
          const fetched: ProjectRecord[] = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
          } as ProjectRecord));
          setProjects(fetched);
          localStorage.setItem('bali_admin_projects', JSON.stringify(fetched));
        } else {
          // Seed initial projects to Firestore
          INITIAL_PROJECTS.forEach(async (p) => {
            try {
              await setDoc(doc(db, 'projects', p.id), {
                ...p,
                updatedAt: serverTimestamp(),
              });
            } catch (e) {
              console.error(e);
            }
          });
        }
      }, (error) => {
        console.warn("Projects snapshot error:", error);
      });

      return () => {
        try {
          unsubscribe();
        } catch (_) {}
      };
    } catch (e) {
      console.warn("Failed to attach projects listener:", e);
    }
  }, []);

  // Handlers for Products
  const handleSaveProduct = async (product: ProductRecord) => {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, {
      ...product,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Bidirectional sync to site_assets so all website destinations referencing this assetKey update immediately
    if (product.assetKey && product.imageUrl) {
      try {
        await setDoc(doc(db, 'site_assets', product.assetKey), {
          url: product.imageUrl,
          alt: product.title,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.warn('Failed to sync product to site_assets:', err);
      }
    }

    // Local optimistic update
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = product;
        return copy;
      }
      return [product, ...prev];
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, 'products', productId));
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Handlers for Projects
  const handleSaveProject = async (project: ProjectRecord) => {
    const docRef = doc(db, 'projects', project.id);
    await setDoc(docRef, {
      ...project,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Bidirectional sync to site_assets so all website destinations referencing this assetKey update immediately
    if (project.assetKey && project.imageUrl) {
      try {
        await setDoc(doc(db, 'site_assets', project.assetKey), {
          url: project.imageUrl,
          alt: project.title,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.warn('Failed to sync project to site_assets:', err);
      }
    }

    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === project.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = project;
        return copy;
      }
      return [project, ...prev];
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteDoc(doc(db, 'projects', projectId));
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  // Handlers for Leads
  const handleUpdateLeadStatus = async (leadId: string, status: LeadRecord['status'], note?: string) => {
    const leadRef = doc(db, 'leads', leadId);
    const leadObj = leads.find(l => l.id === leadId);

    const updatePayload: any = { status };
    if (note) {
      const existing = leadObj?.internalNotes || [];
      updatePayload.internalNotes = [...existing, `${new Date().toLocaleDateString()} - ${note}`];
    }

    try {
      await updateDoc(leadRef, updatePayload);
    } catch (e) {
      // If doc only exists locally (fallback sample), update local state
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updatePayload } : l));
    }
  };

  // Command palette and quick action handler
  const handleQuickAction = (action: string) => {
    if (action === 'add-product') {
      navigate('/admin/products');
      setTimeout(() => {
        const addBtn = document.querySelector('button:has(.lucide-plus)') as HTMLButtonElement;
        addBtn?.click();
      }, 100);
    } else if (action === 'add-project') {
      navigate('/admin/projects');
      setTimeout(() => {
        const addBtn = document.querySelector('button:has(.lucide-plus)') as HTMLButtonElement;
        addBtn?.click();
      }, 100);
    } else if (action === 'upload-media') {
      navigate('/admin/media');
    } else if (action === 'export-leads') {
      navigate('/admin/leads');
      setTimeout(() => {
        const exportBtn = document.querySelector('button:has(.lucide-download)') as HTMLButtonElement;
        exportBtn?.click();
      }, 100);
    }
  };

  // Route Dispatcher
  const renderCurrentView = () => {
    const path = location.pathname;

    if (path === '/admin') {
      return (
        <DashboardView
          leads={leads}
          productsCount={products.length}
          projectsCount={projects.length}
          onOpenLead={(lead) => {
            setSelectedLead(lead);
            navigate('/admin/leads');
          }}
          onQuickAction={handleQuickAction}
        />
      );
    }

    if (path === '/admin/products') {
      return (
        <ProductsView
          products={products}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          mediaAssets={assets}
        />
      );
    }

    if (path === '/admin/projects') {
      return (
        <ProjectsView
          projects={projects}
          onSaveProject={handleSaveProject}
          onDeleteProject={handleDeleteProject}
        />
      );
    }

    if (path === '/admin/leads') {
      return (
        <LeadsView
          leads={leads}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          selectedLead={selectedLead}
          onSelectLead={setSelectedLead}
        />
      );
    }

    if (path === '/admin/content') {
      return <ContentView />;
    }

    if (path === '/admin/process-flow') {
      return <ProcessFlowView />;
    }

    if (path === '/admin/media') {
      return <MediaView />;
    }

    if (path === '/admin/team') {
      return <TeamView />;
    }

    if (path === '/admin/settings') {
      return <SettingsView />;
    }

    // Default fallback
    return (
      <DashboardView
        leads={leads}
        productsCount={products.length}
        projectsCount={projects.length}
        projects={projects}
        onOpenLead={(lead) => {
          setSelectedLead(lead);
          navigate('/admin/leads');
        }}
        onQuickAction={handleQuickAction}
      />
    );
  };

  return (
    <AdminLayout
      leads={leads}
      products={products}
      projects={projects}
      onQuickAction={handleQuickAction}
    >
      {renderCurrentView()}
    </AdminLayout>
  );
}

export default function AdminDashboard() {
  return (
    <AdminToastProvider>
      <AdminContent />
    </AdminToastProvider>
  );
}
