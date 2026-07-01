import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { id: '01', title: 'Patient Data', desc: 'Ingesting laboratory results and imaging securely.' },
  { id: '02', title: 'AI Processing', desc: 'Proprietary models analyze multi-modal clinical variables.' },
  { id: '03', title: 'Heatmap', desc: 'Visualizing risk factors directly on patient records.' },
  { id: '04', title: 'Prediction', desc: 'Generating a 98% accurate clinical prediction score.' },
  { id: '05', title: 'Recommendation', desc: 'Actionable clinical pathways for early intervention.' },
];

export default function StickyAI() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;
      const numCards = cards.length;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${numCards * 100}%`,
        pin: true,
        scrub: true,
      });

      // Initially position cards 1 to N offscreen (bottom)
      gsap.set(cards.slice(1), { yPercent: 120 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${numCards * 100}%`,
          scrub: true,
        }
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        tl.to(card, {
          yPercent: 0,
          ease: "none"
        }, i - 0.5); // overlapping slightly or sequentially
        
        // Scale down the previous card
        tl.to(cards[i - 1], {
          scale: 1 - 0.05,
          y: -20,
          opacity: 0.5,
          ease: "none"
        }, i - 0.5);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen w-full relative flex items-center justify-center">
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-8 max-w-3xl mx-auto px-6 w-full h-full">
        
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-5xl font-serif mb-3">How DiaSight Works</h2>
          <p className="text-secondary">Transforming raw patient data into explainable clinical insight.</p>
        </div>

        <div className="relative w-full h-[280px]">
          {CARDS.map((card, i) => (
            <div 
              key={card.id}
              ref={el => cardsRef.current[i] = el}
              className="absolute top-0 left-0 w-full h-full glass-panel p-8 md:p-10 flex flex-col justify-center gap-4 bg-[#0A0A0A]/90"
              style={{
                zIndex: i + 1,
              }}
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-lg text-accent-cyan">{card.id}</span>
                <h3 className="text-2xl font-serif">{card.title}</h3>
              </div>
              <p className="text-lg text-secondary max-w-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}