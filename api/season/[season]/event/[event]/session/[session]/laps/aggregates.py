from contextlib import asynccontextmanager
from typing import Annotated
from urllib.parse import unquote
from fastapi import Depends, FastAPI, logger
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Connection

from api._core.models.queries import GetAggregatesRequestDto
from api._repository.engine import get_connection
from api._services.laps.LapDataResolver import LapDataResolver
from api._services.laps.models.laps import LaptimeGroupAggregateData


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_methods=["GET", "POST"],
    allow_origins=["*"],
    allow_credentials=True,
)

@asynccontextmanager
async def lifespan(app):
    yield
    get_connection().close()
    logger.logger.info("DB connection closed")


@app.post(
    "/api/season/{year}/event/{event}/session/{session}/laps/aggregates",
    response_model=list[LaptimeGroupAggregateData],
)
async def get_aggregate_laptime_data(
    year: str,
    event: str,
    session: str,
    body: GetAggregatesRequestDto,
    connection: Annotated[Connection, Depends(get_connection)],
):
    return LapDataResolver(
        db_connection=connection,
        season=year,
        event=unquote(event),
        session_identifier=unquote(session),
    ).get_aggregate_data(
        query=body.queries,
    )
