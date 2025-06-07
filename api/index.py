from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends, FastAPI
from sqlalchemy import Connection
from api._core.models.queries import SessionIdentifier, SessionQueryFilter
from api._repository.engine import engine, get_connection, set_connection
from api._services.laps.LapDataResolver import LapDataResolver
from api._services.laps.models.laps import LapSelectionData
from api._services.telemetry.TelemetryResolver import TelemetryResolver
from api._services.telemetry.models import AverageTelemetryPlotData, DriverTelemetryPlotData


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


@app.post(
    "/api/season/{year}/event/{event}/session/{session}/telemetries",
    response_model=list[DriverTelemetryPlotData],
)
async def get_lap_telemetries(
    year: str,
    event: str,
    session: SessionIdentifier,
    body: SessionQueryFilter,
    connection: Annotated[Connection, Depends(get_connection)],
) -> list[DriverTelemetryPlotData]:
    """Retrieve telemetry data for a specific Formula 1 session.

    Args:
        year (str): The year of the Formula 1 season.
        event (str): The specific event or round number.
        session (SessionIdentifier): The type of session (e.g., Practice 1, Sprint Qualifying, Race).
        body (SessionQueryFilter): Filtering criteria for telemetry data selection.
        connection (Connection): Database connection for querying telemetry data.

    Returns:
        Telemetry measurements for the specified session based on the provided filter.
    """
    return TelemetryResolver(
        db_connection=connection,
        season=year,
        event=event,
        session_identifier=session,
    ).get_telemetry(query_filter=body)


@app.post(
    "/api/season/{year}/event/{event}/session/{session}/telemetry/average",
    response_model=list[AverageTelemetryPlotData],
)
async def get_averaged_telemetry(
    year: str,
    event: str,
    session: SessionIdentifier,
    body: SessionQueryFilter,
    connection: Annotated[Connection, Depends(get_connection)],
):
    """Retrieve averaged telemetry data for a specific Formula 1 session.

    Args:
        year (str): The year of the Formula 1 season.
        event (str): The specific event or round number.
        session (SessionIdentifier): The type of session (e.g., Practice 1, Sprint Qualifying, Race).
        body (SessionQueryFilter): Filtering criteria for averaged telemetry data selection.
        connection (Connection): Database connection for querying telemetry data.

    Returns:
        Averaged telemetry measurements for the specified session based on the provided filter.
    """
    return TelemetryResolver(
        db_connection=connection, season=year, event=event, session_identifier=session
    ).get_average_telemetry(
        filter_=body,
    )
