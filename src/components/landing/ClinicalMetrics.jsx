import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Metric = ({ value, label, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Spring animation for counting up
  const springValue = useSpring(0, {
    bounce: 0,
    duration: 2500,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  const displayValue = useTransform(springValue, (current) => Math.round(current) + suffix);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-8 glass-panel border-t-0 border-b-0 border-r-0 first:border-l-0 border-white/5">
      <motion.span className="text-6xl md:text-8xl font-serif text-white mb-2">{displayValue}</motion.span>
      <span className="text-secondary font-mono text-sm tracking-widest uppercase">{label}</span>
    </div>
  );
};

export default function ClinicalMetrics() {
  return (
    <section className="py-32 w-full border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Metric value={98} label="Prediction Confidence" suffix="%" />
        <Metric value={250} label="Patients Processed" suffix="+" />
        <Metric value={12} label="Clinical Variables" />
        <Metric value={5} label="Average Analysis" suffix=" sec" />
      </div>
    </section>
  );
}