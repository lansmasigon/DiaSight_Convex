import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Parallax move from right to left on scroll
    gsap.to(containerRef.current, {
      xPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#030303]">
      <div ref={containerRef} className="absolute inset-y-0 right-0 w-[500px] flex justify-center items-center opacity-70 translate-x-1/3">
        {/* Main Blue Circle */}
        <div className="absolute w-[400px] h-[400px] rounded-full overflow-hidden blur-[10px] bg-[#0A1AFF]/80 mix-blend-screen translate-x-10">
           <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        </div>
        
        {/* Secondary Cyan Circle */}
        <div className="absolute w-[300px] h-[300px] rounded-full overflow-hidden blur-[10px] bg-[#00E5FF]/70 mix-blend-screen -translate-x-12 -translate-y-12">
           <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        </div>
      </div>
    </div>
  );
}