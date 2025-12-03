from contextlib import asynccontextmanager
from typing import Annotated
from urllib.parse import unquote
from fastapi import Depends, FastAPI, logger
from sqlalchemy import Connection
from api._repository.engine import (
    get_connection,
)
from api._services.circuits.CircuitResolver import CircuitResolver
from api._services.circuits.models import CircuitGeometryDto

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

@asynccontextmanager
async def lifespan(app):
    yield
    get_connection().close()
    logger.logger.info("DB connection closed")

app.add_middleware(
    CORSMiddleware,
    allow_methods=["GET", "POST"],
    allow_origins=["*"],
    allow_credentials=True,
)


@app.get(
    "/api/season/{year}/event/{event}/circuit/geojson",
    response_model=CircuitGeometryDto,
)
async def get_circuit_geojson(year: str, event: str):
    return CircuitResolver(event=unquote(event), season=year).get_circuit_geometry()
