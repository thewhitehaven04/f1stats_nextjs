from fastapi import logger
from pandas import DataFrame, NamedAgg, read_sql
from sqlalchemy import Connection, and_, null, or_, select
from numpy.polynomial import Polynomial

from api._repository.repository import (
    DriverTeamChanges,
    Drivers,
    EventSessions,
    Laps,
)
from api._core.models.queries import (
    AggregateLapDataQuery,
    SessionIdentifier,
    SessionQueryFilter,
)

from api._services.color_resolver.ColorMap import ColorMapBuilder
from api._services.color_resolver.ColorResolver import TeamPlotStyleResolver
from api._services.color_resolver.models import PlotColor
from api._services.laps.models.laps import (
    DriverLapData,
    LaptimeGroupAggregateData,
    SessionLapsData,
    StintData,
)


class LapDataResolver:
    """
    Resolver for processing and analyzing lap time data in Formula 1 sessions.

    Provides methods to extract, transform, and analyze lap time information for drivers,
    including personal best sectors, purple sectors, and comprehensive lap statistics.

    Attributes:
        db_connection (Connection): Database connection for querying lap data
        season (str): Formula 1 season year
        event (str): Specific event/race name
        session_identifier (SessionIdentifier): Identifier for the specific session type
        plot_style_resolver (StyleResolver): Resolver for generating driver-specific plot styles
    """

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
        self.team_plot_style_resolver = TeamPlotStyleResolver(
            db_connection, season, event, session_identifier
        )

    @staticmethod
    def _set_purple_sectors(laps: DataFrame):
        purple_s1 = laps["sector_1_time"].min()
        purple_s2 = laps["sector_2_time"].min()
        purple_s3 = laps["sector_3_time"].min()

        laps["is_best_s1"] = laps["sector_1_time"] == purple_s1
        laps["is_best_s2"] = laps["sector_2_time"] == purple_s2
        laps["is_best_s3"] = laps["sector_3_time"] == purple_s3

    @staticmethod
    def _set_purple_speedtraps(laps: DataFrame):
        st1_max = laps["speedtrap_1"].max()
        st2_max = laps["speedtrap_2"].max()
        st3_max = laps["speedtrap_fl"].max()

        laps["is_best_st1"] = laps["speedtrap_1"] == st1_max
        laps["is_best_st2"] = laps["speedtrap_2"] == st2_max
        laps["is_best_stfl"] = laps["speedtrap_fl"] == st3_max

    @staticmethod
    def _set_is_personal_best_sector(laps: DataFrame):
        pb_s1 = laps.groupby("driver_id")["sector_1_time"].min()
        pb_s2 = laps.groupby("driver_id")["sector_2_time"].min()
        pb_s3 = laps.groupby("driver_id")["sector_3_time"].min()

        for driver_id, laptime in pb_s1.items():
            sector_times = laps[laps["driver_id"] == driver_id]["sector_1_time"]
            laps.loc[laps["driver_id"] == driver_id, "is_personal_best_s1"] = (
                sector_times == laptime
            )

        for driver_id, laptime in pb_s2.items():
            sector_times = laps[laps["driver_id"] == driver_id]["sector_2_time"]
            laps.loc[laps["driver_id"] == driver_id, "is_personal_best_s2"] = (
                sector_times == laptime
            )

        for driver_id, laptime in pb_s3.items():
            sector_times = laps[laps["driver_id"] == driver_id]["sector_3_time"]
            laps.loc[laps["driver_id"] == driver_id, "is_personal_best_s3"] = (
                sector_times == laptime
            )

    @staticmethod
    def _set_is_personal_best(laps: DataFrame):
        # this personal best returns actual personal best laptime across
        # the whole session, unlike the built in `IsPersonalBest` attribute
        # that returns "rolling" personal best, i.e. the personal best at that point in time
        # which means that there are multiple personal bests in the same session
        personal_best_laps = laps.groupby("driver_id")["laptime"].min()
        for driver, laptime in personal_best_laps.items():
            current_driver_laptimes = laps[laps["driver_id"] == driver]["laptime"]
            laps.loc[laps["driver_id"] == driver, "is_pb"] = (
                laptime == current_driver_laptimes
            )

        return laps

    def _get_laps_dataframe_by_filter(self, filter_: SessionQueryFilter):
        return read_sql(
            con=self.db_connection,
            sql=select(Laps)
            .where(
                and_(
                    Laps.season_year == self.season,
                    Laps.session_type_id == self.session_identifier,
                    Laps.event_name == self.event,
                    or_(
                        *[
                            (
                                and_(
                                    Laps.driver_id == fil.driver,
                                    Laps.lap_number.in_(fil.lap_number_filter),
                                )
                                if fil.lap_number_filter
                                else and_(
                                    Laps.driver_id == fil.driver,
                                )
                            )
                            for fil in filter_.queries
                        ]
                    ),
                )
            )
            .join(
                Drivers,
                Laps.driver_id == Drivers.id,
            )
            .join(
                EventSessions,
                and_(
                    EventSessions.event_name == Laps.event_name,
                    EventSessions.season_year == Laps.season_year,
                    EventSessions.session_type_id == Laps.session_type_id,
                ),
            )
            .join(
                DriverTeamChanges,
                and_(
                    DriverTeamChanges.driver_id == Drivers.id,
                    DriverTeamChanges.timestamp_start <= EventSessions.start_time,
                    or_(
                        DriverTeamChanges.timestamp_end >= EventSessions.start_time,
                        DriverTeamChanges.timestamp_end.is_(null()),
                    ),
                ),
            ),
        )

    def _get_laps_dataframe_by_query(self, query: list[AggregateLapDataQuery]):
        return read_sql(
            con=self.db_connection,
            sql=select(
                Laps.id,
                Laps.laptime,
                Laps.sector_1_time,
                Laps.sector_2_time,
                Laps.sector_3_time,
            )
            .where(
                and_(
                    Laps.season_year == self.season,
                    Laps.session_type_id == self.session_identifier,
                    Laps.event_name == self.event,
                    or_(
                        *[
                            (
                                and_(
                                    Laps.id.in_(q.lap_id_filter),
                                )
                            )
                            for q in query
                        ]
                    ),
                )
            )
            .join(
                Drivers,
                Laps.driver_id == Drivers.id,
            )
            .join(
                EventSessions,
                and_(
                    EventSessions.event_name == Laps.event_name,
                    EventSessions.season_year == Laps.season_year,
                    EventSessions.session_type_id == Laps.session_type_id,
                ),
            )
            .join(
                DriverTeamChanges,
                and_(
                    DriverTeamChanges.driver_id == Drivers.id,
                    DriverTeamChanges.timestamp_start <= EventSessions.start_time,
                    or_(
                        DriverTeamChanges.timestamp_end >= EventSessions.start_time,
                        DriverTeamChanges.timestamp_end.is_(null()),
                    ),
                ),
            ),
        )

    def get_laptime_comparison(
        self,
        filter_: SessionQueryFilter,
    ):
        laps = self._get_laps_dataframe_by_filter(filter_)

        color_map = ColorMapBuilder()

        formatted_laps = laps[
            [
                "id",
                "driver_id",
                "laptime",
                "sector_1_time",
                "sector_2_time",
                "sector_3_time",
                "speedtrap_1",
                "speedtrap_2",
                "speedtrap_fl",
                "stint",
                "compound_id",
                "lap_number",
                "is_inlap",
                "is_outlap",
            ]
        ]
        self._set_is_personal_best_sector(formatted_laps)
        self._set_is_personal_best(formatted_laps)
        self._set_purple_sectors(formatted_laps)
        self._set_purple_speedtraps(formatted_laps)

        formatted_laps.set_index(["driver_id"], inplace=True)
        lap_data = []
        for index in formatted_laps.index.unique():
            non_filtered_laps = formatted_laps.loc[[index]]
            current_driver_laps = non_filtered_laps[
                non_filtered_laps["is_inlap"] == False
            ]
            current_driver_laps = current_driver_laps[
                current_driver_laps["is_outlap"] == False
            ]
            stint_groups = current_driver_laps.groupby("stint")
            filtered_stint_groups = stint_groups.agg(
                avg_time=NamedAgg(column="laptime", aggfunc="mean"),
                min_time=NamedAgg(column="laptime", aggfunc="min"),
                max_time=NamedAgg(column="laptime", aggfunc="max"),
                low_quartile=NamedAgg(
                    column="laptime", aggfunc=lambda x: x.quantile(0.25)
                ),
                high_quartile=NamedAgg(
                    column="laptime", aggfunc=lambda x: x.quantile(0.75)
                ),
                median=NamedAgg(column="laptime", aggfunc=lambda x: x.median()),
                total_laps=NamedAgg(column="laptime", aggfunc="count"),
                deg_rate=NamedAgg(
                    column="laptime",
                    aggfunc=lambda x: Polynomial.fit(
                        list(range(len(x))), x.values, 1
                    ).coef[1],
                ),
            )
            driver_style = self.team_plot_style_resolver.get_driver_style(
                driver_id=index
            )
            color_map.set(
                index, PlotColor(color=driver_style.color, style=driver_style.style)
            )
            lap_data.append(
                DriverLapData(
                    driver=index,
                    stints=filtered_stint_groups.to_dict(orient="records"),
                    session_data=StintData(
                        total_laps=len(non_filtered_laps),
                        avg_time=(current_driver_laps["laptime"].mean()),
                        min_time=(non_filtered_laps["laptime"].min()),
                        max_time=(non_filtered_laps["laptime"].max()),
                        low_quartile=(current_driver_laps["laptime"].quantile(0.25)),
                        high_quartile=(current_driver_laps["laptime"].quantile(0.75)),
                        median=(current_driver_laps["laptime"].median()),
                        deg_rate=None,
                    ),
                    laps=(non_filtered_laps.to_dict(orient="records")),
                )
            )

        lap_data.sort(key=lambda x: x.session_data.min_time)
        flying_laps = formatted_laps[
            formatted_laps["laptime"] < formatted_laps["laptime"].min() * 1.07
        ]
        return SessionLapsData(
            driver_lap_data=lap_data,
            color_map=color_map(),
            low_decile=flying_laps["laptime"].quantile(0.1),  # type: ignore
            high_decile=flying_laps["laptime"].quantile(0.9),  # type: ignore
            min_time=formatted_laps["laptime"].min(),
            max_time=formatted_laps["laptime"].max(),
        )

    def get_aggregate_data(
        self, query: list[AggregateLapDataQuery]
    ) -> list[LaptimeGroupAggregateData]:
        df = self._get_laps_dataframe_by_query(query)
        aggs: list[LaptimeGroupAggregateData] = []

        for item in query:
            if item.lap_id_filter:
                current = df[df["id"].isin(item.lap_id_filter)]
                current = current.agg(
                    avg_time=NamedAgg(column="laptime", aggfunc="mean"),
                    min_time=NamedAgg(column="laptime", aggfunc="min"),
                    max_time=NamedAgg(column="laptime", aggfunc="max"),
                    slope=NamedAgg(
                        column="laptime",
                        aggfunc=lambda x: Polynomial.fit(
                            list(range(len(x))), x.values, 1
                        ).coef[1],
                    ),
                    average_s1=NamedAgg(column="sector_1_time", aggfunc='mean'),
                    average_s2=NamedAgg(column="sector_2_time", aggfunc='mean'),
                    average_s3=NamedAgg(column="sector_3_time", aggfunc='mean'),
                ).to_dict()
                aggs.append(
                    LaptimeGroupAggregateData(
                        group=item.group_name,
                        avg_time=current['laptime']['avg_time'],
                        min_time=current['laptime']['min_time'],
                        max_time=current['laptime']['max_time'],
                        slope=current['laptime']['slope'],
                        avg_s1_time=current['sector_1_time']['average_s1'],
                        avg_s2_time=current['sector_2_time']['average_s2'],
                        avg_s3_time=current['sector_3_time']['average_s3'],
                    )
                )

        return aggs
