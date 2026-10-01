import { motion } from 'motion/react';
import { ShieldCheck, Cpu, Factory, Award, Wrench } from 'lucide-react';

const PILLARS = [
  {
    num: '01',
    title: 'Engineering-Led Execution',
    icon: Cpu,
    desc: 'We are engineering purists. Every structure, stiffener, and conveyor speed is calculated using advanced finite element stress modeling before steel is rolled.',
    metric: 'FEA Verified Structural Integrity'
  },
  {
    num: '02',
    title: 'Integrated Project Delivery',
    icon: Award,
    desc: 'No finger-pointing between separate mechanical, electrical, and civil suppliers. We orchestrate the entire storage ecosystem from foundation to SCADA.',
    metric: 'Single Source Accountability'
  },
  {
    num: '03',
    title: 'In-House Precision Manufacturing',
    icon: Factory,
    desc: 'Fabricated at our state-of-the-art facility in Chandigarh with high-tensile structural steel, heavy Z600 galvanization, and CNC automated roll-forming.',
    metric: 'Z600 / 450g/m² Hot-Dip Protection'
  },
  {
    num: '04',
    title: 'Turnkey EPC Capability',
    icon: ShieldCheck,
    desc: 'Over three decades of executing complete mega-projects globally—delivering guaranteed intake and outloading capacities on predetermined timelines.',
    metric: '500+ Commissioned Facilities'
  },
  {
    num: '05',
    title: 'Enduring Lifecycle Support',
    icon: Wrench,
    desc: 'Silos and handling systems built to run for generations, backed by rapid emergency spare parts delivery, structural audits, and technical field assistance.',
    metric: '35+ Years Operating Track Record'
  }
];

export function WhyBaliGroup() {
  return (
    <section className="bg-[#171717] text-white py-24 md:py-32 relative overflow-hidden border-b border-white/[0.08]">
      
      {/* Background blueprint grid */}
      <div className="absolute inset-0 technical-grid pointer-events-none opacity-30" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#F4FF00]" />
              <span className="text-[#F4FF00] font-bold tracking-[0.2em] text-xs uppercase font-mono">
                WHY BALI GROUP
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-[1.02]">
              BUILT ON PROVEN <br />
              <span className="text-[#A8AFB8]">ENGINEERING MERIT.</span>
            </h2>
          </div>
          <p className="text-[#A8AFB8] text-sm md:text-base max-w-md leading-relaxed">
            Industrial grain infrastructure demands zero failure tolerance. Here is why commercial grain handlers, grain boards, and food processors place their trust in Bali Group.
          </p>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`bg-[#202124] border border-white/[0.08] hover:border-[#F4FF00]/60 p-8 flex flex-col justify-between transition-all duration-300 group ${
                  idx === 0 ? 'lg:col-span-2 bg-[#202124]/80' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xl font-black text-[#F4FF00]">
                      {pillar.num}
                    </span>
                    <div className="p-3 bg-[#171717] text-[#F4FF00] border border-white/[0.06] group-hover:bg-[#F4FF00] group-hover:text-[#0B0B0B] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-4 group-hover:text-[#F4FF00] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-[#A8AFB8] text-sm leading-relaxed mb-8">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                  <span className="text-white/40 uppercase">Performance Standard</span>
                  <span className="text-[#F4FF00] font-bold">{pillar.metric}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
