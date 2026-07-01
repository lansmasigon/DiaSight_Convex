import SmoothScroll from '../components/SmoothScroll';
import AnimatedBackground from '../components/AnimatedBackground';
import Hero from '../components/landing/Hero';
import Problem from '../components/landing/Problem';
import StickyAI from '../components/landing/StickyAI';
import ExplainableAI from '../components/landing/ExplainableAI';
import ClinicalMetrics from '../components/landing/ClinicalMetrics';
import DashboardShowcase from '../components/landing/DashboardShowcase';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <SmoothScroll>
      <AnimatedBackground />
      <main className="w-full relative z-10">
        <Hero />
        <Problem />
        <StickyAI />
        <ExplainableAI />
        <ClinicalMetrics />
        <DashboardShowcase />
        <Testimonials />
        <CTA />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
