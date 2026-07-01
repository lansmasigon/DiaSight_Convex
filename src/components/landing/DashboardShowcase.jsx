import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DashboardShowcase() {
  const sectionRef = useRef(null);
  const laptopRef = useRef(null);
  const screenRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom center',
          scrub: 1,
        }
      });

      // Laptop rotates into view
      tl.fromTo(laptopRef.current,
        { rotateX: 45, scale: 0.8, y: 100 },
        { rotateX: 0, scale: 1, y: 0, ease: 'power2.out' }
      );

      // Screen zooms in slightly
      tl.to(screenRef.current, {
        scale: 1.05,
        ease: 'power1.inOut'
      }, "<0.5");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-48 w-full flex justify-center items-center perspective-1000">
      <div 
        ref={laptopRef}
        className="w-full max-w-5xl rounded-2xl bg-[#111] p-4 border border-white/10 shadow-2xl relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="w-full aspect-video bg-[#050505] rounded-xl overflow-hidden relative border border-white/5">
          {/* Fake Dashboard UI */}
          <div ref={screenRef} className="w-full h-full flex flex-col p-6 gap-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="font-serif text-2xl">DiaSight Convex</span>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="w-8 h-8 rounded-full bg-white/10" />
              </div>
            </div>
            <div className="flex gap-6 h-full">
              <div className="w-64 flex flex-col gap-4">
                <div className="h-12 bg-white/5 rounded-lg" />
                <div className="h-12 bg-white/5 rounded-lg" />
                <div className="h-12 bg-white/5 rounded-lg" />
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex gap-6">
                  <div className="flex-1 h-32 bg-white/5 rounded-xl border border-white/5 flex items-end p-4">
                     <div className="w-full h-1/2 bg-accent-blue/20 rounded-t-lg" />
                  </div>
                  <div className="flex-1 h-32 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-accent-cyan" />
                  </div>
                </div>
                <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-6">
                  {/* Fake heatmap */}
                  <div className="w-full h-full rounded bg-gradient-to-br from-accent-blue/10 to-accent-cyan/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Laptop base */}
        <div className="w-[120%] h-4 bg-[#222] absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-b-xl border-b border-white/20" />
      </div>
    </section>
  );
}