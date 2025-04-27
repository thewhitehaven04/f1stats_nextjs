from numpy import interp, linspace
from pandas import DataFrame, read_sql, to_timedelta
from sqlalchemy import Connection, and_, or_, select

from core.models.queries import SessionIdentifier, SessionQuery, SessionQueryFilter
from repository.repository import (
    Drivers,
    Laps,
    SessionResults,
    TelemetryMeasurements,
)
from services.color_resolver.ColorResolver import TeamPlotStyleResolver
from services.laps.models.laps import TeamPlotStyleDto
from services.telemetry.models import DriverTelemetryMeasurement, LapDto


class TelemetryResolver:

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
        self.plot_style_resolver = TeamPlotStyleResolver(
            db_connection,
            season,
            event,
            session_identifier,
        )

    def average_telemetry_for_driver(self, resampled_telemetry: DataFrame):
        unique_lap_ids = resampled_telemetry["lap_id"].unique()
        resampled_telemetries: list[DataFrame] = []

        lattice = linspace(0, 1, 360)
        columns = [
            "speed",
            "rpm",
            "throttle",
            "brake",
            "gear",
            "laptime_at",
            "distance",
        ]
        for lap_id in unique_lap_ids:
            interpolated_df = DataFrame(columns=columns, index=lattice)
            lap_telemetry = resampled_telemetry[resampled_telemetry["lap_id"] == lap_id]
            xp = (
                lap_telemetry["distance"] / lap_telemetry["distance"].tail(1).values[0]
            ).to_numpy()
            interpolated_df["speed"] = interp(
                lattice, xp, lap_telemetry["speed"].to_numpy()
            )
            interpolated_df["rpm"] = interp(
                lattice, xp, lap_telemetry["rpm"].to_numpy()
            )
            interpolated_df["throttle"] = interp(
                lattice, xp, lap_telemetry["throttle"].to_numpy()
            )
            interpolated_df["brake"] = interp(
                lattice, xp, lap_telemetry["brake"].to_numpy()
            )
            interpolated_df["gear"] = interp(
                lattice, xp, lap_telemetry["gear"].to_numpy()
            )
            interpolated_df["laptime_at"] = interp(
                lattice,
                xp,
                lap_telemetry["laptime_at"].map(lambda x: x.total_seconds()).to_numpy(),
            )
            interpolated_df["distance"] = interp(
                lattice, xp, lap_telemetry["distance"].to_numpy()
            )
            resampled_telemetries.append(interpolated_df)

        avg_dataframe = DataFrame(
            columns=columns,
            index=lattice,
        )

        for column in columns:
            avg_dataframe[column] = sum(
                [
                    resampled_telemetry[column]
                    for resampled_telemetry in resampled_telemetries
                ]
            ) / len(resampled_telemetries)

        return avg_dataframe

    def get_average_telemetry(self, filter_: SessionQueryFilter):
        lap_ids = [
            lap_tuple[0]
            for lap_tuple in self.db_connection.execute(
                select(Laps.id).where(
                    and_(
                        Laps.season_year == self.season,
                        Laps.session_type_id == self.session_identifier.value,
                        Laps.event_name == self.event,
                    ),
                    or_(
                        *[
                            (
                                and_(
                                    Laps.driver_id == fil.driver,
                                    Laps.lap_number.in_(fil.lap_filter),
                                )
                                if fil.lap_filter
                                else and_(
                                    Laps.driver_id == fil.driver,
                                )
                            )
                            for fil in filter_.queries
                        ]
                    ),
                )
            ).fetchall()
        ]
        driver_ids = [
            driver[0]
            for driver in self.db_connection.execute(
                select(SessionResults.driver_id).where(
                    and_(
                        SessionResults.season_year == self.season,
                        SessionResults.session_type_id == self.session_identifier.value,
                        SessionResults.event_name == self.event,
                    )
                )
            ).fetchall()
        ]

        avg_telemetries = []
        for driver_id in driver_ids:
            telemetry_data = read_sql(
                con=self.db_connection,
                sql=select(TelemetryMeasurements).where(
                    and_(TelemetryMeasurements.lap_id.in_(lap_ids))
                ),
            )
            telemetry_data.laptime_at = to_timedelta(
                telemetry_data.laptime_at, unit="s"
            )
            avg_telemetries.append(
                {
                    "telemetry": (
                        self.average_telemetry_for_driver(telemetry_data).to_dict(
                            orient="records"
                        )
                        if not telemetry_data.empty
                        else None
                    ),
                    "driver": driver_id,
                }
            )

        return avg_telemetries

    def get_telemetry(self, query_filter: SessionQueryFilter):
        telemetries = []
        for query in query_filter.queries:
            telemetries.append(self.get_driver_telemetries(query))

    def get_driver_telemetries(
        self, query: SessionQuery
    ) -> list[DriverTelemetryMeasurement]:
        telemetries: list[DriverTelemetryMeasurement] = []

        if isinstance(query.lap_filter, list):
            for lap in query.lap_filter:
                telemetry_dataframe = read_sql(
                    con=self.db_connection,
                    sql=select(TelemetryMeasurements)
                    .join(
                        Laps,
                        and_(Laps.lap_number == lap, Laps.driver_id == query.driver),
                    )
                    .join(
                        Drivers,
                        Laps.driver_id == Drivers.id,
                    ),
                )
                style = self.plot_style_resolver.get_driver_style(query.driver)
                telemetry_dataframe["relative_distance"] = (
                    telemetry_dataframe["distance"]
                    / telemetry_dataframe.tail(1)["distance"].iloc[0]
                )

                telemetries.append(
                    DriverTelemetryMeasurement(
                        driver=query.driver,
                        team=TeamPlotStyleDto(
                            name=style.team.name,
                            color=style.color,
                        ),
                        style=style.style,
                        lap=LapDto(
                            id=telemetry_dataframe[0].lap_id,
                            lap_number=telemetry_dataframe[0].lap_number,
                            telemetry=telemetry_dataframe.to_dict(orient="records"),
                        ),
                    )
                )

        raise ValueError(f"No lap filters provided for driver: {query.driver}")
