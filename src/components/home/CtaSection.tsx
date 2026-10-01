import { motion } from 'motion/react';
import { ArrowRight, PhoneCall, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CtaSection() {
  return (
    <section className="bg-[#F4FF00] py-24 md:py-32 relative overflow-hidden border-b-2 border-[#0B0B0B]">
      
      {/* Background Architectural Watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-black text-[180px] lg:text-[260px] text-[#0B0B0B]/[0.04] pointer-events-none select-none tracking-tighter leading-none hidden md:block">
        BALI
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
        <div className="max-w-4xl">
          
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[2px] w-10 bg-[#0B0B0B]" />
            <span className="text-[#0B0B0B] font-bold tracking-[0.2em] text-xs uppercase font-mono">
              PROJECT CONSULTATION & EPC INQUIRY
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#0B0B0B] uppercase tracking-tight leading-[0.98] mb-8">
            PLANNING YOUR NEXT <br />
            GRAIN STORAGE PROJECT?
          </h2>

          <p className="text-[#0B0B0B]/80 text-lg md:text-xl max-w-2xl mb-12 font-normal leading-relaxed">
            Talk directly to our engineering team about capacity sizing, site topography, handling requirements, and project configuration. Built for generations.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link 
              to="/quote" 
              className="bg-[#0B0B0B] text-white px-8 py-4 font-bold text-sm tracking-wider uppercase hover:bg-white hover:text-[#0B0B0B] transition-all duration-200 flex items-center gap-3 group shadow-xl"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              to="/quote" 
              className="bg-transparent border-2 border-[#0B0B0B] text-[#0B0B0B] px-8 py-3.5 font-bold text-sm tracking-wider uppercase hover:bg-[#0B0B0B] hover:text-white transition-all duration-200 flex items-center gap-3 group"
            >
              <PhoneCall className="w-4 h-4" />
              Talk to an Expert
            </Link>
          </div>

          {/* Quick Contact Line */}
          <div className="mt-14 pt-8 border-t border-[#0B0B0B]/15 flex flex-wrap items-center gap-8 text-xs font-mono text-[#0B0B0B]">
            <div>
              <span className="opacity-70 block">Direct Engineering Line</span>
              <span className="font-bold text-sm">+91 88727 99999</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-[#0B0B0B]/20" />
            <div>
              <span className="opacity-70 block">Technical Desk Email</span>
              <span className="font-bold text-sm">info@baligroupsilos.com</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-[#0B0B0B]/20" />
            <div>
              <span className="opacity-70 block">Headquarters & Plant</span>
              <span className="font-bold text-sm">Chandigarh, India</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
