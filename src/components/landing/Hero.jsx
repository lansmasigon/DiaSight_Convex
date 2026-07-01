import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // Scroll morph
      tl.to(textRef.current, {
        opacity: 0,
        y: -50,
        ease: 'power4.out'
      }, 0);

      tl.to(cardRef.current, {
        scale: 1.2,
        y: -100,
        ease: 'power4.out'
      }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen flex items-center justify-center px-12 md:px-24">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left: Typography */}
        <div ref={textRef} className="flex flex-col items-start gap-6 z-10">
          <p className="font-mono text-sm tracking-widest text-secondary uppercase">DiaSight</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] tracking-tight">
            AI that helps<br />clinicians see<br />
            <span className="text-secondary">diabetic retinopathy</span><br />
            before it becomes<br />vision loss.
          </h1>
          <p className="text-lg md:text-xl text-primary font-light">Built with Explainable AI.</p>
          <button className="mt-4 px-6 py-3 glass-panel hover:bg-white/10 transition-colors flex items-center gap-3">
            Request Demo <ArrowRight size={18} />
          </button>
        </div>

        {/* Right: Floating Logo */}
        <div className="flex justify-center md:justify-end z-10 perspective-1000 mt-12 md:mt-0">
          <motion.div 
            ref={cardRef}
            initial={{ y: 20, rotateX: 10, opacity: 0 }}
            animate={{ 
              y: [0, -15, 0],
              rotateX: [0, 5, 0],
              rotateY: [0, -5, 0],
              opacity: 1
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full max-w-[320px] flex justify-center items-center drop-shadow-[0_0_30px_rgba(61,126,255,0.4)]"
          >
            <img src="/Diasight.png" alt="DiaSight Logo" className="w-full h-auto object-contain" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}