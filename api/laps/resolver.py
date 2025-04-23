from fastapi import logger
from pandas import DataFrame, NamedAgg, read_sql
from sqlalchemy import Connection, and_, null, or_, select
from numpy.polynomial import Polynomial

from repository.repository import (
    DriverTeamChanges,
    Drivers,
    EventSessions,
    Laps,
    Teams,
)
from core.models.queries import SessionIdentifier, SessionQueryFilter

from laps.models.laps import DriverLapData, LapSelectionData, StintData


def _set_purple_sectors(laps: DataFrame):
    purple_s1 = laps["sector_1_time"].min()
    purple_s2 = laps["sector_2_time"].min()
    purple_s3 = laps["sector_3_time"].min()

    laps["is_best_s1"] = laps["sector_1_time"] == purple_s1
    laps["is_best_s2"] = laps["sector_2_time"] == purple_s2
    laps["is_best_s3"] = laps["sector_3_time"] == purple_s3


def _set_purple_speedtraps(laps: DataFrame):
    st1_max = laps["speedtrap_1"].max()
    st2_max = laps["speedtrap_2"].max()
    st3_max = laps["speedtrap_fl"].max()

    laps["is_best_st1"] = laps["speedtrap_1"] == st1_max
    laps["is_best_st2"] = laps["speedtrap_2"] == st2_max
    laps["is_best_stfl"] = laps["speedtrap_fl"] == st3_max


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


def _resolve_lap_data(laps: DataFrame) -> LapSelectionData:
    formatted_laps = laps[
        [
            "driver_id",
            "team_display_name",
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
    logger.logger.error(formatted_laps)

    _set_is_personal_best_sector(formatted_laps)
    _set_is_personal_best(formatted_laps)
    _set_purple_sectors(formatted_laps)
    _set_purple_speedtraps(formatted_laps)

    formatted_laps.set_index(["driver_id"], inplace=True)
    lap_data = []
    for index in formatted_laps.index.unique():
        current_driver_laps = formatted_laps.loc[[index]]
        best_time = current_driver_laps["laptime"].min()
        flying_laps = current_driver_laps[
            current_driver_laps["laptime"] < best_time * 1.07
        ]
        stint_groups = flying_laps.groupby("stint")
        filtered_stint_groups = stint_groups.agg(
            avg_time=NamedAgg(column="laptime", aggfunc="mean"),
            min_time=NamedAgg(column="laptime", aggfunc="min"),
            max_time=NamedAgg(column="laptime", aggfunc="max"),
            low_quartile=NamedAgg(column="laptime", aggfunc=lambda x: x.quantile(0.25)),
            high_quartile=NamedAgg(
                column="laptime", aggfunc=lambda x: x.quantile(0.75)
            ),
            median=NamedAgg(column="laptime", aggfunc=lambda x: x.median()),
            total_laps=NamedAgg(column="laptime", aggfunc="count"),
            deg_rate=NamedAgg(
                column="laptime",
                aggfunc=lambda x: Polynomial.fit(list(range(len(x))), x.values, 1),
            ),
        )
        lap_data.append(
            DriverLapData(
                driver=index,
                team=current_driver_laps["team_display_name"].iloc[0],
                stints=filtered_stint_groups.to_dict(orient="records"),
                session_data=StintData(
                    total_laps=len(current_driver_laps),
                    avg_time=(flying_laps["laptime"].mean()),
                    min_time=(current_driver_laps["laptime"].min()),
                    max_time=(current_driver_laps["laptime"].max()),
                    low_quartile=(current_driver_laps["laptime"].quantile(0.25)),
                    high_quartile=(current_driver_laps["laptime"].quantile(0.75)),
                    median=(flying_laps["laptime"].median()),
                ),
                laps=(current_driver_laps.to_dict(orient="records")),
            )
        )

    lap_data.sort(key=lambda x: x.session_data.min_time)
    flying_laps = formatted_laps[
        formatted_laps["laptime"] < formatted_laps["laptime"].min() * 1.07
    ]
    return LapSelectionData(
        driver_lap_data=lap_data,
        low_decile=flying_laps["laptime"].quantile(0.1),  # type: ignore
        high_decile=flying_laps["laptime"].quantile(0.9),  # type: ignore
        min_time=formatted_laps["laptime"].min(),
        max_time=formatted_laps["laptime"].max(),
    )


async def get_laptimes(
    year: str,
    event: str,
    session_identifier: SessionIdentifier,
    connection: Connection,
):
    lap_data = read_sql(
        con=connection,
        sql=select(Laps, Teams)
        .where(
            and_(
                Laps.season_year == year,
                Laps.session_type_id == session_identifier,
                Laps.event_name == event,
            )
        )
        .join(
            Drivers,
            Laps.driver_id == Drivers.id,
        )
        .join(
            EventSessions,
            and_(
                EventSessions.event_name == event,
                EventSessions.season_year == year,
                EventSessions.session_type_id == session_identifier.value,
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
        )
        .join(
            Teams,
            DriverTeamChanges.team_id == Teams.id,
        ),
    )
    return _resolve_lap_data(lap_data)


async def get_laptime_comparison(
    year: str,
    event: str,
    session_identifier: SessionIdentifier,
    filter_: SessionQueryFilter,
    connection: Connection,
):
    lap_data = read_sql(
        con=connection,
        sql=select(Laps, Teams)
        .where(
            and_(
                Laps.season_year == year,
                Laps.session_type_id == session_identifier.value,
                Laps.event_name == event,
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
                    DriverTeamChanges.timestamp_end.is_(null())
                )
            ),
        )
        .join(
            Teams,
            DriverTeamChanges.team_id == Teams.id,
        )
        .where(
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
            )
        )
    )
    return _resolve_lap_data(lap_data)
