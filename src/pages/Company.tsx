import { Layout } from '../components/layout';
import { motion } from 'motion/react';
import { Building2, MapPin, Phone, Mail, Award, ShieldCheck, Factory, Globe2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DynamicMedia } from '@/components/DynamicMedia';

export default function Company() {
  return (
    <Layout>
      <div className="bg-[#0B0B0B] text-white pt-36 pb-24 relative overflow-hidden">
        
        {/* CAD Blueprint Background */}
        <div className="absolute inset-0 technical-grid pointer-events-none opacity-25" />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
          
          {/* Header */}
          <div className="max-w-4xl mb-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#F4FF00]" />
              <span className="text-[#F4FF00] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                ABOUT BALI GROUP SILOS
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.98] mb-8">
              BUILT FOR <br />
              <span className="text-[#A8AFB8]">GENERATIONS.</span>
            </h1>
            
            <p className="text-[#A8AFB8] text-base sm:text-xl max-w-2xl leading-relaxed font-normal">
              Bali Group is an engineering-led industrial infrastructure manufacturer specializing in turnkey grain storage, bulk handling lines, and commercial agro-processing plants.
            </p>
          </div>

          {/* Heritage & Manufacturing Facility Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-bold text-[#F4FF00] uppercase tracking-widest block">
                ENGINEERING HERITAGE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                Over 35 Years of Industrial Manufacturing
              </h2>
              <p className="text-[#A8AFB8] text-sm md:text-base leading-relaxed">
                Headquartered with dedicated manufacturing facilities in Chandigarh, India, Bali Group has engineered and commissioned commercial storage infrastructure across 40+ countries.
              </p>
              <p className="text-[#A8AFB8] text-sm md:text-base leading-relaxed">
                Our facilities utilize CNC computerized corrugated sheet roll-forming, high-tensile structural steel stamping, and automated robotic welding to ensure strict compliance with international Eurocode and ANSI engineering standards.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-[#171717] p-4 border border-white/10">
                  <span className="text-[#F4FF00] font-bold block text-lg font-mono">35+</span>
                  <span className="text-white/60">Years of Experience</span>
                </div>
                <div className="bg-[#171717] p-4 border border-white/10">
                  <span className="text-[#F4FF00] font-bold block text-lg font-mono">40+</span>
                  <span className="text-white/60">Countries Served</span>
                </div>
                <div className="bg-[#171717] p-4 border border-white/10">
                  <span className="text-white font-bold block text-lg font-mono">2,000,000+</span>
                  <span className="text-white/60">MT Installed Capacity</span>
                </div>
                <div className="bg-[#171717] p-4 border border-white/10">
                  <span className="text-white font-bold block text-lg font-mono">ISO 9001:2015</span>
                  <span className="text-white/60">Quality Certified</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative h-[420px] bg-[#171717] overflow-hidden border border-white/10 group">
              <DynamicMedia 
                assetKey="company_facility"
                fallbackUrl="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop" 
                alt="Bali Group manufacturing facility and engineering office in Chandigarh"
                className="w-full h-full object-cover filter brightness-[0.88] contrast-105"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#0B0B0B]/85 p-4 border border-white/10 flex items-center justify-between text-xs font-mono z-10">
                <span>FACILITY: CHANDIGARH INDUSTRIAL AREA</span>
                <span className="text-[#F4FF00]">OPERATIONAL HUB</span>
              </div>
            </div>
          </div>

          {/* Headquarters & Official Contact Dossier */}
          <div className="bg-[#171717] border border-white/[0.08] p-8 md:p-14 mb-24">
            <div className="border-b border-white/[0.08] pb-6 mb-10">
              <span className="text-xs font-mono font-bold text-[#F4FF00] uppercase tracking-widest block mb-2">
                OFFICIAL CORPORATE DETAILS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                Corporate Headquarters & Operations
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#F4FF00] font-mono text-xs font-bold uppercase">
                  <MapPin className="w-4 h-4" />
                  <span>Headquarters & Works</span>
                </div>
                <p className="text-white text-sm font-semibold">Bali Group Silos</p>
                <p className="text-[#A8AFB8] text-xs leading-relaxed">
                  906, Industrial Area Phase-2,<br />
                  Chandigarh, India - 160002
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#F4FF00] font-mono text-xs font-bold uppercase">
                  <Phone className="w-4 h-4" />
                  <span>Direct Technical Line</span>
                </div>
                <p className="text-white font-mono text-base font-bold">+91 88727 99999</p>
                <p className="text-[#A8AFB8] text-xs">
                  Available Mon-Sat for project consultations and technical assistance.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#F4FF00] font-mono text-xs font-bold uppercase">
                  <Mail className="w-4 h-4" />
                  <span>Engineering Desk</span>
                </div>
                <p className="text-white text-sm font-semibold">info@baligroupsilos.com</p>
                <p className="text-[#A8AFB8] text-xs">
                  For RFP submissions, civil blueprints, and technical equipment inquiries.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Project Feasibility CTA */}
          <div className="bg-[#F4FF00] text-[#0B0B0B] p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase block mb-1">
                START A PROJECT
              </span>
              <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                Partner with Bali Group
              </h3>
              <p className="text-[#0B0B0B]/80 text-sm max-w-xl mt-2 font-normal">
                Let our senior engineering team review your site parameters, soil conditions, and storage targets.
              </p>
            </div>
            
            <Link 
              to="/quote" 
              className="bg-[#0B0B0B] text-white px-8 py-4 font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-[#0B0B0B] transition-colors shrink-0 flex items-center gap-2"
            >
              Request Feasibility Study <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}
