import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NODES = [
  { id: 'patient', label: 'Patient Data' },
  { id: 'model', label: 'AI Model' },
  { id: 'attention', label: 'Attention Map' },
  { id: 'risk', label: 'Risk Score' },
  { id: 'recommendation', label: 'Recommendation' },
];

export default function ExplainableAI() {
  const containerRef = useRef(null);
  const nodesRef = useRef([]);
  const linesRef = useRef([]);
  const eyeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        }
      });

      // Eye glowing effect
      tl.fromTo(eyeRef.current, 
        { opacity: 0.1, scale: 0.8 },
        { opacity: 0.8, scale: 1, duration: 1, ease: 'power2.out' }
      );

      // Light up nodes sequentially
      nodesRef.current.forEach((node, i) => {
        if (!node) return;
        tl.fromTo(node,
          { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', scale: 0.9 },
          { borderColor: '#5AE8FF', color: '#FFFFFF', scale: 1, duration: 0.5, ease: 'power1.inOut' },
          i * 0.5
        );
        
        // Light up connecting line
        if (linesRef.current[i]) {
          tl.fromTo(linesRef.current[i],
            { scaleY: 0, opacity: 0 },
            { scaleY: 1, opacity: 1, duration: 0.5, ease: 'power1.inOut' },
            i * 0.5 + 0.2
          );
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 w-full flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-8 w-full flex flex-col md:flex-row items-center gap-24">
        
        {/* Left: Nodes Timeline */}
        <div className="flex-1 flex flex-col gap-8 relative">
          {NODES.map((node, i) => (
            <div key={node.id} className="relative z-10 flex items-center gap-6">
              <div 
                ref={el => nodesRef.current[i] = el}
                className="w-4 h-4 rounded-full border-2 border-white/10 bg-background transition-colors flex-shrink-0"
              />
              <span className="font-mono text-xl">{node.label}</span>
              
              {/* Connecting line */}
              {i < NODES.length - 1 && (
                <div 
                  ref={el => linesRef.current[i] = el}
                  className="absolute left-2 top-4 w-[2px] h-12 bg-gradient-to-b from-accent-cyan to-accent-blue origin-top"
                  style={{ transform: 'translateX(-50%)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Right: Eye Illustration */}
        <div className="flex-1 flex justify-center items-center">
          <div ref={eyeRef} className="relative w-96 h-96">
            {/* Minimal SVG Eye representation */}
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-accent-blue fill-none drop-shadow-[0_0_15px_rgba(61,126,255,0.5)]">
              <path d="M10,50 Q50,10 90,50 Q50,90 10,50 Z" strokeWidth="0.5" strokeDasharray="2, 2" />
              <circle cx="50" cy="50" r="15" strokeWidth="0.5" strokeDasharray="1, 1" />
              <circle cx="50" cy="50" r="4" fill="#5AE8FF" />
            </svg>
            <div className="absolute inset-0 bg-accent-blue/10 rounded-full blur-[80px]" />
          </div>
        </div>

      </div>
    </section>
  );
}