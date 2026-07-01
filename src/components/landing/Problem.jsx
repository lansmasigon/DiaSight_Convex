import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Problem() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // A simple text split effect manually creating spans
    if (!textRef.current) return;
    
    const words = textRef.current.innerText.split(' ');
    textRef.current.innerHTML = '';
    
    words.forEach(word => {
      const span = document.createElement('span');
      span.innerHTML = word + '&nbsp;';
      span.style.display = 'inline-block';
      textRef.current.appendChild(span);
    });

    const spans = textRef.current.querySelectorAll('span');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom top',
        scrub: true,
      }
    });

    tl.to(spans, {
      opacity: 0,
      y: () => (Math.random() - 0.5) * 200,
      x: () => (Math.random() - 0.5) * 200,
      rotateZ: () => (Math.random() - 0.5) * 45,
      scale: () => 1 + Math.random() * 2,
      stagger: 0.05,
      ease: 'power2.inOut',
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === sectionRef.current) t.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full min-h-[100vh] flex flex-col justify-start items-center pt-[20vh]">
      <div className="max-w-4xl px-6 text-center">
        <h2 
          ref={textRef}
          className="text-3xl md:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.3]"
        >
          Millions live with diabetes. Many don't know their eyesight is at risk.
        </h2>
      </div>
    </section>
  );
}