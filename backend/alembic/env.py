from logging.config import fileConfig
import os
from pathlib import Path
from dotenv import load_dotenv

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Load .env
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import models for autogenerate
import sys
sys.path.insert(0, str(ROOT_DIR))
from models import Base

target_metadata = Base.metadata

def get_url():
    return os.environ.get('DATABASE_URL')

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    from sqlalchemy import create_engine
    
    connectable = create_engine(get_url(), poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
