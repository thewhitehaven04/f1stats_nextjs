from sqlalchemy import Connection, create_engine


engine = create_engine("postgresql://germanbulavkin:postgres@localhost:5432/postgres", echo=True)

database_connection: Connection | None = None


def get_connection() -> Connection:
    global database_connection
    if not database_connection:
        raise ValueError("Database connection not initialized")

    return database_connection


def set_connection(connection: Connection):
    global database_connection
    database_connection = connection
