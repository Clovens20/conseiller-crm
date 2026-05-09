import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStats } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Calendar, Bell } from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total_clients: 0,
    total_prospects: 0,
    rdv_this_month: 0,
    suivis_pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Dashboard loadStats error:', error);
      setStats({
        total_clients: 0,
        total_prospects: 0,
        rdv_this_month: 0,
        suivis_pending: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.total_clients,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      subtitle: 'Tous les clients'
    },
    {
      title: 'Prospects actifs',
      value: stats.total_prospects,
      icon: UserCheck,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      subtitle: 'En cours de conversion'
    },
    {
      title: 'RDV ce mois',
      value: stats.rdv_this_month,
      icon: Calendar,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      subtitle: 'Rendez-vous prévus'
    },
    {
      title: 'Suivis à faire',
      value: stats.suivis_pending,
      icon: Bell,
      color: stats.suivis_pending > 0 ? 'text-red-400' : 'text-emerald-400',
      bgColor: stats.suivis_pending > 0 ? 'bg-red-500/20' : 'bg-emerald-500/20',
      subtitle: 'Rappels et échéances'
    }
  ];

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-slate-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Tableau de bord</h1>
          <p className="text-slate-400 text-sm mt-1">Aperçu de votre activité</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={stat.title} 
            className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-slate-600 transition-colors"
            data-testid={`stat-card-${index}`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
              <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Quick info section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
            <h2 className="text-lg font-bold text-white">Bienvenue dans Planify</h2>
          </div>
          <div className="p-6 text-slate-300 text-sm">
            <p className="mb-4 text-slate-400">
              Votre CRM personnel pour gérer efficacement vos clients en assurance de personnes.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Gérez vos fiches clients complètes
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Planifiez vos rendez-vous et suivis
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Suivez vos prospects et conversions
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Exportez vos données en CSV
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
            <h2 className="text-lg font-bold text-white">Actions rapides</h2>
          </div>
          <div className="p-6 space-y-3">
            <Link 
              href="/admin/clients/new" 
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-700 hover:bg-slate-700/50 hover:border-slate-600 transition-colors"
              data-testid="quick-add-client"
            >
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Users className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Ajouter un client</p>
                <p className="text-xs text-slate-400 mt-0.5">Créer une nouvelle fiche client</p>
              </div>
            </Link>
            <Link 
              href="/admin/agenda" 
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-700 hover:bg-slate-700/50 hover:border-slate-600 transition-colors"
              data-testid="quick-view-agenda"
            >
              <div className="p-3 bg-sky-500/20 rounded-xl">
                <Calendar className="h-5 w-5 text-sky-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Voir l'agenda</p>
                <p className="text-xs text-slate-400 mt-0.5">Consulter vos RDV et suivis</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
