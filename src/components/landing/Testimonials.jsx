import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  { quote: "The explainability gives us confidence. It doesn't just give a score, it shows us why.", author: "Dr. Sarah Chen, Endocrinologist" },
  { quote: "A seamless addition to our clinical workflow. It feels invisible until you need it.", author: "Dr. James Wilson, Ophthalmologist" }
];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        gsap.to(card, {
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 w-full flex justify-center items-center">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row gap-12">
        {TESTIMONIALS.map((test, i) => (
          <div 
            key={i}
            ref={el => cardsRef.current[i] = el}
            className={`flex-1 glass-panel p-12 flex flex-col gap-8 ${i % 2 !== 0 ? 'mt-24' : ''}`}
          >
            <p className="text-2xl md:text-3xl font-serif text-white leading-relaxed">"{test.quote}"</p>
            <span className="text-secondary font-mono text-sm">— {test.author}</span>
          </div>
        ))}
      </div>
    </section>
  );
}