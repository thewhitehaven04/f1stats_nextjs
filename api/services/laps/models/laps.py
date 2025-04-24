from enum import StrEnum
from math import isnan
from typing import Sequence
from pandas.api.typing import NaTType
from pydantic import BaseModel, ConfigDict, field_serializer

from services.color_resolver.models import PlotStyle


class Compound(StrEnum):
    SOFT = "SOFT"
    MEDIUM = "MEDIUM"
    HARD = "HARD"
    INTERMEDIATE = "INTERMEDIATE"
    WET = "WET"
    UNKNOWN = "UNKNOWN"
    TEST_UNKNOWN = "TEST_UNKNOWN"

class TeamData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True) 

    name: str
    color: str

class LapTimingData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    laptime: float | NaTType
    is_pb: bool
    sector_1_time: float | None
    sector_2_time: float | None
    sector_3_time: float | None
    speedtrap_1: float | None
    speedtrap_2: float | None
    speedtrap_fl: float | None
    stint: float
    compound_id: Compound
    is_inlap: bool
    is_outlap: bool
    is_best_s1: bool
    is_best_s2: bool
    is_best_s3: bool
    is_best_st1: bool
    is_best_st2: bool
    is_best_stfl: bool
    is_personal_best_s1: bool
    is_personal_best_s2: bool
    is_personal_best_s3: bool

    @field_serializer(
        "sector_1_time",
        "sector_2_time",
        "sector_3_time",
        "speedtrap_1",
        "speedtrap_2",
        "speedtrap_fl",
        mode="plain",
        when_used="json",
        return_type=float | None,
    )
    def serialize_float(self, val):
        return None if isnan(val) else val


class StintData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    total_laps: int
    avg_time: float | None
    min_time: float | None
    max_time: float | None
    median: float | None
    low_quartile: float | None
    high_quartile: float | None
    deg_rate: float | None



class DriverLapData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    team: TeamData 
    driver: str
    style: PlotStyle
    session_data: StintData
    stints: Sequence[StintData]
    laps: Sequence[LapTimingData]


class LapSelectionData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    driver_lap_data: list[DriverLapData]
    low_decile: float | None
    high_decile: float | None
    min_time: float | None
    max_time: float | None

    @field_serializer(
        "low_decile",
        "high_decile",
        "min_time",
        "max_time",
        mode="plain",
        when_used="json",
        return_type=float | None,
    )
    def serialize_float(self, val):
        return None if isnan(val) else val


class LapIdentifier:
    driver: str | int
    lap: int
