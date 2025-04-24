from operator import or_

from fastapi import logger
from core.models.queries import SessionIdentifier
from repository.repository import (
    DriverTeamChanges,
    EventSessions,
    SessionResults,
    Teams,
)
from services.color_resolver.models import PlotStyle
from sqlalchemy import Connection, and_, null, select


class StyleResolver:

    def __init__(
        self,
        db_connection: Connection,
        season: str,
        event: str,
        session_identifier: SessionIdentifier,
    ):
        self.db_connection = db_connection
        self.season = season
        self.event = event
        self.session_identifier = session_identifier

    def get_driver_style(self, driver_id: int) -> PlotStyle:
        results = self.db_connection.execute(
            select(SessionResults)
            .where(
                and_(
                    SessionResults.season_year == self.season,
                    SessionResults.event_name == self.event,
                    SessionResults.session_type_id == self.session_identifier.value,
                )
            )
            .join(
                EventSessions,
                and_(
                    EventSessions.event_name == SessionResults.event_name,
                    EventSessions.season_year == SessionResults.season_year,
                    EventSessions.session_type_id == SessionResults.session_type_id,
                ),
            )
            .join(
                DriverTeamChanges,
                and_(
                    DriverTeamChanges.driver_id == SessionResults.driver_id,
                    DriverTeamChanges.timestamp_start <= EventSessions.start_time,
                    or_(
                        DriverTeamChanges.timestamp_end >= EventSessions.start_time,
                        DriverTeamChanges.timestamp_end.is_(null()),
                    ),
                ),
            )
            .add_columns(Teams.id)
        ).fetchall()
        team_id = None
        for result in results:
            if result.driver_id == driver_id:
                team_id = result.teams_id
                break

        for result in results:
            if result.teams_id == team_id:
                return (
                    PlotStyle.DEFAULT
                    if result.driver_id == driver_id
                    else PlotStyle.ALTERNATIVE
                )
        return PlotStyle.DEFAULT