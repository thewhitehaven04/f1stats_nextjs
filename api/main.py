from fastapi import FastAPI

from core.models.queries import SessionIdentifier
from laps.models.laps import LapSelectionData
from laps.resolver import get_laptimes


app = FastAPI()


@app.get(
    "/season/{year}/event/{event}/session/{session}/laps",
    response_model=LapSelectionData,
)
async def get_session_laptimes(
    year: str,
    event: str,
    session: SessionIdentifier,
):
    """Retrieve lap times for a specific Formula 1 session.

    Args:
        year (str): The year of the Formula 1 season.
        event (str): The specific event or round number.
        session (SessionIdentifier): The type of session (e.g., Practice 1, Sprint Qualifying, Race).

    Returns:
        Lap times for the specified session.
    """
    return await get_laptimes(year=year, event=event, session_identifier=session)
