import sys
from typing import Sequence, Tuple
from numpy import concatenate, interp, linspace, trunc
from pandas import DataFrame, Series, read_sql, to_timedelta
from sqlalchemy import Connection, Row, and_, or_, select

from api._core.models.queries import SessionIdentifier, SessionQuery, SessionQueryFilter
from api._repository.repository import (
    Laps,
    SessionResults,
    TelemetryMeasurements,
)
from api._services.color_resolver.ColorResolver import TeamPlotStyleResolver
from api._services.laps.models.laps import TeamPlotStyleDto
from api._services.telemetry.models import (
    DriverTelemetryDelta,
    DriverTelemetryPlotData,
    LapTelemetryDto,
    AverageTelemetryPlotData,
)


def convert_from_kph_to_m_s(kph: float) -> float:
    return kph * 1000 / 3600


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
            "relative_distance",
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
            interpolated_df["relative_distance"] = (
                interpolated_df["distance"]
                / interpolated_df.tail(1)["distance"].iloc[0]
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

        avg_dataframe["gear"] = trunc(avg_dataframe["gear"].to_numpy())
        avg_dataframe["brake"] = trunc(avg_dataframe["brake"].to_numpy())

        return avg_dataframe

    def get_average_telemetry(
        self, filter_: SessionQueryFilter
    ) -> Sequence[AverageTelemetryPlotData]:
        driver_lap_id_entries = [
            [
                query.driver,
                [
                    lap_tuple[0]
                    for lap_tuple in self.db_connection.execute(
                        select(Laps.id).where(
                            and_(
                                Laps.season_year == self.season,
                                Laps.session_type_id == self.session_identifier,
                                Laps.event_name == self.event,
                                Laps.driver_id == query.driver,
                                Laps.lap_number.in_(query.lap_filter or []),
                            ),
                        )
                    ).fetchall()
                ],
            ]
            for query in filter_.queries
        ]

        avg_telemetries = []

        min_laptime = sys.float_info.max
        reference_telemetry = None
        reference_driver = None

        for driver_id, lap_ids in driver_lap_id_entries:
            telemetry_data = read_sql(
                con=self.db_connection,
                sql=select(TelemetryMeasurements).where(
                    and_(TelemetryMeasurements.lap_id.in_(lap_ids))
                ),
            )
            telemetry_data.laptime_at = to_timedelta(
                telemetry_data.laptime_at, unit="s"
            )
            style = self.plot_style_resolver.get_driver_style(driver_id=driver_id)
            avg_telemetry_data = self.average_telemetry_for_driver(telemetry_data)

            laptime = avg_telemetry_data["laptime_at"].tail(1).iloc[0]
            if laptime < min_laptime:
                min_laptime = laptime
                reference_telemetry = avg_telemetry_data
                reference_driver = driver_id

            avg_telemetries.append(
                {
                    "raw_telemetry": avg_telemetry_data,
                    "driver": driver_id,
                    "team": TeamPlotStyleDto(name=style.team.name, color=style.color),
                    "style": style.style,
                    "stint_length": len(lap_ids),
                }
            )
        prepared_telemetries: Sequence[AverageTelemetryPlotData] = []
        if reference_driver and reference_telemetry is not None:
            for avg_telemetry in avg_telemetries:
                prepared_telemetries.append(
                    AverageTelemetryPlotData(
                        telemetry=avg_telemetry["raw_telemetry"].to_dict(
                            orient="records"
                        ),
                        driver=avg_telemetry["driver"],
                        team=avg_telemetry["team"],
                        style=avg_telemetry["style"],
                        stint_length=avg_telemetry["stint_length"],
                        delta=(
                            DriverTelemetryDelta(
                                reference=reference_driver,
                                delta=self._get_delta(
                                    reference_telemetry=reference_telemetry,
                                    target_telemetry=avg_telemetry["raw_telemetry"],
                                    is_aligned=True,
                                ).to_dict(orient="records"),
                            )
                            if avg_telemetry["driver"] != reference_driver
                            else None
                        ),
                    )
                )
        else:
            raise ValueError("No reference driver found")

        return prepared_telemetries

    def _get_reference_lap(self, query_filter: SessionQueryFilter):
        laps = self.db_connection.execute(
            select(Laps.id, Laps.lap_number, Laps.driver_id, Laps.laptime)
            .join(
                SessionResults,
                and_(
                    Laps.event_name == SessionResults.event_name,
                    Laps.session_type_id == SessionResults.session_type_id,
                    Laps.season_year == SessionResults.season_year,
                ),
            )
            .where(
                or_(
                    *[
                        and_(
                            Laps.driver_id == query.driver,
                            Laps.lap_number.in_(query.lap_filter or []),
                            Laps.event_name == self.event,
                            Laps.session_type_id == self.session_identifier,
                            Laps.season_year == self.season,
                        )
                        for query in query_filter.queries
                    ]
                )
            )
            .order_by(Laps.laptime.asc())
        )
        return laps.fetchone()

    def _get_reference_data(self, query_filter: SessionQueryFilter):
        if ref_lap := self._get_reference_lap(query_filter):
            telemetry_data = read_sql(
                con=self.db_connection,
                sql=select(TelemetryMeasurements).where(
                    TelemetryMeasurements.lap_id == ref_lap.id
                ),
            )
            time_offset = ref_lap.laptime - telemetry_data["laptime_at"].iat[-1]
            speed = telemetry_data["speed"].iat[-1]
            telemetry_data["relative_distance"] = telemetry_data["distance"] / (
                telemetry_data["distance"].iat[-1]
                + time_offset * (convert_from_kph_to_m_s(speed))
            )
            return telemetry_data, ref_lap
        raise ValueError("No reference lap found")

    def get_telemetry(
        self, query_filter: SessionQueryFilter
    ) -> list[DriverTelemetryPlotData]:
        arr = []
        ref_telemetry, ref_lap = self._get_reference_data(query_filter)
        for query in query_filter.queries:
            arr.extend(self.get_driver_telemetries(query, ref_lap, ref_telemetry))

        return arr

    def _get_telemetry(self, lap_number: int, driver: str):
        telemetry_dataframe = read_sql(
            con=self.db_connection,
            sql=select(TelemetryMeasurements, Laps.laptime)
            .join(
                Laps,
                and_(Laps.id == TelemetryMeasurements.lap_id),
            )
            .join(
                SessionResults,
                and_(
                    Laps.season_year == SessionResults.season_year,
                    Laps.session_type_id == SessionResults.session_type_id,
                    Laps.event_name == SessionResults.event_name,
                    Laps.driver_id == SessionResults.driver_id,
                ),
            )
            .where(
                and_(
                    SessionResults.season_year == self.season,
                    SessionResults.session_type_id == self.session_identifier,
                    SessionResults.event_name == self.event,
                    Laps.lap_number == lap_number,
                    Laps.driver_id == driver,
                )
            ),
        )
        time_offset = (
            telemetry_dataframe["laptime"].iat[-1]
            - telemetry_dataframe["laptime_at"].iat[-1]
        )

        speed = telemetry_dataframe["speed"].iat[-1]
        telemetry_dataframe["relative_distance"] = telemetry_dataframe["distance"] / (
            telemetry_dataframe["distance"].iat[-1]
            + time_offset * (convert_from_kph_to_m_s(speed))
        )
        return telemetry_dataframe

    def interpolated_boundaries(self, series: Series):
        channel_start = series[1] - series[0]
        channel_end = series[-1] - series[-2]
        return concatenate(
            [[series[0] - channel_start], series, [series[-1] + channel_end]]
        )

    def _get_delta(
        self,
        reference_telemetry: DataFrame,
        target_telemetry: DataFrame,
        is_aligned: bool,
    ):
        delta_df = DataFrame(columns=["distance", "relative_distance", "gap"])
        if is_aligned:
            delta_df["gap"] = (
                reference_telemetry["laptime_at"] - target_telemetry["laptime_at"]
            )
            delta_df["distance"] = target_telemetry["distance"]
            delta_df["relative_distance"] = (
                target_telemetry["distance"] / target_telemetry["distance"].iat[-1]
            )

        else:
            x = reference_telemetry["relative_distance"].to_numpy()

            xp = target_telemetry["relative_distance"].to_numpy()
            fp = target_telemetry["laptime_at"].to_numpy()

            time_at_x = interp(x, xp, fp)

            delta_df["gap"] = time_at_x - reference_telemetry["laptime_at"]
            delta_df["distance"] = reference_telemetry["distance"]
            delta_df["relative_distance"] = (
                reference_telemetry["distance"] / reference_telemetry["distance"].iat[-1]
            )

        return delta_df

    def get_driver_telemetries(
        self,
        query: SessionQuery,
        reference_lap: Row[Tuple[int, int, str]],
        reference_telemetry: DataFrame,
    ) -> list[DriverTelemetryPlotData]:
        telemetries: list[DriverTelemetryPlotData] = []
        plot_style_data = self.plot_style_resolver.get_driver_style(query.driver)

        if isinstance(query.lap_filter, list):
            for lap in query.lap_filter:
                telemetry_dataframe = self._get_telemetry(lap, query.driver)

                delta = None
                if (
                    lap != reference_lap.lap_number
                    or query.driver != reference_lap.driver_id
                ):
                    delta = DriverTelemetryDelta(
                        reference=reference_lap.driver_id,
                        delta=self._get_delta(
                            reference_telemetry=reference_telemetry,
                            target_telemetry=telemetry_dataframe,
                            is_aligned=False,
                        ).to_dict(orient="records"),
                    )
                lap_distance = int(telemetry_dataframe["distance"].tail(1).iloc[0])
                telemetries.append(
                    DriverTelemetryPlotData(
                        driver=query.driver,
                        team=TeamPlotStyleDto(
                            name=plot_style_data.team.name,
                            color=plot_style_data.color,
                        ),
                        style=plot_style_data.style,
                        lap=LapTelemetryDto(
                            id=telemetry_dataframe.iloc[0].lap_id,
                            lap_number=lap,
                            telemetry=telemetry_dataframe.to_dict(orient="records"),
                            lap_distance=lap_distance,
                        ),
                        delta=delta,
                    )
                )
        else:
            raise ValueError(f"No lap filters provided for driver: {query.driver}")

        return telemetries
