import React from 'react';
import { Home, Search, Sparkles, User, BookOpen, LogIn } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Sparkles, label: 'AI Summary', path: '/ai' },
    { 
      icon: isAuthenticated ? User : LogIn, 
      label: isAuthenticated ? 'Profile' : 'Login', 
      path: isAuthenticated ? '/profile' : '/login' 
    },
  ];

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white border-b border-gray-200 z-50 px-6 py-3 justify-between items-center">
        <div className="flex items-center gap-2 text-primary cursor-pointer" onClick={() => navigate('/')}>
            <BookOpen className="h-8 w-8" />
            <span className="text-xl font-display font-bold text-gray-900">BookSummary</span>
        </div>
        <div className="flex gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};