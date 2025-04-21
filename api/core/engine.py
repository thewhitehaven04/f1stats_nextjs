from sqlalchemy import create_engine

# temporary for dev
engine = create_engine('postgresql://germanbulavkin:postgres@127.0.0.1:5432/postgres')

db_connection = engine.connect()