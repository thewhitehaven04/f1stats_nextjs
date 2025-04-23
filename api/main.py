from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends, FastAPI
from sqlalchemy import Connection
from core.models.queries import SessionIdentifier, SessionQueryFilter
from laps.models.laps import LapSelectionData
from laps.resolver import get_laptime_comparison, get_laptimes
from repository.engine import (
    engine,
    get_connection,
    set_connection,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    with engine.connect() as pg_con:
        set_connection(pg_con)
        yield


app = FastAPI(lifespan=lifespan)


@app.get(
    "/season/{year}/event/{event}/session/{session}/laps",
    response_model=LapSelectionData,
)
async def get_session_laptimes(
    year: str,
    event: str,
    session: SessionIdentifier,
    connection: Annotated[Connection, Depends(get_connection)],
):
    """Retrieve lap times for a specific Formula 1 session.

    Args:
        year (str): The year of the Formula 1 season.
        event (str): The specific event or round number.
        session (SessionIdentifier): The type of session (e.g., Practice 1, Sprint Qualifying, Race).

    Returns:
        Lap times for the specified session.
    """
    return await get_laptimes(
        year=year, event=event, session_identifier=session, connection=connection
    )


@app.post(
    "/season/{year}/event/{event}/session/{session}/laps",
    response_model=LapSelectionData,
)
async def get_session_laptimes_filtered(
    year: str,
    event: str,
    session: SessionIdentifier,
    body: SessionQueryFilter,
    connection: Annotated[Connection, Depends(get_connection)],
):
    """Retrieve filtered lap times for a specific Formula 1 session.

    Args:
        year (str): The year of the Formula 1 season.
        event (str): The specific event or round number.
        session (SessionIdentifier): The type of session (e.g., Practice 1, Sprint Qualifying, Race).
        body (SessionQueryFilter): Filtering criteria for lap time selection.

    Returns:
        Filtered lap times for the specified session.
    """
    return await get_laptime_comparison(
        year=year,
        event=event,
        session_identifier=session,
        filter_=body,
        connection=connection,
    )
