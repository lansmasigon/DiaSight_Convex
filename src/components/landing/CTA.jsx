import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-48 w-full flex justify-center items-center relative overflow-hidden">
      {/* Background glow intensifies here */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1A1DFF]/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl text-center px-8 z-10 flex flex-col items-center gap-12">
        <h2 className="text-6xl md:text-8xl font-serif leading-tight">
          The future of <br />
          <span className="text-secondary">diabetic screening.</span><br />
          Starts here.
        </h2>
        <Link to="/login">
          <button className="px-10 py-5 glass-panel text-lg hover:bg-white/10 transition-colors flex items-center gap-4 group">
            Request Demo 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </section>
  );
}