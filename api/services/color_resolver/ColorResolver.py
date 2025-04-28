from operator import or_

from core.models.queries import SessionIdentifier
from repository.repository import (
    DriverTeamChanges,
    EventSessions,
    SessionResults,
    TeamSeasonColors,
    Teams,
)
from services.color_resolver.models import PlotStyle, TeamDto, TeamPlotData
from sqlalchemy import Connection, and_, null, select


class TeamPlotStyleResolver:

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

    def get_driver_style(self, driver_id: str) -> TeamPlotData:
        results = self.db_connection.execute(
            select(SessionResults)
            .where(
                SessionResults.season_year == self.season,
                SessionResults.event_name == self.event,
                SessionResults.session_type_id == self.session_identifier.value,
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
            .join(
                TeamSeasonColors,
                and_(
                    TeamSeasonColors.team_id == DriverTeamChanges.team_id,
                    TeamSeasonColors.season_year == SessionResults.season_year,
                ),
            )
            .join(Teams, DriverTeamChanges.team_id == Teams.id)
            .add_columns(
                TeamSeasonColors.color,
                Teams.id.label("team_id"),
                Teams.team_display_name,
            )
        ).fetchall()

        team_id = None
        for result in results:
            if result.driver_id == driver_id:
                team_id = result.team_id
                break

        for result in results:
            if result.team_id == team_id:
                return (
                    TeamPlotData(
                        style=PlotStyle.DEFAULT,
                        team=TeamDto(
                            id_=result.team_id,
                            name=result.team_display_name,
                        ),
                        driver=driver_id,
                        color=result.color,
                    )
                    if result.driver_id == driver_id
                    else TeamPlotData(
                        style=PlotStyle.ALTERNATIVE,
                        team=TeamDto(
                            id_=result.team_id,
                            name=result.team_display_name,
                        ),
                        driver=driver_id,
                        color=result.color,
                    )
                )
        raise ValueError(f"Unable to find driver style data for {driver_id}")
