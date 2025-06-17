import sys
from typing import Sequence
from numpy import interp, linspace, ndarray, trunc
from pandas import DataFrame, read_sql, to_timedelta
from sqlalchemy import Connection, and_, or_, select

from api._core.models.queries import SessionIdentifier, SessionQueryFilter
from api._repository.repository import (
    Laps,
    SessionResults,
    TelemetryMeasurements,
)
from api._services.color_resolver.ColorResolver import TeamPlotStyleResolver
from api._services.laps.models.laps import TeamPlotStyleDto
from api._services.telemetry.models import (
    AverageTelemetriesResponseDto,
    DriverTelemetryDelta,
    DriverTelemetryPlotData,
    FastestDelta,
    LapTelemetriesResponseDto,
    LapTelemetryDto,
    AverageTelemetryPlotData,
)


def get_min_index(array: list[float]) -> int:
    return array.index(min(array))


def convert_from_kph_to_m_s(kph: float) -> float:
    return kph * 1000 / 3600


class TelemetryResolver:
    _TELEMETRY_DF_COLUMNS = [
        "speed",
        "rpm",
        "throttle",
        "brake",
        "gear",
        "laptime_at",
        "distance",
        "relative_distance",
        "laptime_dt",
    ]

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

    def _interpolate_telemetry(
        self, telemetry: DataFrame, lattice: ndarray, ref_laptime: float | None = None
    ):
        df = DataFrame(columns=self._TELEMETRY_DF_COLUMNS, index=lattice)

        if ref_laptime:
            adjusted_distance = telemetry["distance"].iat[-1] + (
                (ref_laptime - telemetry["laptime_at"].iat[-1])
                * convert_from_kph_to_m_s(telemetry["speed"].iat[-1])
            )
            rel_dist_xp = (telemetry["distance"] / adjusted_distance).to_numpy()
        else:
            rel_dist_xp = (
                telemetry["distance"] / telemetry["distance"].iat[-1]
            ).to_numpy()

        df["relative_distance"] = lattice
        df["speed"] = interp(lattice, rel_dist_xp, telemetry["speed"].to_numpy())
        df["rpm"] = interp(lattice, rel_dist_xp, telemetry["rpm"].to_numpy())
        df["throttle"] = interp(lattice, rel_dist_xp, telemetry["throttle"].to_numpy())
        df["brake"] = interp(lattice, rel_dist_xp, telemetry["brake"].to_numpy())
        df["gear"] = interp(lattice, rel_dist_xp, telemetry["gear"].to_numpy())
        df["laptime_at"] = interp(
            lattice, rel_dist_xp, telemetry["laptime_at"].to_numpy(), left=0
        )
        df["distance"] = interp(
            lattice, rel_dist_xp, telemetry["distance"].to_numpy(), left=0
        )
        df["laptime_dt"] = df["laptime_at"].diff()
        return df

    def average_telemetry_for_driver(self, telemetry: DataFrame):
        unique_lap_ids = telemetry["lap_id"].unique()
        resampled_telemetries: list[DataFrame] = []

        lattice = linspace(0, 1, 360)
        for lap_id in unique_lap_ids:
            lap_telemetry = telemetry[telemetry["lap_id"] == lap_id]
            interpolated_df = self._interpolate_telemetry(lap_telemetry, lattice)
            resampled_telemetries.append(interpolated_df)

        avg_dataframe = DataFrame(
            columns=self._TELEMETRY_DF_COLUMNS,
            index=lattice,
        )

        for column in self._TELEMETRY_DF_COLUMNS:
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
    ) -> AverageTelemetriesResponseDto:
        deltas: Sequence[FastestDelta] = []
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

        indices = [
            get_min_index(laptime_dt)
            for laptime_dt in zip(
                *[x["raw_telemetry"].laptime_dt.to_numpy() for x in avg_telemetries]
            )
        ]

        deltas = [
            FastestDelta(
                driver=avg_telemetries[index]["driver"],
                relative_distance=avg_telemetries[index][
                    "raw_telemetry"
                ].relative_distance,
            )
            for index in indices
        ]
        return AverageTelemetriesResponseDto(
            telemetries=prepared_telemetries, delta=deltas
        )

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
    ) -> LapTelemetriesResponseDto:
        arr: Sequence[DriverTelemetryPlotData] = []
        ref_telemetry, ref_lap = self._get_reference_data(query_filter)

        lattice = linspace(0, 1, 360)

        deltas_collection = []
        for query in query_filter.queries:
            plot_style_data = self.plot_style_resolver.get_driver_style(query.driver)
            if isinstance(query.lap_filter, list):
                for lap in query.lap_filter:
                    telemetry_dataframe = self._get_telemetry(lap, query.driver)
                    interpolated_reference = self._interpolate_telemetry(
                        telemetry=ref_telemetry,
                        lattice=lattice,
                        ref_laptime=ref_lap.laptime,
                    )
                    interpolated_target = self._interpolate_telemetry(
                        telemetry=telemetry_dataframe,
                        lattice=lattice,
                        ref_laptime=self._get_laptime(
                            lap_number=lap, driver=query.driver
                        ),
                    )

                    telemetry_delta = None
                    if lap != ref_lap.lap_number or query.driver != ref_lap.driver_id:
                        delta = self._get_delta(
                            reference_telemetry=interpolated_reference,
                            target_telemetry=interpolated_target,
                            is_aligned=True,
                        )
                        deltas_collection.append(
                            {"driver": query.driver, "delta": delta}
                        )
                        telemetry_delta = DriverTelemetryDelta(
                            reference=ref_lap.driver_id,
                            delta=delta.to_dict(orient="records"),
                        )
                    lap_distance = int(telemetry_dataframe["distance"].iat[-1])
                    arr.append(
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
                            delta=telemetry_delta,
                        )
                    )
            else:
                raise ValueError("No filter specified")

        deltas = []
        for i, row in enumerate(
            zip(*map(lambda x: x["delta"]["gap_dt"].values, deltas_collection))
        ):
            if all([x > 0 for x in row]):
                deltas.append(
                    FastestDelta(
                        driver=ref_lap.driver_id,
                        relative_distance=lattice[i],
                    )
                )
            else:
                index = row.index(min(row))
                deltas.append(
                    FastestDelta(
                        driver=deltas_collection[index]["driver"],
                        relative_distance=lattice[i],
                    )
                )

        return LapTelemetriesResponseDto(telemetries=arr, delta=deltas)

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

    def _get_laptime(self, lap_number: int, driver: str):
        row = self.db_connection.execute(
            select(Laps.laptime)
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
            )
        ).fetchone()
        if row:
            return row.tuple()[0]
        raise ValueError("Laptime not found")

    def _get_delta(
        self,
        reference_telemetry: DataFrame,
        target_telemetry: DataFrame,
        is_aligned: bool,
    ):
        # def interpolated_boundaries(self, series: Series):
        #     channel_start = series[1] - series[0]
        #     channel_end = series[-1] - series[-2]
        #     return concatenate(
        #         [[series[0] - channel_start], series, [series[-1] + channel_end]]
        #     )

        delta_df = DataFrame(columns=["distance", "relative_distance", "gap"])
        if is_aligned:
            delta_df["gap"] = (
                target_telemetry["laptime_at"] - reference_telemetry["laptime_at"]
            )
            delta_df["distance"] = target_telemetry["distance"]
            delta_df["relative_distance"] = (
                target_telemetry["distance"] / target_telemetry["distance"].iat[-1]
            )
            delta_df["gap_dt"] = delta_df["gap"].diff()
            delta_df['gap_dt'].iloc[0] = 0

        else:
            x = reference_telemetry["relative_distance"].to_numpy()

            xp = target_telemetry["relative_distance"].to_numpy()
            fp = target_telemetry["laptime_at"].to_numpy()

            time_at_x = interp(x, xp, fp)

            delta_df["gap"] = time_at_x - reference_telemetry["laptime_at"]
            delta_df["distance"] = reference_telemetry["distance"]
            delta_df["relative_distance"] = (
                reference_telemetry["distance"]
                / reference_telemetry["distance"].iat[-1]
            )
            delta_df["gap_dt"] = delta_df["gap"].diff()
            delta_df['gap_dt'].iloc[0] = 0

        return delta_df
