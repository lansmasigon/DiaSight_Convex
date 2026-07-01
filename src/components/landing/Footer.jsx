export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 md:px-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_10px_#5AE8FF]" />
        <span className="font-serif text-xl tracking-wide">DiaSight</span>
      </div>
      
      <div className="flex gap-8 text-secondary font-mono text-xs uppercase tracking-widest">
        <a href="#" className="hover:text-white transition-colors">Healthcare AI</a>
        <a href="#" className="hover:text-white transition-colors">GitHub</a>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
      </div>
    </footer>
  );
}