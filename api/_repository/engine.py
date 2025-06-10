from functools import cache
from os import environ
from fastapi import logger
from sqlalchemy import Connection, create_engine


logger.logger.setLevel('INFO')
db_conn_string = (
    environ.get("DB_URL_PYTHON")
    or "postgresql://germanbulavkin:postgres@localhost:5432/postgres"
)
logger.logger.info(f"--------\nDatabase connection string: {db_conn_string}\n---------")


@cache
def get_connection() -> Connection:
    try:
        connection = create_engine(db_conn_string).connect()
        logger.logger.info("Connection established")
        return connection
    except:
        raise ValueError("Database connection not initialized")
