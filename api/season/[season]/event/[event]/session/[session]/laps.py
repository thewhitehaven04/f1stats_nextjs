from fastapi import FastAPI, logger
from api._core.models.queries import SessionIdentifier, SessionQueryFilter
from api._repository.engine import get_connection 
from api._services.laps.LapDataResolver import LapDataResolver
from api._services.laps.models.laps import LapSelectionData
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_methods=["GET", "POST"],
    allow_origins=["*"],
    allow_credentials=True,
)


@app.post(
    "/api/season/{year}/event/{event}/session/{session}/laps",
    response_model=LapSelectionData,
)
async def get_session_laptimes_filtered(
    year: str,
    event: str,
    session: SessionIdentifier,
    body: SessionQueryFilter,
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
    logger.logger.error(msg=f"Received request for session: {session}, {event}, {year}")
    logger.logger.error(msg=f"Body: {body.model_dump_json()}")
    return LapDataResolver(
        db_connection=get_connection(),
        season=year,
        event=event,
        session_identifier=session,
    ).get_laptime_comparison(
        filter_=body,
    )
