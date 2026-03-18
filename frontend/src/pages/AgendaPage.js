import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRdv, getSuivis } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { Calendar, Clock, Phone, User } from 'lucide-react';
import { getStatusBadgeClass, getStatusLabel, formatDate, formatDateTime, getInitials, getAvatarColor } from '../utils/clientHelpers';

const AgendaPage = () => {
  const [rdvList, setRdvList] = useState([]);
  const [suivisList, setSuivisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rdv, suivis] = await Promise.all([getRdv(), getSuivis()]);
      setRdvList(rdv);
      setSuivisList(suivis);
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'agenda');
    } finally {
      setLoading(false);
    }
  };

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const renderClientCard = (client, dateField, isRdv = true) => {
    const dateValue = client[dateField];
    const isTodayDate = isToday(dateValue);
    const isPastDate = isPast(dateValue);

    return (
      <Card 
        key={client.id}
        className={`border-slate-200 hover:shadow-md transition-shadow cursor-pointer ${
          isTodayDate ? 'ring-2 ring-sky-500 ring-offset-2' : ''
        } ${isPastDate && !isRdv ? 'border-red-200 bg-red-50/50' : ''}`}
        onClick={() => navigate(`/clients/${client.id}`)}
        data-testid={`agenda-card-${client.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${getAvatarColor(client.prenom + client.nom)}`}
            >
              {getInitials(client.prenom, client.nom)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900 truncate">
                  {client.prenom} {client.nom}
                </h3>
                <Badge className={getStatusBadgeClass(client.statut)}>
                  {getStatusLabel(client.statut)}
                </Badge>
                {isTodayDate && (
                  <Badge className="bg-sky-100 text-sky-700 border-sky-200">
                    Aujourd'hui
                  </Badge>
                )}
                {isPastDate && !isRdv && (
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    En retard
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  {isRdv ? <Calendar className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                  {isRdv ? formatDateTime(dateValue) : formatDate(dateValue)}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  <a 
                    href={`tel:${client.telephone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-slate-900"
                  >
                    {client.telephone}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-10 w-48 bg-slate-200 rounded mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const overdueCount = suivisList.filter(c => isPast(c.date_suivi)).length;

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Agenda
        </h1>
        <p className="text-slate-500 mt-1">
          Vos rendez-vous et suivis à venir
        </p>
      </div>

      <Tabs defaultValue="rdv" className="w-full">
        <TabsList className="mb-6" data-testid="agenda-tabs">
          <TabsTrigger value="rdv" className="gap-2" data-testid="tab-rdv">
            <Calendar className="h-4 w-4" />
            Rendez-vous ({rdvList.length})
          </TabsTrigger>
          <TabsTrigger value="suivis" className="gap-2 relative" data-testid="tab-suivis">
            <Clock className="h-4 w-4" />
            Suivis ({suivisList.length})
            {overdueCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {overdueCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rdv">
          {rdvList.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-slate-100 rounded-full">
                    <Calendar className="h-8 w-8 text-slate-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Aucun rendez-vous planifié
                </h3>
                <p className="text-slate-500">
                  Ajoutez des rendez-vous à vos fiches clients
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {rdvList.map((client) => renderClientCard(client, 'date_rdv', true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="suivis">
          {suivisList.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-slate-100 rounded-full">
                    <Clock className="h-8 w-8 text-slate-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Aucun suivi prévu
                </h3>
                <p className="text-slate-500">
                  Planifiez des suivis pour vos clients
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {suivisList.map((client) => renderClientCard(client, 'date_suivi', false))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgendaPage;
