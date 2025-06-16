from typing import Annotated, Sequence
from urllib.parse import unquote
from fastapi import Depends, FastAPI
from sqlalchemy import Connection
from api._core.models.queries import SessionQueryFilter
from api._repository.engine import (
    get_connection,
)
from api._services.telemetry.TelemetryResolver import TelemetryResolver
from api._services.telemetry.models import AverageTelemetryPlotData
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_methods=["GET", "POST"],
    allow_origins=["*"],
    allow_credentials=True,
)


@app.post(
    "/api/season/{year}/event/{event}/session/{session}/telemetry/average",
    response_model=Sequence[AverageTelemetryPlotData],
)
async def get_averaged_telemetry(
    year: str,
    event: str,
    session: str,
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
        db_connection=connection,
        season=year,
        event=unquote(event),
        session_identifier=unquote(session),
    ).get_average_telemetry(
        filter_=body,
    )
