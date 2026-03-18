from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_
from sqlalchemy.orm import selectinload
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

from database import get_db, engine, Base
from models import User, Client, ClientStatus

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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
    model_config = ConfigDict(from_attributes=True)
    id: str
    email: str
    created_at: datetime

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
    date_rdv: Optional[datetime] = None
    date_suivi: Optional[date] = None
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
    date_rdv: Optional[datetime] = None
    date_suivi: Optional[date] = None
    notes: Optional[str] = None
    source: Optional[str] = None

class ClientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    prenom: str
    nom: str
    telephone: str
    courriel: Optional[str]
    adresse: Optional[str]
    conjoint: Optional[str]
    nb_enfants: Optional[int]
    statut: str
    date_rdv: Optional[datetime]
    date_suivi: Optional[date]
    notes: Optional[str]
    source: Optional[str]
    created_at: datetime
    updated_at: datetime

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

async def get_current_user(token: str = None, db: AsyncSession = None) -> User:
    if not token:
        raise HTTPException(status_code=401, detail="Token manquant")
    
    payload = decode_token(token)
    user_id = payload.get("user_id")
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
    
    return user

# ============ Auth Routes ============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    result = await db.execute(select(User).where(User.email == data.email))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
    
    # Create user
    user = User(
        id=str(uuid.uuid4()),
        email=data.email,
        password_hash=hash_password(data.password)
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    token = create_token(user.id, user.email)
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user.id, email=user.email, created_at=user.created_at)
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    token = create_token(user.id, user.email)
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user.id, email=user.email, created_at=user.created_at)
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(authorization: str = None, db: AsyncSession = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token manquant")
    
    token = authorization.replace("Bearer ", "")
    user = await get_current_user(token, db)
    return UserResponse(id=user.id, email=user.email, created_at=user.created_at)

# ============ Client Routes ============

async def get_user_from_auth(authorization: str, db: AsyncSession) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token manquant")
    token = authorization.replace("Bearer ", "")
    return await get_current_user(token, db)

@api_router.get("/clients", response_model=List[ClientResponse])
async def get_clients(
    authorization: str = None,
    search: Optional[str] = None,
    statut: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_from_auth(authorization, db)
    
    query = select(Client).where(Client.user_id == user.id)
    
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Client.prenom.ilike(search_term),
                Client.nom.ilike(search_term),
                Client.telephone.ilike(search_term),
                Client.courriel.ilike(search_term)
            )
        )
    
    if statut:
        query = query.where(Client.statut == ClientStatus(statut))
    
    query = query.order_by(Client.updated_at.desc())
    
    result = await db.execute(query)
    clients = result.scalars().all()
    
    return [ClientResponse(
        id=c.id,
        user_id=c.user_id,
        prenom=c.prenom,
        nom=c.nom,
        telephone=c.telephone,
        courriel=c.courriel,
        adresse=c.adresse,
        conjoint=c.conjoint,
        nb_enfants=c.nb_enfants,
        statut=c.statut.value,
        date_rdv=c.date_rdv,
        date_suivi=c.date_suivi,
        notes=c.notes,
        source=c.source,
        created_at=c.created_at,
        updated_at=c.updated_at
    ) for c in clients]

