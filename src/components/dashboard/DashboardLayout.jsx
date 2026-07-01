import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AnimatedBackground from '../AnimatedBackground';

export default function DashboardLayout() {
  const { logout } = useAuth();

  const NAV_ITEMS = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/assessment", icon: Activity, label: "Risk Assessment" },
    { to: "/audit-logs", icon: FileText, label: "Audit Logs" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AnimatedBackground />
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-background/50 backdrop-blur-xl flex flex-col z-20">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-12">
            <img src="/src/Diasight.png" alt="DiaSight Logo" className="w-8 h-8 object-contain" />
            <span className="font-serif text-2xl tracking-wide">DiaSight</span>
          </div>
          
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'text-secondary hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 pt-4">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:text-white hover:bg-white/5 transition-all w-full text-left"
          >
            <LogOut size={18} />
            <span className="text-sm">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
        <div className="p-8 md:p-12 w-full max-w-[1400px] mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}