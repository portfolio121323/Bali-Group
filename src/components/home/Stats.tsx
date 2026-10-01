import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const STATS = [
  { 
    value: '35+', 
    label: 'Years of Experience',
    subtext: 'Engineering & EPC execution'
  },
  { 
    value: '2M+', 
    label: 'Tonnes Installed Capacity',
    subtext: 'Across global industrial facilities'
  },
  { 
    value: '40+', 
    label: 'Countries Served',
    subtext: 'Worldwide commissioning footprint'
  },
  { 
    value: '500+', 
    label: 'Projects Completed',
    subtext: 'Turnkey storage & handling plants'
  },
];

function StatItem({ stat, index }: { stat: typeof STATS[0]; index: number; key?: React.Key }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div 
      ref={ref} 
      className={`flex flex-col justify-between py-2 ${
        index !== 0 ? 'lg:border-l lg:border-[#0B0B0B]/15 lg:pl-10' : ''
      }`}
    >
      <div>
        <div className="overflow-hidden">
          {isInView ? (
            <motion.div
              initial={{ y: 35, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0B0B0B] tracking-tighter leading-none mb-2 font-mono"
            >
              {stat.value}
            </motion.div>
          ) : (
            <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent tracking-tighter leading-none mb-2">
              {stat.value}
            </div>
          )}
        </div>
        
        <h3 className="text-[#0B0B0B] font-bold text-xs sm:text-sm tracking-wider uppercase leading-snug">
          {stat.label}
        </h3>
      </div>

      <p className="text-[#0B0B0B]/70 text-xs mt-2 font-normal hidden sm:block">
        {stat.subtext}
      </p>
    </div>
  );
}

export function Stats() {
  return (
    <section className="bg-[#F4FF00] border-b-2 border-[#0B0B0B] relative z-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {STATS.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
