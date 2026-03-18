from fastapi import FastAPI, APIRouter, HTTPException, Header
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, date, timedelta
import bcrypt
import jwt
import io
import csv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase client
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'default_secret_key')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_HOURS = int(os.environ.get('JWT_EXPIRATION_HOURS', 24))

# Create the main app
app = FastAPI(title="Conseiller Pro CRM API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ Pydantic Models ============

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ClientCreate(BaseModel):
    prenom: str = Field(..., min_length=1)
    nom: str = Field(..., min_length=1)
    telephone: str = Field(..., min_length=1)
    courriel: Optional[str] = None
    adresse: Optional[str] = None
    conjoint: Optional[str] = None
    nb_enfants: Optional[int] = 0
    statut: Optional[str] = "prospect"
    date_rdv: Optional[str] = None
    date_suivi: Optional[str] = None
    notes: Optional[str] = None
    source: Optional[str] = None

class ClientUpdate(BaseModel):
    prenom: Optional[str] = None
    nom: Optional[str] = None
    telephone: Optional[str] = None
    courriel: Optional[str] = None
    adresse: Optional[str] = None
    conjoint: Optional[str] = None
    nb_enfants: Optional[int] = None
    statut: Optional[str] = None
    date_rdv: Optional[str] = None
    date_suivi: Optional[str] = None
    notes: Optional[str] = None
    source: Optional[str] = None

class ClientResponse(BaseModel):
    id: str
    user_id: str
    prenom: str
    nom: str
    telephone: str
    courriel: Optional[str] = None
    adresse: Optional[str] = None
    conjoint: Optional[str] = None
    nb_enfants: Optional[int] = None
    statut: str
    date_rdv: Optional[str] = None
    date_suivi: Optional[str] = None
    notes: Optional[str] = None
    source: Optional[str] = None
    created_at: str
    updated_at: str

class StatsResponse(BaseModel):
    total_clients: int
    total_prospects: int
    rdv_this_month: int
    suivis_pending: int

# ============ Auth Helpers ============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")

def get_user_id_from_auth(authorization: str) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token manquant")
    token = authorization.replace("Bearer ", "")
    payload = decode_token(token)
    return payload.get("user_id")

# ============ Auth Routes ============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(data: UserCreate):
    # Check if user exists
    result = supabase.table('users').select('*').eq('email', data.email).execute()
    if result.data:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
    
    # Create user
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    user_data = {
        'id': user_id,
        'email': data.email,
        'password_hash': hash_password(data.password),
        'created_at': now
    }
    
    supabase.table('users').insert(user_data).execute()
    
    token = create_token(user_id, data.email)
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user_id, email=data.email, created_at=now)
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin):
    result = supabase.table('users').select('*').eq('email', data.email).execute()
    
    if not result.data:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    user = result.data[0]
    if not verify_password(data.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    token = create_token(user['id'], user['email'])
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user['id'], email=user['email'], created_at=user['created_at'])
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(authorization: str = Header(None)):
    user_id = get_user_id_from_auth(authorization)
    result = supabase.table('users').select('*').eq('id', user_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
    
    user = result.data[0]
    return UserResponse(id=user['id'], email=user['email'], created_at=user['created_at'])

# ============ Client Routes ============

@api_router.get("/clients", response_model=List[ClientResponse])
async def get_clients(
    authorization: str = Header(None),
    search: Optional[str] = None,
    statut: Optional[str] = None
):
    user_id = get_user_id_from_auth(authorization)
    
    query = supabase.table('clients').select('*').eq('user_id', user_id)
    
    if statut:
        query = query.eq('statut', statut)
    
    query = query.order('updated_at', desc=True)
    result = query.execute()
    
    clients = result.data or []
    
    # Filter by search if provided
    if search:
        search_lower = search.lower()
        clients = [c for c in clients if 
            search_lower in c.get('prenom', '').lower() or
            search_lower in c.get('nom', '').lower() or
            search_lower in c.get('telephone', '').lower() or
            search_lower in (c.get('courriel') or '').lower()
        ]
    
    return [ClientResponse(**c) for c in clients]

@api_router.post("/clients", response_model=ClientResponse)
async def create_client(
    data: ClientCreate,
    authorization: str = Header(None)
):
    user_id = get_user_id_from_auth(authorization)
    
    now = datetime.now(timezone.utc).isoformat()
    client_data = {
        'id': str(uuid.uuid4()),
        'user_id': user_id,
        'prenom': data.prenom,
        'nom': data.nom,
        'telephone': data.telephone,
        'courriel': data.courriel,
        'adresse': data.adresse,
        'conjoint': data.conjoint,
        'nb_enfants': data.nb_enfants or 0,
        'statut': data.statut or 'prospect',
        'date_rdv': data.date_rdv,
        'date_suivi': data.date_suivi,
        'notes': data.notes,
        'source': data.source,
        'created_at': now,
        'updated_at': now
    }
    
    result = supabase.table('clients').insert(client_data).execute()
    return ClientResponse(**result.data[0])

@api_router.get("/clients/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: str,
    authorization: str = Header(None)
):
    user_id = get_user_id_from_auth(authorization)
    
    result = supabase.table('clients').select('*').eq('id', client_id).eq('user_id', user_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    
    return ClientResponse(**result.data[0])

@api_router.put("/clients/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: str,
    data: ClientUpdate,
    authorization: str = Header(None)
):
    user_id = get_user_id_from_auth(authorization)
    
    # Check if client exists
    check = supabase.table('clients').select('*').eq('id', client_id).eq('user_id', user_id).execute()
    if not check.data:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = supabase.table('clients').update(update_data).eq('id', client_id).execute()
    return ClientResponse(**result.data[0])

@api_router.delete("/clients/{client_id}")
async def delete_client(
    client_id: str,
    authorization: str = Header(None)
):
    user_id = get_user_id_from_auth(authorization)
    
    # Check if client exists
    check = supabase.table('clients').select('*').eq('id', client_id).eq('user_id', user_id).execute()
    if not check.data:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    
    supabase.table('clients').delete().eq('id', client_id).execute()
    return {"message": "Client supprimé avec succès"}

# ============ Agenda Routes ============

@api_router.get("/agenda/rdv", response_model=List[ClientResponse])
async def get_rdv(authorization: str = Header(None)):
    user_id = get_user_id_from_auth(authorization)
    
    result = supabase.table('clients').select('*').eq('user_id', user_id).not_.is_('date_rdv', 'null').order('date_rdv', desc=False).execute()
    
    return [ClientResponse(**c) for c in (result.data or [])]

@api_router.get("/agenda/suivis", response_model=List[ClientResponse])
async def get_suivis(authorization: str = Header(None)):
    user_id = get_user_id_from_auth(authorization)
    
    result = supabase.table('clients').select('*').eq('user_id', user_id).not_.is_('date_suivi', 'null').neq('statut', 'ferme').order('date_suivi', desc=False).execute()
    
    return [ClientResponse(**c) for c in (result.data or [])]

# ============ Stats Route ============

@api_router.get("/stats", response_model=StatsResponse)
async def get_stats(authorization: str = Header(None)):
    user_id = get_user_id_from_auth(authorization)
    
    # Get all clients for this user
    result = supabase.table('clients').select('*').eq('user_id', user_id).execute()
    clients = result.data or []
    
    total_clients = len(clients)
    total_prospects = len([c for c in clients if c.get('statut') == 'prospect'])
    
    # RDV this month
    now = datetime.now(timezone.utc)
    first_day = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    if now.month == 12:
        last_day = now.replace(year=now.year + 1, month=1, day=1)
    else:
        last_day = now.replace(month=now.month + 1, day=1)
    
    rdv_this_month = 0
    for c in clients:
        if c.get('date_rdv'):
            try:
                rdv_date = datetime.fromisoformat(c['date_rdv'].replace('Z', '+00:00'))
                if first_day <= rdv_date < last_day:
                    rdv_this_month += 1
            except:
                pass
    
    # Suivis pending (today or past, not closed)
    today = date.today()
    suivis_pending = 0
    for c in clients:
        if c.get('date_suivi') and c.get('statut') != 'ferme':
            try:
                suivi_date = date.fromisoformat(c['date_suivi'][:10])
                if suivi_date <= today:
                    suivis_pending += 1
            except:
                pass
    
    return StatsResponse(
        total_clients=total_clients,
        total_prospects=total_prospects,
        rdv_this_month=rdv_this_month,
        suivis_pending=suivis_pending
    )

# ============ Export Route ============

@api_router.get("/clients/export/csv")
async def export_clients_csv(authorization: str = Header(None)):
    user_id = get_user_id_from_auth(authorization)
    
    result = supabase.table('clients').select('*').eq('user_id', user_id).order('nom', desc=False).execute()
    clients = result.data or []
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        'Prénom', 'Nom', 'Téléphone', 'Courriel', 'Adresse', 
        'Conjoint', 'Nb Enfants', 'Statut', 'Date RDV', 'Date Suivi', 
        'Notes', 'Source', 'Créé le'
    ])
    
    # Data
    for c in clients:
        writer.writerow([
            c.get('prenom', ''), c.get('nom', ''), c.get('telephone', ''),
            c.get('courriel', ''), c.get('adresse', ''),
            c.get('conjoint', ''), c.get('nb_enfants', 0), c.get('statut', ''),
            c.get('date_rdv', ''), c.get('date_suivi', ''),
            c.get('notes', ''), c.get('source', ''), c.get('created_at', '')
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=clients.csv"}
    )

# ============ Root Route ============

@api_router.get("/")
async def root():
    return {"message": "Conseiller Pro CRM API", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    logger.info("Starting Conseiller Pro CRM API...")

@app.on_event("shutdown")
async def shutdown():
    logger.info("Shutting down Conseiller Pro CRM API...")