@api_router.post("/clients", response_model=ClientResponse)
async def create_client(
    data: ClientCreate,
    authorization: str = None,
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_from_auth(authorization, db)
    
    client = Client(
        id=str(uuid.uuid4()),
        user_id=user.id,
        prenom=data.prenom,
        nom=data.nom,
        telephone=data.telephone,
        courriel=data.courriel,
        adresse=data.adresse,
        conjoint=data.conjoint,
        nb_enfants=data.nb_enfants or 0,
        statut=ClientStatus(data.statut) if data.statut else ClientStatus.prospect,
        date_rdv=data.date_rdv,
        date_suivi=data.date_suivi,
        notes=data.notes,
        source=data.source
    )
    
    db.add(client)
    await db.commit()
    await db.refresh(client)
    
    return ClientResponse(
        id=client.id,
        user_id=client.user_id,
        prenom=client.prenom,
        nom=client.nom,
        telephone=client.telephone,
        courriel=client.courriel,
        adresse=client.adresse,
        conjoint=client.conjoint,
        nb_enfants=client.nb_enfants,
        statut=client.statut.value,
        date_rdv=client.date_rdv,
        date_suivi=client.date_suivi,
        notes=client.notes,
        source=client.source,
        created_at=client.created_at,
        updated_at=client.updated_at
    )

@api_router.get("/clients/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: str,
    authorization: str = None,
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_from_auth(authorization, db)
    
    result = await db.execute(
        select(Client).where(
            and_(Client.id == client_id, Client.user_id == user.id)
        )
    )
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    
    return ClientResponse(
        id=client.id,
        user_id=client.user_id,
        prenom=client.prenom,
        nom=client.nom,
        telephone=client.telephone,
        courriel=client.courriel,
        adresse=client.adresse,
        conjoint=client.conjoint,
        nb_enfants=client.nb_enfants,
        statut=client.statut.value,
        date_rdv=client.date_rdv,
        date_suivi=client.date_suivi,
        notes=client.notes,
        source=client.source,
        created_at=client.created_at,
        updated_at=client.updated_at
    )

@api_router.put("/clients/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: str,
    data: ClientUpdate,
    authorization: str = None,
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_from_auth(authorization, db)
    
    result = await db.execute(
        select(Client).where(
            and_(Client.id == client_id, Client.user_id == user.id)
        )
    )
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "statut" and value:
            setattr(client, key, ClientStatus(value))
        else:
            setattr(client, key, value)
    
    client.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(client)
    
    return ClientResponse(
        id=client.id,
        user_id=client.user_id,
        prenom=client.prenom,
        nom=client.nom,
        telephone=client.telephone,
        courriel=client.courriel,
        adresse=client.adresse,
        conjoint=client.conjoint,
        nb_enfants=client.nb_enfants,
        statut=client.statut.value,
        date_rdv=client.date_rdv,
        date_suivi=client.date_suivi,
        notes=client.notes,
        source=client.source,
        created_at=client.created_at,
        updated_at=client.updated_at
    )

@api_router.delete("/clients/{client_id}")
async def delete_client(
    client_id: str,
    authorization: str = None,
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_from_auth(authorization, db)
    
    result = await db.execute(
        select(Client).where(
            and_(Client.id == client_id, Client.user_id == user.id)
        )
    )
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    
    await db.delete(client)
    await db.commit()
    
    return {"message": "Client supprimé avec succès"}

# ============ Agenda Routes ============

@api_router.get("/agenda/rdv", response_model=List[ClientResponse])
async def get_rdv(
    authorization: str = None,
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_from_auth(authorization, db)
    
    result = await db.execute(
        select(Client)
        .where(
            and_(
                Client.user_id == user.id,
                Client.date_rdv.isnot(None)
            )
        )
        .order_by(Client.date_rdv.asc())
    )
    clients = result.scalars().all()
    
    return [ClientResponse(
        id=c.id,
        user_id=c.user_id,
        prenom=c.prenom,
        nom=c.nom,
        telephone=c.telephone,
        courriel=c.courriel,
        adresse=c.adresse,
        conjoint=c.conjoint,
        nb_enfants=c.nb_enfants,
        statut=c.statut.value,
        date_rdv=c.date_rdv,
        date_suivi=c.date_suivi,
        notes=c.notes,
        source=c.source,
        created_at=c.created_at,
        updated_at=c.updated_at
    ) for c in clients]

@api_router.get("/agenda/suivis", response_model=List[ClientResponse])
async def get_suivis(
    authorization: str = None,
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_from_auth(authorization, db)
    
    result = await db.execute(
        select(Client)
        .where(
            and_(
                Client.user_id == user.id,
                Client.date_suivi.isnot(None),
                Client.statut != ClientStatus.ferme
            )
        )
        .order_by(Client.date_suivi.asc())
    )
    clients = result.scalars().all()
    
    return [ClientResponse(
        id=c.id,
        user_id=c.user_id,
        prenom=c.prenom,
        nom=c.nom,
        telephone=c.telephone,
        courriel=c.courriel,
        adresse=c.adresse,
        conjoint=c.conjoint,
        nb_enfants=c.nb_enfants,
        statut=c.statut.value,
        date_rdv=c.date_rdv,
        date_suivi=c.date_suivi,
        notes=c.notes,
        source=c.source,
        created_at=c.created_at,
        updated_at=c.updated_at
    ) for c in clients]

# ============ Stats Route ============

@api_router.get("/stats", response_model=StatsResponse)
async def get_stats(
    authorization: str = None,
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_from_auth(authorization, db)
    
    # Total clients
    total_result = await db.execute(
        select(func.count(Client.id)).where(Client.user_id == user.id)
    )
    total_clients = total_result.scalar() or 0
    
    # Total prospects
    prospects_result = await db.execute(
        select(func.count(Client.id)).where(
            and_(Client.user_id == user.id, Client.statut == ClientStatus.prospect)
        )
    )
    total_prospects = prospects_result.scalar() or 0
    
    # RDV this month
    now = datetime.now(timezone.utc)
    first_day = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    if now.month == 12:
        last_day = now.replace(year=now.year + 1, month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    else:
        last_day = now.replace(month=now.month + 1, day=1, hour=0, minute=0, second=0, microsecond=0)
    
    rdv_result = await db.execute(
        select(func.count(Client.id)).where(
            and_(
                Client.user_id == user.id,
                Client.date_rdv >= first_day,
                Client.date_rdv < last_day
            )
        )
    )
    rdv_this_month = rdv_result.scalar() or 0
    
    # Suivis pending (today or past, not closed)
    today = date.today()
    suivis_result = await db.execute(
        select(func.count(Client.id)).where(
            and_(
                Client.user_id == user.id,
                Client.date_suivi <= today,
                Client.statut != ClientStatus.ferme
            )
        )
    )
    suivis_pending = suivis_result.scalar() or 0
    
    return StatsResponse(
        total_clients=total_clients,
        total_prospects=total_prospects,
        rdv_this_month=rdv_this_month,
        suivis_pending=suivis_pending
    )

# ============ Export Route ============

@api_router.get("/clients/export/csv")
async def export_clients_csv(
    authorization: str = None,
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_from_auth(authorization, db)
    
    result = await db.execute(
        select(Client).where(Client.user_id == user.id).order_by(Client.nom.asc())
    )
    clients = result.scalars().all()
    
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
            c.prenom, c.nom, c.telephone, c.courriel or '', c.adresse or '',
            c.conjoint or '', c.nb_enfants or 0, c.statut.value,
            c.date_rdv.isoformat() if c.date_rdv else '',
            c.date_suivi.isoformat() if c.date_suivi else '',
            c.notes or '', c.source or '', c.created_at.isoformat()
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
    await engine.dispose()
    logger.info("Shutting down Conseiller Pro CRM API...")
