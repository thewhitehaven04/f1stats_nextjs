from os import environ
from fastapi import logger
from sqlalchemy import Connection, create_engine


db_conn_string = (
    "postgresql://germanbulavkin:postgres@localhost:5432/postgres"
)
logger.logger.warning(
    f"--------\nDatabase connection string: {db_conn_string}\n---------"
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
