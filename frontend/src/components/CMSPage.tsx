'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Eye, Globe, Shield, FileText } from 'lucide-react';
import { toast } from 'sonner';

// Simplified rich text placeholder if needed, 
// but we'll use standard textareas for the start or integrated TipTap if available.

export default function CMSPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contents, setContents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('landing');

  // Local states for sections
  const [landingContent, setLandingContent] = useState<any>({
    hero: { title: '', subtitle: '', bg_image: '' },
    stats: { years: '', families: '', list: '' },
    services: []
  });

  const [legalContent, setLegalContent] = useState<any>({
    privacy: { title: '', content: '', last_updated: '' },
    terms: { title: '', content: '', last_updated: '' }
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');
      
      if (error) throw error;

      if (data) {
        setContents(data);
        // Dispatch data to states
        const landing = data.find(d => d.page_slug === 'landing' && d.section_id === 'main');
        if (landing) setLandingContent(landing.content);

        const privacy = data.find(d => d.page_slug === 'privacy' && d.section_id === 'full');
        const terms = data.find(d => d.page_slug === 'terms' && d.section_id === 'full');
        
        setLegalContent({
          privacy: privacy?.content || { title: 'Politique de confidentialité', content: '', last_updated: '' },
          terms: terms?.content || { title: 'Conditions d\'utilisation', content: '', last_updated: '' }
        });
      }
    } catch (err: any) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLanding = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          page_slug: 'landing',
          section_id: 'main',
          content: landingContent,
          updated_at: new Date().toISOString()
        }, { onConflict: 'page_slug,section_id' });

      if (error) throw error;
      toast.success('Landing page mise à jour !');
    } catch (err: any) {
      toast.error('Erreur lors de la sauvegarde : ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLegal = async (type: 'privacy' | 'terms') => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          page_slug: type,
          section_id: 'full',
          content: legalContent[type],
          updated_at: new Date().toISOString()
        }, { onConflict: 'page_slug,section_id' });

      if (error) throw error;
      toast.success('Page légale mise à jour !');
    } catch (err: any) {
      toast.error('Erreur lors de la sauvegarde : ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion de contenu</h1>
          <p className="text-slate-500">Modifiez les textes et images du site public</p>
        </div>
        <Button variant="outline" onClick={() => window.open('/', '_blank')}>
          <Eye className="w-4 h-4 mr-2" />
          Voir le site
        </Button>
      </div>

      <Tabs defaultValue="landing" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="landing" className="flex gap-2">
            <Globe className="w-4 h-4" /> Landing Page
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex gap-2">
            <Shield className="w-4 h-4" /> Politique de confidentialité
          </TabsTrigger>
          <TabsTrigger value="terms" className="flex gap-2">
            <FileText className="w-4 h-4" /> Conditions d'utilisation
          </TabsTrigger>
        </TabsList>

        {/* TAB LANDING */}
        <TabsContent value="landing" className="space-y-6">
          <Card shadow-md>
            <CardHeader>
              <CardTitle>Section Hero</CardTitle>
              <CardDescription>Première section visible par les visiteurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="hero-title">Titre principal</Label>
                <Input 
                  id="hero-title" 
                  value={landingContent.hero?.title} 
                  onChange={e => setLandingContent({...landingContent, hero: {...landingContent.hero, title: e.target.value}})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hero-subtitle">Sous-titre</Label>
                <textarea 
                  id="hero-subtitle" 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={landingContent.hero?.subtitle} 
                  onChange={e => setLandingContent({...landingContent, hero: {...landingContent.hero, subtitle: e.target.value}})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hero-bg">URL Image de fond (Unsplash)</Label>
                <Input 
                  id="hero-bg" 
                  value={landingContent.hero?.bg_image} 
                  onChange={e => setLandingContent({...landingContent, hero: {...landingContent.hero, bg_image: e.target.value}})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>Chiffres clés affichés sous le Hero</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Expertise (ex: 45 ans)</Label>
                <Input 
                  value={landingContent.stats?.years} 
                  onChange={e => setLandingContent({...landingContent, stats: {...landingContent.stats, years: e.target.value}})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Familles (ex: 8M+)</Label>
                <Input 
                  value={landingContent.stats?.families} 
                  onChange={e => setLandingContent({...landingContent, stats: {...landingContent.stats, families: e.target.value}})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Marché (ex: NYSE)</Label>
                <Input 
                  value={landingContent.stats?.list} 
                  onChange={e => setLandingContent({...landingContent, stats: {...landingContent.stats, list: e.target.value}})}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button disabled={saving} onClick={handleSaveLanding}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Enregistrer les modifications
            </Button>
          </div>
        </TabsContent>

        {/* TAB PRIVACY */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu Juridique</CardTitle>
              <CardDescription>Éditez le texte de la politique de confidentialité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Titre de la page</Label>
                <Input 
                  value={legalContent.privacy.title} 
                  onChange={e => setLegalContent({...legalContent, privacy: {...legalContent.privacy, title: e.target.value}})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Date de mise à jour</Label>
                <Input 
                  value={legalContent.privacy.last_updated} 
                  onChange={e => setLegalContent({...legalContent, privacy: {...legalContent.privacy, last_updated: e.target.value}})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Contenu (HTML)</Label>
                <textarea 
                  className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                  value={legalContent.privacy.content} 
                  onChange={e => setLegalContent({...legalContent, privacy: {...legalContent.privacy, content: e.target.value}})}
                />
                <p className="text-xs text-slate-500">Vous pouvez utiliser des balises HTML pour la mise en forme.</p>
              </div>
              <div className="flex justify-end">
                <Button disabled={saving} onClick={() => handleSaveLegal('privacy')}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Sauvegarder la politique
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB TERMS */}
        <TabsContent value="terms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conditions d'utilisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Titre de la page</Label>
                <Input 
                  value={legalContent.terms.title} 
                  onChange={e => setLegalContent({...legalContent, terms: {...legalContent.terms, title: e.target.value}})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Contenu (HTML)</Label>
                <textarea 
                  className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                  value={legalContent.terms.content} 
                  onChange={e => setLegalContent({...legalContent, terms: {...legalContent.terms, content: e.target.value}})}
                />
              </div>
              <div className="flex justify-end">
                <Button disabled={saving} onClick={() => handleSaveLegal('terms')}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Sauvegarder les conditions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
