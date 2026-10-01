import { Layout } from '../components/layout';
import { motion } from 'motion/react';
import { IndustriesSection } from '@/components/home/IndustriesSection';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Industries() {
  return (
    <Layout>
      <div className="bg-[#0B0B0B] text-white pt-36 pb-16 relative overflow-hidden">
        {/* CAD Blueprint Background */}
        <div className="absolute inset-0 technical-grid pointer-events-none opacity-25" />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
          <div className="max-w-4xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#F4FF00]" />
              <span className="text-[#F4FF00] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                TARGET SECTORS & APPLICATIONS
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.98] mb-8">
              SERVED <br />
              <span className="text-[#A8AFB8]">INDUSTRIES.</span>
            </h1>
            
            <p className="text-[#A8AFB8] text-base sm:text-xl max-w-2xl leading-relaxed font-normal">
              From commercial grain aggregators and deepwater export berths to flour mills and ethanol fermenters—our infrastructure is configured for your precise commodity and throughput requirements.
            </p>
          </div>
        </div>
      </div>

      <IndustriesSection />

      {/* Standards Band */}
      <section className="bg-[#171717] py-20 text-white border-b border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="text-[#F4FF00] font-mono text-xs uppercase tracking-widest block mb-2 font-bold">
              INDUSTRY-SPECIFIC ENGINEERING
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">
              Have unique grain or flow characteristics?
            </h3>
            <p className="text-[#A8AFB8] text-sm mt-2 max-w-xl">
              We design custom friction-tested chutes, explosion-proof ATEX venting, and steep-angle cones tailored to your exact bulk material.
            </p>
          </div>
          <Link 
            to="/quote" 
            className="bg-[#F4FF00] text-[#0B0B0B] px-8 py-4 font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-2 shrink-0"
          >
            Request Sector Feasibility <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
