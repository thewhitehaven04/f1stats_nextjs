from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends, FastAPI
from sqlalchemy import Connection
from api._core.models.queries import SessionIdentifier, SessionQueryFilter
from api._repository.engine import engine, get_connection, set_connection
from api._services.laps.LapDataResolver import LapDataResolver
from api._services.laps.models.laps import LapSelectionData


@asynccontextmanager
async def lifespan(app: FastAPI):
    with engine.connect() as pg_con:
        set_connection(pg_con)
        yield
        pg_con.close()


app = FastAPI(lifespan=lifespan)


@app.post(
    "/api/season/{year}/event/{event}/session/{session}/laps",
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

    return LapDataResolver(
        db_connection=connection,
        season=year,
        event=event,
        session_identifier=session,
    ).get_laptime_comparison(
        filter_=body,
    )
