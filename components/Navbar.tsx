import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, MessageSquare, PlusCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors active:scale-95 ${
        isActive(to) ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      <Icon size={24} strokeWidth={isActive(to) ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 h-16 items-center px-8 justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-md">
             <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">SkillTrade</span>
        </div>
        <div className="flex gap-8">
           <Link to="/" className={`text-sm font-medium transition-colors hover:text-indigo-600 ${isActive('/') ? 'text-indigo-600' : 'text-slate-600'}`}>Discover</Link>
           <Link to="/messages" className={`text-sm font-medium transition-colors hover:text-indigo-600 ${isActive('/messages') ? 'text-indigo-600' : 'text-slate-600'}`}>Messages</Link>
           <Link to="/profile" className={`text-sm font-medium transition-colors hover:text-indigo-600 ${isActive('/profile') ? 'text-indigo-600' : 'text-slate-600'}`}>Profile</Link>
        </div>
        <Link to="/post" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95">
          Post Request
        </Link>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 z-50 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] flex items-center justify-around shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NavItem to="/" icon={Home} label="Home" />
        <NavItem to="/post" icon={PlusCircle} label="Post" />
        <NavItem to="/messages" icon={MessageSquare} label="Chats" />
        <NavItem to="/profile" icon={User} label="Profile" />
      </nav>
    </>
  );
};