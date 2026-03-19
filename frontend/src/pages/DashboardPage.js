import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, UserCheck, Calendar, Bell } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.total_clients,
      icon: Users,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100'
    },
    {
      title: 'Prospects',
      value: stats.total_prospects,
      icon: UserCheck,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100'
    },
    {
      title: 'RDV ce mois',
      value: stats.rdv_this_month,
      icon: Calendar,
      color: 'text-sky-700',
      bgColor: 'bg-sky-100'
    },
    {
      title: 'Suivis à faire',
      value: stats.suivis_pending,
      icon: Bell,
      color: stats.suivis_pending > 0 ? 'text-red-700' : 'text-green-700',
      bgColor: stats.suivis_pending > 0 ? 'bg-red-100' : 'bg-green-100'
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
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-slate-500 mt-2">
          Aperçu de votre activité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="border-slate-200 hover:shadow-lg transition-shadow duration-200"
            data-testid={`stat-card-${index}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  {stat.title}
                </p>
                <p className="text-4xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick info section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">
              Bienvenue dans Planify
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600">
            <p className="mb-4">
              Votre CRM personnel pour gérer efficacement vos clients en assurance de personnes.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-sky-500 rounded-full" />
                Gérez vos fiches clients complètes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-sky-500 rounded-full" />
                Planifiez vos rendez-vous et suivis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-sky-500 rounded-full" />
                Suivez vos prospects et conversions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-sky-500 rounded-full" />
                Exportez vos données en CSV
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a 
                href="/clients/new" 
                className="block p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                data-testid="quick-add-client"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Ajouter un client</p>
                    <p className="text-sm text-slate-500">Créer une nouvelle fiche client</p>
                  </div>
                </div>
              </a>
              <a 
                href="/agenda" 
                className="block p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                data-testid="quick-view-agenda"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-sky-700" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Voir l'agenda</p>
                    <p className="text-sm text-slate-500">Consulter vos RDV et suivis</p>
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
