import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSuivis } from '../services/api';
import { 
  LayoutDashboard, Users, Calendar, LogOut, Menu, X, Plus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [overdueCount, setOverdueCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadOverdueCount();
  }, [location.pathname]);

  const loadOverdueCount = async () => {
    try {
      const suivis = await getSuivis();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const overdue = suivis.filter(c => {
        if (!c.date_suivi) return false;
        const suivi = new Date(c.date_suivi);
        return suivi < today;
      });
      setOverdueCount(overdue.length);
    } catch (error) {
      console.error('Error loading overdue count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/clients', icon: Users, label: 'Clients' },
    { path: '/agenda', icon: Calendar, label: 'Agenda', badge: overdueCount },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white z-50 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">Conseiller Pro</h1>
          <p className="text-sm text-slate-400 mt-1 truncate">{user?.email}</p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                    isActive(item.path)
                      ? 'bg-white/10 text-white'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                  {item.badge > 0 && (
                    <span className="absolute right-4 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5"
            data-testid="logout-btn"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 md:hidden flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-slate-900">Conseiller Pro</h1>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-0">
            <div className="p-6 border-b">
              <h2 className="font-bold text-slate-900">Menu</h2>
              <p className="text-sm text-slate-500 truncate">{user?.email}</p>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                        isActive(item.path)
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                      {item.badge > 0 && (
                        <span className="absolute right-4 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t absolute bottom-0 left-0 right-0">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-slate-600"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Déconnexion
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 h-16 flex items-center justify-around pb-safe md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-4 py-2 relative ${
              isActive(item.path) ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label.split(' ')[0]}</span>
            {item.badge > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Floating Add Button (Mobile) */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg bg-slate-900 hover:bg-slate-800 md:hidden z-30"
        onClick={() => navigate('/clients/new')}
        data-testid="mobile-add-btn"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Layout;
