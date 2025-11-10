# this file is used for local debugging only and is a collection of all the endpoints
# distributed in python serverless functions
from typing import Annotated
from urllib.parse import unquote
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Connection
from api._core.models.queries import (
    AverageTelemetryQuery,
    GetAverageTelemetryQueriesRequestDto,
    GetTelemetryQueriesRequestDto,
    SessionIdentifier,
    SessionQueryFilter,
)
from api._repository.engine import get_connection
from api._services.circuits.CircuitResolver import CircuitResolver
from api._services.circuits.models import CircuitGeometryDto
from api._services.laps.LapDataResolver import LapDataResolver
from api._services.laps.models.laps import SessionLapsData
from api._services.telemetry.TelemetryResolver import TelemetryResolver
from api._services.telemetry.models import (
    AverageTelemetriesResponseDto,
    LapTelemetriesResponseDto,
)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_methods=["GET", "POST"],
    allow_origins=["*"],
    allow_credentials=True,
)


@app.post(
    "/api/season/{year}/event/{event}/session/{session}/laps",
    response_model=SessionLapsData,
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
        event=unquote(event),
        session_identifier=unquote(session),
    ).get_laptime_comparison(
        filter_=body,
    )


@app.post(
    "/api/season/{year}/event/{event}/session/{session}/telemetries",
    response_model=LapTelemetriesResponseDto,
)
async def get_lap_telemetries(
    year: str,
    event: str,
    session: SessionIdentifier,
    body: GetTelemetryQueriesRequestDto,
    connection: Annotated[Connection, Depends(get_connection)],
) -> LapTelemetriesResponseDto:
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
        event=unquote(event),
        session_identifier=unquote(session),
    ).get_telemetry(query_filter=body.queries)


@app.post(
    "/api/season/{year}/event/{event}/session/{session}/telemetry/average",
    response_model=AverageTelemetriesResponseDto,
)
async def get_average_lap_telemetries(
    year: str,
    event: str,
    session: SessionIdentifier,
    body: GetAverageTelemetryQueriesRequestDto,
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
        db_connection=connection,
        season=year,
        event=unquote(event),
        session_identifier=unquote(session),
    ).get_average_telemetry(
        queries=body.queries,
    )


@app.get(
    "/api/season/{year}/event/{event}/circuit/geojson",
    response_model=CircuitGeometryDto,
)
async def get_circuit_geojson(year: str, event: str):
    return CircuitResolver(event=unquote(event), season=year).get_circuit_geometry()
