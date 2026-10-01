import { Layout } from '../components/layout';
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { GrainJourney } from '@/components/home/GrainJourney';
import { ProductEcosystem } from '@/components/home/ProductEcosystem';
import { TurnkeyProcess } from '@/components/home/TurnkeyProcess';
import { EngineeringCredibility } from '@/components/home/EngineeringCredibility';
import { IndustriesSection } from '@/components/home/IndustriesSection';
import { WhyBaliGroup } from '@/components/home/WhyBaliGroup';
import { ProjectsPreview } from '@/components/home/ProjectsPreview';
import { CtaSection } from '@/components/home/CtaSection';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Stats />
      <GrainJourney />
      <ProductEcosystem />
      <TurnkeyProcess />
      <EngineeringCredibility />
      <IndustriesSection />
      <WhyBaliGroup />
      <ProjectsPreview />
      <CtaSection />
    </Layout>
  );
}
