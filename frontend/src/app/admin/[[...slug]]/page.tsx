'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Loader2 } from 'lucide-react';

// Import migrated pages (we'll need to wrap them or adapt them)
// For now, we'll implement a dynamic loader or just import the main ones.
import DashboardPage from '@/legacy-pages/DashboardPage';
import ClientsPage from '@/legacy-pages/ClientsPage';
import ClientDetailPage from '@/legacy-pages/ClientDetailPage';
import ClientFormPage from '@/legacy-pages/ClientFormPage';
import AgendaPage from '@/legacy-pages/AgendaPage';
import LeadsPage from '@/legacy-pages/LeadsPage';
import FormulairesPage from '@/legacy-pages/FormulairesPage';
import FormulaireEditPage from '@/legacy-pages/FormulaireEditPage';
import ContactsPage from '@/legacy-pages/ContactsPage';
import ProfilePage from '@/legacy-pages/ProfilePage';
import ProspectsPage from '@/components/ProspectsPage';
import CMSPage from '@/components/CMSPage';

export default function AdminPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const slug = params.slug as string[] || [];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
      </div>
    );
  }

  // Routing logic based on slug
  const renderContent = () => {
    const mainPath = slug[0] || 'dashboard';

    switch (mainPath) {
      case 'dashboard':
        return <DashboardPage />;
      case 'prospects':
        return <ProspectsPage />;
      case 'clients':
        if (slug[1] === 'new') return <ClientFormPage />;
        if (slug[1] && slug[2] === 'edit') return <ClientFormPage />;
        if (slug[1]) return <ClientDetailPage id={slug[1]} />;
        return <ClientsPage />;
      case 'leads':
        return <LeadsPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'agenda':
        return <AgendaPage />;
      case 'formulaires':
        if (slug[1] === 'new') return <FormulaireEditPage />;
        if (slug[1] && slug[2] === 'edit') return <FormulaireEditPage />;
        return <FormulairesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'cms':
        return <CMSPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
}
