import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from database import Base
import enum

def generate_uuid():
    return str(uuid.uuid4())

class ClientStatus(enum.Enum):
    prospect = "prospect"
    actif = "actif"
    suivi = "suivi"
    ferme = "ferme"

class User(Base):
    __tablename__ = 'users'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    clients = relationship('Client', back_populates='user', cascade='all, delete-orphan')

class Client(Base):
    __tablename__ = 'clients'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    prenom = Column(String(100), nullable=False)
    nom = Column(String(100), nullable=False)
    telephone = Column(String(20), nullable=False)
    courriel = Column(String(255), nullable=True)
    adresse = Column(Text, nullable=True)
    conjoint = Column(String(200), nullable=True)
    nb_enfants = Column(Integer, nullable=True, default=0)
    statut = Column(SQLEnum(ClientStatus), default=ClientStatus.prospect, index=True)
    date_rdv = Column(DateTime(timezone=True), nullable=True)
    date_suivi = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    source = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    user = relationship('User', back_populates='clients')
