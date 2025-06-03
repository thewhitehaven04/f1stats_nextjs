from os import environ
from sqlalchemy import Connection, create_engine


db_conn_string = (
    environ.get("DB_URL")
    or "postgresql://germanbulavkin:postgres@localhost:5432/postgres"
)
engine = create_engine(db_conn_string)

database_connection: Connection | None = None


def get_connection() -> Connection:
    global database_connection
    if not database_connection:
        raise ValueError("Database connection not initialized")

    return database_connection


def set_connection(connection: Connection):
    global database_connection
    database_connection = connection
