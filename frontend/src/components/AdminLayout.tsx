'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getSuivis } from '@/services/api';
import { getNewLeadsCount } from '@/services/marketingApi';
import { 
  LayoutDashboard, Users, Calendar, LogOut, Menu, X, Plus, UserPlus, Settings, FileText, BookUser, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [overdueCount, setOverdueCount] = useState(0);
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadCounts();
  }, [pathname]);

  const loadCounts = async () => {
    try {
      const [suivis, leadsCount] = await Promise.all([
        getSuivis(),
        getNewLeadsCount()
      ]);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const overdue = (suivis || []).filter((c: any) => {
        if (!c.date_suivi) return false;
        const suivi = new Date(c.date_suivi);
        return suivi < today;
      });
      setOverdueCount(overdue.length);
      setNewLeadsCount(leadsCount);
    } catch (error) {
      // Keep UI resilient; counts already default to 0.
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  interface NavItem {
    path: string;
    icon: any;
    label: string;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { path: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/admin/prospects', icon: MessageSquare, label: 'Demandes (Landing)', badge: 0 },
    { path: '/admin/clients', icon: Users, label: 'Clients' },
    { path: '/admin/leads', icon: UserPlus, label: 'Conduit', badge: newLeadsCount },
    { path: '/admin/contacts', icon: BookUser, label: 'Contacts' },
    { path: '/admin/agenda', icon: Calendar, label: 'Agenda', badge: overdueCount },
    { path: '/admin/formulaires', icon: FileText, label: 'Formulaires' },
    { path: '/admin/profile', icon: Settings, label: 'Profil' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#0F172A] border-r border-[#334155] text-white z-50 hidden md:flex flex-col">
        <div className="p-[20px] px-[16px] border-b border-[#334155] flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <span className="text-white font-black text-xl">P</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Planify</h1>
            <p className="text-xs text-slate-400 font-medium">CRM Financier</p>
          </div>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-[10px] text-sm transition-all duration-150 relative ${
                    isActive(item.path)
                      ? 'bg-[#1E40AF]/20 text-blue-500 border-l-[3px] border-blue-500 rounded-l-none font-semibold'
                      : 'text-slate-400 font-medium hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto min-w-[18px] px-1.5 h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-[#334155]">
          <div className="mb-4 px-2">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.nom_complet || 'Utilisateur'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-400 font-medium text-sm transition-all duration-150"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0F172A] border-b border-[#334155] z-40 md:hidden flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-white">Planify</h1>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-800">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] p-0 bg-[#0F172A] border-l border-[#334155] text-slate-300">
            <VisuallyHidden>
              <SheetTitle>Menu de navigation mobile</SheetTitle>
              <SheetDescription>Menu de navigation principal pour les appareils mobiles.</SheetDescription>
            </VisuallyHidden>
            <div className="p-6 border-b border-[#334155]">
              <h2 className="font-bold text-white">Menu</h2>
              <p className="text-sm text-slate-400 truncate">{user?.nom_complet || user?.email}</p>
            </div>
            <nav className="py-4">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <div key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-[10px] text-sm transition-all duration-150 relative ${
                        isActive(item.path)
                          ? 'bg-[#1E40AF]/20 text-blue-500 border-l-[3px] border-blue-500 rounded-l-none font-semibold'
                          : 'text-slate-400 font-medium hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto min-w-[18px] px-1.5 h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </nav>
            <div className="p-4 border-t border-[#334155] absolute bottom-0 left-0 right-0">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 font-medium text-sm transition-all duration-150"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-[#334155] z-40 h-16 flex items-center justify-around pb-safe md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center gap-1 px-4 py-2 relative ${
              isActive(item.path) ? 'text-blue-500' : 'text-slate-400'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute top-1 right-2 min-w-[16px] px-1 h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Main Content */}
      <main className="md:ml-[240px] pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Floating Add Button (Mobile) */}
      <button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center md:hidden z-30 transition-all active:scale-95 shadow-blue-600/30"
        onClick={() => router.push('/admin/clients/new')}
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

export default AdminLayout;
