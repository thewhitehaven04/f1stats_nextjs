from typing import Annotated
from urllib.parse import unquote
from fastapi import Depends, FastAPI
from sqlalchemy import Connection
from api._repository.engine import (
    get_connection,
)
from api._services.circuits.CircuitResolver import CircuitResolver
from api._services.circuits.models import CircuitGeometryDto

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

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
async def get_circuit_geojson(
    year: str, event: str, connection: Annotated[Connection, Depends(get_connection)]
):
    return CircuitResolver(
        db_connection=connection, event=unquote(event), season=year
    ).get_circuit_geometry()
