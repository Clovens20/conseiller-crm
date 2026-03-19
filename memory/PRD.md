# Conseiller Pro CRM - Product Requirements Document

## Project Overview
CRM web full-stack pour conseiller en assurance de personnes au Québec (AMF). Application mobile-first permettant de gérer clients, rendez-vous et suivis.

## User Persona
- **Utilisateur principal**: Conseiller en assurance de personnes licencié AMF
- **Contexte**: Travaille en autonomie, rencontre des familles pour plans financiers
- **Besoins**: Gestion clients, rendez-vous, suivis, assurance vie/maladie grave/fonds distincts

## Core Requirements (Static)
1. Authentification JWT (email/password)
2. Dashboard avec 4 statistiques clés
3. CRUD clients avec recherche/filtres
4. Agenda RDV et suivis
5. Éditeur texte riche (gras, souligné, centré, couleurs)
6. Interface mobile-first responsive
7. Export CSV des clients

## Technical Stack
- **Frontend**: React + TailwindCSS + Shadcn/UI
- **Backend**: FastAPI (Python)
- **Database**: Supabase PostgreSQL
- **Auth**: JWT custom implementation
- **Rich Text**: TipTap editor

## What's Been Implemented (MVP - March 2026)
- [x] Page de connexion/inscription
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

## API Endpoints Implemented
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/clients (avec search et statut)
- POST /api/clients
- GET /api/clients/:id
- PUT /api/clients/:id
- DELETE /api/clients/:id
- GET /api/agenda/rdv
- GET /api/agenda/suivis
- GET /api/stats
- GET /api/clients/export/csv

## Database Schema (Supabase)
### Table users
- id (UUID)
- email (VARCHAR unique)
- password_hash (VARCHAR)
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

## Prioritized Backlog

### P0 (Critical) - Completed
- [x] Core authentication
- [x] Dashboard statistics
- [x] Client CRUD
- [x] Agenda view

### P1 (Important) - Future
- [ ] Historique des interactions (timeline par client)
- [ ] Notifications push/email pour suivis en retard
- [ ] Synchronisation calendrier externe

### P2 (Nice to Have) - Future
- [ ] Mode hors-ligne (PWA)
- [ ] Rapports et analytics avancés
- [ ] Intégration signature électronique
- [ ] Multi-conseiller (équipe)

## Next Tasks
1. Ajouter historique des interactions par client
2. Implémenter rappels email pour suivis en retard
3. Améliorer l'export avec plus de formats (Excel, PDF)
4. Ajouter champs personnalisés pour produits d'assurance
