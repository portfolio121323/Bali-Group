import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DynamicMedia } from '@/components/DynamicMedia';

export function Hero() {
  const easeCurve = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen w-full bg-[#0B0B0B] overflow-hidden flex items-center">
      
      {/* Background Image Container with Cinematic Subtle Scale */}
      <motion.div 
        initial={{ scale: 1.05, opacity: 0.8 }}
        animate={{ scale: 1.0, opacity: 1 }}
        transition={{ duration: 1.4, ease: easeCurve }}
        className="absolute inset-0 z-0"
      >
        <DynamicMedia 
          assetKey="hero_bg"
          fallbackUrl="https://images.unsplash.com/photo-1588624135540-c3d5e2197dd1?q=80&w=2940&auto=format&fit=crop"
          alt="Bali Group industrial grain storage silos and bulk handling plant"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
        />
        
        {/* Directional Industrial Gradient Overlays */}
        {/* Heavy left vignette for perfect typography legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/85 to-transparent z-10 w-full lg:w-[70%]" />
        
        {/* Subtle bottom fade to seamlessly bridge to stats band */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0B0B0B] to-transparent z-10" />

        {/* Blueprint CAD Grid Overlay at bottom right */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[350px] technical-grid opacity-[0.07] pointer-events-none z-10" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-[1440px] w-full mx-auto px-6 sm:px-8 md:px-12 pt-32 pb-20 flex flex-col justify-center">
        <div className="max-w-4xl">
          
          {/* Eyebrow */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: easeCurve }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-[2px] w-10 bg-[#F4FF00]" />
            <span className="text-[#F4FF00] font-bold tracking-[0.2em] text-xs sm:text-sm uppercase font-mono">
              GLOBAL ENGINEERING PARTNER
            </span>
            <span className="hidden sm:inline-block text-[#A8AFB8] text-xs font-mono">| ISO 9001:2015</span>
          </motion.div>
          
          {/* Headline - Revealed Line by Line */}
          <div className="overflow-hidden mb-6">
            <motion.h1 
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.25, ease: easeCurve }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[90px] xl:text-[98px] font-black text-white leading-[0.98] tracking-tight uppercase"
            >
              <span className="block text-white">ENGINEERING</span>
              <span className="block text-white">STORAGE</span>
              <span className="block text-[#A8AFB8] font-black">AT SCALE.</span>
            </motion.h1>
          </div>
          
          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: easeCurve }}
            className="text-base sm:text-lg md:text-xl text-[#A8AFB8] max-w-2xl mb-10 font-normal leading-relaxed"
          >
            Turnkey grain storage, handling and processing solutions engineered for demanding industries. Built for generations.
          </motion.p>
          
          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: easeCurve }}
            className="flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <Link 
              to="/solutions" 
              className="bg-[#F4FF00] text-[#0B0B0B] px-8 py-4 font-bold text-sm tracking-wider uppercase hover:bg-white transition-all duration-200 flex items-center gap-3 group shadow-xl shadow-[#F4FF00]/10"
            >
              Explore Solutions
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/quote" 
              className="text-white border border-white/25 px-8 py-4 font-bold text-sm tracking-wider uppercase hover:bg-white/10 hover:border-white transition-all duration-200 flex items-center gap-2 group"
            >
              Start Your Project
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#F4FF00]" />
            </Link>
          </motion.div>

          {/* Quick Technical Specs Badge Band */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-14 pt-8 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl text-xs font-mono text-[#A8AFB8]"
          >
            <div>
              <span className="text-[#F4FF00] font-bold block text-sm">Z600 / 450g/m²</span>
              <span>Galvanized Steel</span>
            </div>
            <div>
              <span className="text-white font-bold block text-sm">Up to 20,000 MT</span>
              <span>Individual Silo Bin</span>
            </div>
            <div>
              <span className="text-white font-bold block text-sm">1,000 TPH</span>
              <span>Conveying Rate</span>
            </div>
            <div>
              <span className="text-white font-bold block text-sm">Turnkey EPC</span>
              <span>Design to Handover</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Subtle Bottom Architectural Corner Detail */}
      <div className="absolute bottom-6 right-8 hidden lg:flex items-center gap-3 text-[11px] font-mono text-white/40 tracking-wider">
        <span>LOC // CHANDIGARH • GLOBAL OPERATIONS</span>
        <div className="w-2 h-2 bg-[#F4FF00] animate-pulse" />
      </div>

    </section>
  );
}
