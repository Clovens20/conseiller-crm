# Planify CRM - Product Requirements Document

## Project Overview
CRM web full-stack pour conseiller en assurance de personnes au Québec (AMF). Application mobile-first permettant de gérer clients, rendez-vous, suivis et formulaires marketing.

**Nom de la plateforme**: Planify

## User Persona
- **Utilisateur principal**: Conseiller en assurance de personnes licencié AMF
- **Contexte**: Travaille en autonomie, rencontre des familles pour plans financiers
- **Besoins**: Gestion clients, rendez-vous, suivis, formulaires de capture de leads

## Technical Stack (IMPORTANT - Architecture actuelle)
- **Frontend**: React + TailwindCSS + Shadcn/UI + react-router-dom
- **Backend**: Supabase (PostgreSQL + Auth) - Communication directe depuis le frontend
- **Auth**: Supabase Auth (email/password)
- **Rich Text**: TipTap editor

⚠️ **Note**: Le dossier `/app/backend` contient du code FastAPI obsolète qui n'est plus utilisé. L'application est désormais frontend-only avec Supabase.

## Core Requirements
1. Authentification multi-tenant (plusieurs conseillers)
2. Dashboard avec 4 statistiques clés
3. CRUD clients avec recherche/filtres
4. Agenda RDV et suivis
5. Éditeur texte riche (gras, souligné, centré, couleurs)
6. Interface mobile-first responsive
7. Export CSV des clients
8. **Formulaires marketing multiples** (nouveau)

## What's Been Implemented

### MVP Core (Complété)
- [x] Page de connexion/inscription avec champ "Nom complet"
- [x] Dashboard avec statistiques (Total Clients, Prospects, RDV ce mois, Suivis à faire)
- [x] Gestion clients CRUD complète
- [x] Recherche et filtres par statut
- [x] Avatars avec initiales colorés
- [x] Badges de statut (Prospect/Actif/Suivi/Fermé)
- [x] Agenda avec onglets RDV et Suivis
- [x] Éditeur texte riche TipTap
- [x] Export CSV
- [x] Navigation desktop (sidebar) et mobile (bottom nav)
- [x] Bouton flottant "+" sur mobile
- [x] Déconnexion

### Marketing & Leads (Complété - Mars 2026)
- [x] Page Profil conseiller (nom compagnie, logo, couleurs)
- [x] **Générateur de formulaires multiples**
  - Page liste des formulaires (`/formulaires`)
  - Création/édition de formulaires (`/formulaires/new`, `/formulaires/:id/edit`)
  - Slugs uniques par formulaire
  - Sélection de langues par formulaire (FR, EN, ES, HT)
  - Besoins/options personnalisables avec traductions
  - Couleurs et branding personnalisables
- [x] Formulaire public dynamique (`/f/:slug`)
  - Chargement par slug
  - Sélecteur de langue (si plusieurs langues)
  - Besoins personnalisés du formulaire
  - Option "devenir conseiller"
- [x] Gestion des leads
  - Liste des leads avec formulaire source
  - Conversion lead -> client
  - Badge nombre de nouveaux leads

## Database Schema (Supabase)

### Table users
- id (UUID)
- email (VARCHAR unique)
- encrypted_password (VARCHAR)
- full_name (VARCHAR)
- created_at (TIMESTAMPTZ)

### Table clients
- id (UUID)
- user_id (FK -> users)
- prenom, nom, telephone, courriel, adresse
- conjoint, nb_enfants
- statut (prospect/actif/suivi/ferme)
- date_rdv (TIMESTAMPTZ)
- date_suivi (DATE)
- notes (TEXT)
- source (VARCHAR)
- created_at, updated_at (TIMESTAMPTZ)

### Table conseiller_profiles
- id (UUID)
- user_id (FK -> users)
- nom_compagnie (VARCHAR)
- logo_url (VARCHAR)
- couleur_primaire, couleur_secondaire (VARCHAR)
- message_accueil (TEXT)
- created_at, updated_at (TIMESTAMPTZ)

### Table formulaires
- id (UUID)
- user_id (FK -> users)
- nom (VARCHAR) - nom interne
- slug (VARCHAR unique) - lien unique
- titre (VARCHAR) - titre affiché
- message_accueil (TEXT)
- couleur_primaire, couleur_secondaire (VARCHAR)
- logo_url (VARCHAR)
- langues (TEXT[]) - array de codes langue
- besoins_personnalises (JSONB) - options avec traductions
- actif (BOOLEAN)
- created_at, updated_at (TIMESTAMPTZ)

### Table leads
- id (UUID)
- user_id (FK -> users)
- formulaire_id (FK -> formulaires)
- nom_complet (VARCHAR)
- email (VARCHAR)
- telephone (VARCHAR)
- besoins (TEXT[])
- details (TEXT)
- langue (VARCHAR)
- veut_devenir_conseiller (BOOLEAN)
- converti (BOOLEAN)
- client_id (FK -> clients, nullable)
- created_at (TIMESTAMPTZ)

## Prioritized Backlog

### P0 (Critical) - Complété
- [x] Core authentication multi-tenant
- [x] Dashboard statistics
- [x] Client CRUD
- [x] Agenda view
- [x] Formulaires marketing multiples

### P1 (Important) - À venir
- [ ] Améliorer l'export CSV des clients
- [ ] Ajouter champ "Source du client" (référence, LinkedIn, etc.)
- [ ] Liens `tel:` et `mailto:` sur fiches clients (mobile)

### P2 (Nice to Have) - Futur
- [ ] Historique des interactions (timeline par client)
- [ ] Notifications push/email pour suivis en retard
- [ ] Mode hors-ligne (PWA)
- [ ] Rapports et analytics avancés

## Deployment Notes
- L'application est déployée sur Vercel
- Configuration requise: `vercel.json` pour le routage SPA
- Variables d'environnement Vercel:
  - `REACT_APP_SUPABASE_URL`
  - `REACT_APP_SUPABASE_ANON_KEY`

## Files of Reference
- `/app/frontend/src/lib/supabase.js` - Configuration Supabase
- `/app/frontend/src/contexts/AuthContext.js` - Gestion auth
- `/app/frontend/src/services/marketingApi.js` - API formulaires et leads
- `/app/frontend/src/pages/FormulairesPage.js` - Liste formulaires
- `/app/frontend/src/pages/FormulaireEditPage.js` - Création/édition formulaire
- `/app/frontend/src/pages/PublicFormPage.js` - Formulaire public
- `/app/frontend/src/utils/translations.js` - Traductions multilingues
