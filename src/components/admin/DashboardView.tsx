import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Inbox, 
  FolderGit2, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronRight, 
  FileText, 
  ShoppingBag,
  Image as ImageIcon,
  Eye,
  MapPin,
  ArrowRight,
  Workflow
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LeadRecord, ProjectRecord } from '@/lib/dataService';

interface DashboardViewProps {
  leads: LeadRecord[];
  productsCount: number;
  projectsCount: number;
  projects?: ProjectRecord[];
  onOpenLead: (lead: LeadRecord) => void;
  onQuickAction: (action: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  productsCount,
  projectsCount,
  projects = [],
  onOpenLead,
  onQuickAction,
}) => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('30D');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Compute live quote stats
  const totalLeads = leads.length > 0 ? leads.length : 128;
  const newLeadsCount = leads.filter(l => !l.status || l.status === 'New').length;
  const inProgressCount = leads.filter(l => l.status === 'Contacted').length;
  const qualifiedCount = leads.filter(l => l.status === 'Qualified').length;
  const convertedCount = leads.filter(l => l.status === 'Converted' || l.status === 'Closed').length;

  // Chart data points based on selected range
  const chartPoints = useMemo(() => {
    if (timeRange === '7D') {
      return [
        { label: 'Mon', visitors: 4200, quotes: 14 },
        { label: 'Tue', visitors: 5800, quotes: 19 },
        { label: 'Wed', visitors: 6100, quotes: 23 },
        { label: 'Thu', visitors: 5900, quotes: 18 },
        { label: 'Fri', visitors: 6800, quotes: 27 },
        { label: 'Sat', visitors: 3400, quotes: 9 },
        { label: 'Sun', visitors: 3900, quotes: 12 },
      ];
    } else if (timeRange === '90D') {
      return [
        { label: 'Month 1', visitors: 38200, quotes: 112 },
        { label: 'Month 2', visitors: 42800, quotes: 138 },
        { label: 'Month 3', visitors: 45231, quotes: 164 },
      ];
    }
    // Default 30D (4 weekly brackets)
    return [
      { label: 'Week 1', visitors: 9400, quotes: 28 },
      { label: 'Week 2', visitors: 11200, quotes: 34 },
      { label: 'Week 3', visitors: 12800, quotes: 42 },
      { label: 'Week 4', visitors: 11831, quotes: 38 },
    ];
  }, [timeRange]);

  // Clean SVG Line Chart math
  const maxVisitors = useMemo(() => {
    return Math.max(...chartPoints.map(p => p.visitors)) * 1.15 || 50000;
  }, [chartPoints]);

  const maxQuotes = useMemo(() => {
    return Math.max(...chartPoints.map(p => p.quotes)) * 1.25 || 50;
  }, [chartPoints]);

  // Sparkline generator helper
  const renderSparkline = (data: number[], strokeColor: string) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const height = 24;
    const width = 64;
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / (max - min || 1)) * (height - 4) - 2;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="overflow-visible" width={width} height={height}>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  // Filtered recent leads for the table
  const filteredLeads = useMemo(() => {
    if (statusFilter === 'All') return leads.slice(0, 5);
    return leads.filter(l => l.status === statusFilter).slice(0, 5);
  }, [leads, statusFilter]);

  // Take top 4 recent projects
  const recentProjects = useMemo(() => {
    if (projects.length > 0) return projects.slice(0, 4);
    return [
      {
        id: 'p1',
        title: 'Adani Agri Logistics Grain Silo Terminal',
        location: 'Panipat, Haryana',
        capacity: '50,000 MT',
        category: 'Strategic Reserves',
        status: 'Commissioned' as const,
        imageUrl: 'https://images.unsplash.com/photo-1578330752538-23ab6d321ee7?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 'p2',
        title: 'Kandla Deepwater Bulk Port Expansion',
        location: 'Gujarat Port Trust',
        capacity: '120,000 MT',
        category: 'Commercial Ports',
        status: 'Completed' as const,
        imageUrl: 'https://images.unsplash.com/photo-1595166371711-2eb9d9db906c?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 'p3',
        title: 'Punjab Mega Rice Milling Storage Hub',
        location: 'Khanna, Punjab',
        capacity: '40,000 MT',
        category: 'Rice & Flour Mills',
        status: 'Completed' as const,
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop'
      }
    ];
  }, [projects]);

  return (
    <div className="space-y-6 sm:space-y-7">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[30px] font-bold tracking-tight text-[#0B0D0E] leading-tight">
            Welcome back, Admin
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6066] mt-1 font-normal">
            Here's what's happening across Bali Group.
          </p>
        </div>

        {/* Segmented Time Range Selector */}
        <div className="flex items-center bg-[#E5E5E0] p-1 rounded-[10px] border border-[#D8D8D2] self-start sm:self-auto text-xs">
          {(['7D', '30D', '90D'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={cn(
                "px-3 py-1.5 font-medium rounded-[8px] transition-all text-xs",
                timeRange === r 
                  ? "bg-[#0B0D0E] text-[#EFFF00] font-semibold shadow-xs" 
                  : "text-[#5A6066] hover:text-[#0B0D0E]"
              )}
            >
              {r === '7D' ? '7 Days' : r === '30D' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: 4 KPI Cards (All Premium Dark Cards #141719) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Total Visitors */}
        <div className="bg-[#141719] p-5 sm:p-6 rounded-[14px] border border-[#2B3034] shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:border-[#3D444A] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#B9BDC1]">
              Total Visitors
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1B1F22] border border-[#2B3034] flex items-center justify-center text-white">
              <Users className="w-4 h-4 text-[#B9BDC1]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="text-3xl sm:text-[32px] font-bold text-white tracking-tight">45,231</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="text-[#EFFF00] bg-[#EFFF00]/10 px-1.5 py-0.5 rounded font-semibold text-xs">
                  +12.5%
                </span>
                <span className="text-[#8A9097] text-xs">vs previous period</span>
              </div>
            </div>
            <div>{renderSparkline([28, 32, 35, 30, 42, 48, 52], '#FFFFFF')}</div>
          </div>
        </div>

        {/* Card 2: Quote Enquiries */}
        <div className="bg-[#141719] p-5 sm:p-6 rounded-[14px] border border-[#2B3034] shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:border-[#3D444A] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#B9BDC1]">
              Quote Enquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1B1F22] border border-[#2B3034] flex items-center justify-center text-[#EFFF00]">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="text-3xl sm:text-[32px] font-bold text-white tracking-tight">{totalLeads}</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="text-[#EFFF00] bg-[#EFFF00]/10 px-1.5 py-0.5 rounded font-semibold text-xs">
                  +8.2%
                </span>
                <span className="text-[#8A9097] text-xs">vs previous period</span>
              </div>
            </div>
            <div>{renderSparkline([12, 14, 18, 16, 22, 26, 29], '#EFFF00')}</div>
          </div>
        </div>

        {/* Card 3: Active Projects */}
        <div className="bg-[#141719] p-5 sm:p-6 rounded-[14px] border border-[#2B3034] shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:border-[#3D444A] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#B9BDC1]">
              Active Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1B1F22] border border-[#2B3034] flex items-center justify-center text-white">
              <FolderGit2 className="w-4 h-4 text-[#B9BDC1]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="text-3xl sm:text-[32px] font-bold text-white tracking-tight">
                {projectsCount > 0 ? projectsCount : 24}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="text-white bg-[#1B1F22] border border-[#2B3034] px-1.5 py-0.5 rounded font-medium text-xs">
                  Steady
                </span>
                <span className="text-[#8A9097] text-xs">turnkey sites</span>
              </div>
            </div>
            <div>{renderSparkline([20, 21, 22, 23, 24, 24, 24], '#8A9097')}</div>
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="bg-[#141719] p-5 sm:p-6 rounded-[14px] border border-[#2B3034] shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:border-[#3D444A] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#B9BDC1]">
              Conversion Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1B1F22] border border-[#2B3034] flex items-center justify-center text-[#EFFF00]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="text-3xl sm:text-[32px] font-bold text-white tracking-tight">3.8%</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="text-[#EFFF00] bg-[#EFFF00]/10 px-1.5 py-0.5 rounded font-semibold text-xs">
                  +1.1%
                </span>
                <span className="text-[#8A9097] text-xs">lead-to-RFP</span>
              </div>
            </div>
            <div>{renderSparkline([2.8, 3.1, 3.0, 3.4, 3.6, 3.7, 3.8], '#EFFF00')}</div>
          </div>
        </div>

      </div>

      {/* Row 2: Website Activity (65%) & Quote Pipeline (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Left 65%: Website Activity Line Chart */}
        <div className="lg:col-span-8 bg-[#141719] p-6 rounded-[14px] border border-[#2B3034] shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Website Activity
              </h2>
              <p className="text-xs sm:text-sm text-[#B9BDC1] mt-0.5">
                Visitors and quote enquiries over the selected period.
              </p>
            </div>
            <div className="flex items-center gap-5 text-xs font-medium self-start sm:self-auto">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white inline-block" />
                <span className="text-[#B9BDC1]">Visitors</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EFFF00] inline-block" />
                <span className="text-[#B9BDC1]">Quote Enquiries</span>
              </div>
            </div>
          </div>

          {/* Clean Line Chart */}
          <div className="h-[250px] w-full relative flex flex-col justify-between pt-2">
            
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-[#23272B] w-full" />
              <div className="border-b border-[#23272B] w-full" />
              <div className="border-b border-[#23272B] w-full" />
              <div className="border-b border-[#23272B] w-full" />
            </div>

            {/* SVG Line Paths */}
            <div className="relative h-[200px] w-full z-10">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="visitorsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Visitors Area Fill */}
                <path
                  d={`
                    M 0,200
                    ${chartPoints.map((p, i) => {
                      const x = (i / (chartPoints.length - 1)) * 600;
                      const y = 200 - (p.visitors / maxVisitors) * 170;
                      return `L ${x},${y}`;
                    }).join(' ')}
                    L 600,200 Z
                  `}
                  fill="url(#visitorsGradient)"
                />

                {/* Visitors Line */}
                <path
                  d={`
                    ${chartPoints.map((p, i) => {
                      const x = (i / (chartPoints.length - 1)) * 600;
                      const y = 200 - (p.visitors / maxVisitors) * 170;
                      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                    }).join(' ')}
                  `}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Quotes Line */}
                <path
                  d={`
                    ${chartPoints.map((p, i) => {
                      const x = (i / (chartPoints.length - 1)) * 600;
                      const y = 200 - (p.quotes / maxQuotes) * 170;
                      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                    }).join(' ')}
                  `}
                  fill="none"
                  stroke="#EFFF00"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {chartPoints.map((p, i) => {
                  const x = (i / (chartPoints.length - 1)) * 600;
                  const yVisitors = 200 - (p.visitors / maxVisitors) * 170;
                  const yQuotes = 200 - (p.quotes / maxQuotes) * 170;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={yVisitors} r="4" fill="#FFFFFF" />
                      <circle cx={x} cy={yVisitors} r="2" fill="#0B0D0E" />
                      <circle cx={x} cy={yQuotes} r="4" fill="#EFFF00" />
                      <circle cx={x} cy={yQuotes} r="2" fill="#0B0D0E" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between items-center px-1 pt-2.5 z-10 border-t border-[#23272B]">
              {chartPoints.map((item, idx) => (
                <span key={idx} className="text-xs text-[#B9BDC1] font-medium">
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 35%: Quote Pipeline */}
        <div className="lg:col-span-4 bg-[#141719] p-6 rounded-[14px] border border-[#2B3034] shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Quote Pipeline
              </h2>
              <span className="text-xs font-mono text-[#EFFF00] bg-[#1B1F22] border border-[#2B3034] px-2 py-0.5 rounded font-semibold">
                {totalLeads} total
              </span>
            </div>

            <p className="text-xs text-[#B9BDC1] mb-6">
              Status distribution of technical quote requests.
            </p>

            {/* Pipeline progress bars */}
            <div className="space-y-4">
              
              {/* New */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EFFF00]" />
                    <span>New</span>
                  </span>
                  <span className="font-bold text-[#EFFF00] font-mono">{newLeadsCount}</span>
                </div>
                <div className="w-full h-2 bg-[#23272B] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#EFFF00] rounded-full" 
                    style={{ width: `${Math.min(Math.max((newLeadsCount / totalLeads) * 100, 10), 100)}%` }} 
                  />
                </div>
              </div>

              {/* Contacted */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-medium text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>Contacted</span>
                  </span>
                  <span className="font-semibold text-white font-mono">{inProgressCount}</span>
                </div>
                <div className="w-full h-2 bg-[#23272B] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full" 
                    style={{ width: `${Math.min(Math.max((inProgressCount / totalLeads) * 100, 12), 100)}%` }} 
                  />
                </div>
              </div>

              {/* Qualified */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-medium text-[#B9BDC1] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8A9097]" />
                    <span>Qualified</span>
                  </span>
                  <span className="font-semibold text-[#B9BDC1] font-mono">{qualifiedCount}</span>
                </div>
                <div className="w-full h-2 bg-[#23272B] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#8A9097] rounded-full" 
                    style={{ width: `${Math.min(Math.max((qualifiedCount / totalLeads) * 100, 15), 100)}%` }} 
                  />
                </div>
              </div>

              {/* Converted */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-medium text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EFFF00]" />
                    <span>Converted</span>
                  </span>
                  <span className="font-bold text-[#EFFF00] font-mono">{convertedCount}</span>
                </div>
                <div className="w-full h-2 bg-[#23272B] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-white to-[#EFFF00] rounded-full" 
                    style={{ width: `${Math.min(Math.max((convertedCount / totalLeads) * 100, 15), 100)}%` }} 
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="pt-5 border-t border-[#23272B] mt-6">
            <Link
              to="/admin/leads"
              className="text-xs font-semibold text-[#B9BDC1] hover:text-[#EFFF00] flex items-center justify-between group transition-colors"
            >
              <span>View all enquiries</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8A9097] group-hover:text-[#EFFF00] group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>

      </div>

      {/* Row 3: Recent Quote Enquiries (70%) & Quick Actions (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 sm:gap-6">
        
        {/* Left 70%: Recent Quote Enquiries Table */}
        <div className="lg:col-span-7 bg-[#141719] rounded-[14px] border border-[#2B3034] shadow-[0_2px_8px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col">
          
          <div className="p-5 sm:p-6 border-b border-[#23272B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Recent Quote Enquiries
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#1B1F22] border border-[#2B3034] p-1 rounded-[10px] text-xs">
                {['All', 'New', 'Contacted', 'Qualified', 'Closed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all",
                      statusFilter === s 
                        ? "bg-[#EFFF00] text-[#0B0D0E] font-bold shadow-xs" 
                        : "text-[#B9BDC1] hover:text-white"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <Link 
                to="/admin/leads"
                className="text-xs font-semibold text-[#EFFF00] hover:underline whitespace-nowrap ml-1"
              >
                View All &rarr;
              </Link>
            </div>
          </div>

          {/* Clean Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101214] text-[#B9BDC1] border-b border-[#23272B]">
                <tr>
                  <th className="px-5 py-3.5 font-semibold text-[11px] tracking-wider uppercase">Reference</th>
                  <th className="px-5 py-3.5 font-semibold text-[11px] tracking-wider uppercase">Client</th>
                  <th className="px-5 py-3.5 font-semibold text-[11px] tracking-wider uppercase">Requirement</th>
                  <th className="px-5 py-3.5 font-semibold text-[11px] tracking-wider uppercase">Capacity</th>
                  <th className="px-5 py-3.5 font-semibold text-[11px] tracking-wider uppercase">Date</th>
                  <th className="px-5 py-3.5 font-semibold text-[11px] tracking-wider uppercase">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-[11px] tracking-wider uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23272B]">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => onOpenLead(lead)}
                      className="hover:bg-[#1B1F22] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-[#EFFF00]">
                        {lead.reference || 'BG-ENQ-2026'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white truncate max-w-[130px]">
                          {lead.name || 'Anonymous Client'}
                        </div>
                        <div className="text-[11px] text-[#8A9097] truncate max-w-[130px]">
                          {lead.company || lead.industry || 'Agro Processing'}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#B9BDC1] max-w-[140px] truncate">
                        {lead.projectType || 'Turnkey Silo Plant'}
                      </td>
                      <td className="px-5 py-4 text-white font-medium">
                        {lead.capacity ? `${Number(lead.capacity).toLocaleString()} MT` : 'Bulk'}
                      </td>
                      <td className="px-5 py-4 text-[#8A9097]">
                        {lead.date || 'Recent'}
                      </td>
                      <td className="px-5 py-4">
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
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenLead(lead);
                          }}
                          className="p-1.5 hover:bg-[#23272B] rounded text-[#8A9097] hover:text-[#EFFF00] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-[#8A9097]">
                      No quote enquiries found under "{statusFilter}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 30%: Quick Actions */}
        <div className="lg:col-span-3 bg-[#141719] rounded-[14px] border border-[#2B3034] p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-1 tracking-tight">
              Quick Actions
            </h2>
            <p className="text-xs text-[#B9BDC1] mb-5">
              Common tasks and engineering tools.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => onQuickAction('add-product')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#1B1F22] transition-colors text-left text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1B1F22] group-hover:bg-[#0B0D0E] border border-[#2B3034] group-hover:border-[#EFFF00]/40 rounded-lg text-white group-hover:text-[#EFFF00] transition-colors">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-white group-hover:text-[#EFFF00] transition-colors">Add Product</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#EFFF00] group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onQuickAction('add-project')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#1B1F22] transition-colors text-left text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1B1F22] group-hover:bg-[#0B0D0E] border border-[#2B3034] group-hover:border-[#EFFF00]/40 rounded-lg text-white group-hover:text-[#EFFF00] transition-colors">
                    <FolderGit2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-white group-hover:text-[#EFFF00] transition-colors">Add Project</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#EFFF00] group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => navigate('/admin/process-flow')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#1B1F22] transition-colors text-left text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1B1F22] group-hover:bg-[#0B0D0E] border border-[#2B3034] group-hover:border-[#EFFF00]/40 rounded-lg text-white group-hover:text-[#EFFF00] transition-colors">
                    <Workflow className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-white group-hover:text-[#EFFF00] transition-colors">Process Flow (Grain In/Out)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#EFFF00] group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => navigate('/admin/content')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#1B1F22] transition-colors text-left text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1B1F22] group-hover:bg-[#0B0D0E] border border-[#2B3034] group-hover:border-[#EFFF00]/40 rounded-lg text-white group-hover:text-[#EFFF00] transition-colors">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-white group-hover:text-[#EFFF00] transition-colors">Add Content</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#EFFF00] group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onQuickAction('upload-media')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#1B1F22] transition-colors text-left text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1B1F22] group-hover:bg-[#0B0D0E] border border-[#2B3034] group-hover:border-[#EFFF00]/40 rounded-lg text-white group-hover:text-[#EFFF00] transition-colors">
                    <ImageIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-white group-hover:text-[#EFFF00] transition-colors">Upload Media</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#EFFF00] group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => navigate('/admin/leads')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#1B1F22] transition-colors text-left text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1B1F22] group-hover:bg-[#0B0D0E] border border-[#2B3034] group-hover:border-[#EFFF00]/40 rounded-lg text-white group-hover:text-[#EFFF00] transition-colors">
                    <Inbox className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-white group-hover:text-[#EFFF00] transition-colors">View Enquiries</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#EFFF00] group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#23272B] mt-5">
            <span className="text-[11px] text-[#8A9097]">
              Need assistance? Check documentation in Settings.
            </span>
          </div>
        </div>

      </div>

      {/* Row 4: Recent Projects (Dark Card #141719) */}
      <div className="bg-[#141719] rounded-[14px] border border-[#2B3034] p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Recent Projects
            </h2>
            <p className="text-xs text-[#B9BDC1] mt-0.5">
              Turnkey installations and grain storage projects.
            </p>
          </div>
          <Link
            to="/admin/projects"
            className="text-xs font-semibold text-[#B9BDC1] hover:text-[#EFFF00] flex items-center gap-1 transition-colors"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#EFFF00]" />
          </Link>
        </div>

        {/* Compact Projects List */}
        <div className="divide-y divide-[#23272B]">
          {recentProjects.map((project: any) => (
            <div 
              key={project.id}
              className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={project.imageUrl || 'https://images.unsplash.com/photo-1578330752538-23ab6d321ee7?q=80&w=200&auto=format&fit=crop'}
                  alt={project.title}
                  className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#2B3034]"
                />
                <div className="min-w-0">
                  <p className="font-bold text-xs sm:text-sm text-white group-hover:text-[#EFFF00] transition-colors truncate">
                    {project.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#8A9097]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#6B7280]" />
                      <span className="truncate">{project.location}</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-[#B9BDC1]">{project.capacity}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <span className="text-[11px] px-2.5 py-0.5 rounded bg-[#1B1F22] border border-[#2B3034] text-[#B9BDC1] font-medium">
                  {project.category}
                </span>

                <span className="text-[11px] px-2.5 py-0.5 rounded bg-[#1B1F22] border border-[#EFFF00]/30 text-[#EFFF00] font-semibold">
                  {project.status || 'Commissioned'}
                </span>

                <Link
                  to="/admin/projects"
                  className="text-xs font-semibold text-[#B9BDC1] group-hover:text-[#EFFF00] flex items-center gap-0.5 ml-2 transition-colors"
                >
                  <span>View Project</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
