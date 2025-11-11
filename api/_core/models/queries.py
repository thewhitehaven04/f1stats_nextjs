from typing import Literal

from pydantic import BaseModel, ConfigDict


SessionIdentifier = Literal[
    "Race",
    "Qualifying",
    "Sprint",
    "Sprint Qualifying",
    "Sprint Shootout",
    "Practice 1",
    "Practice 2",
    "Practice 3",
]


class RaceQueryRequest(BaseModel):
    year: str
    round: str
    type: Literal["Sprint", "Race"]


class QualiQueryRequest(BaseModel):
    year: str
    round: str
    type: Literal["Qualifying", "Sprint Shootout", "Sprint Qualifying"]


class PracticeQueryRequest(BaseModel):
    year: str
    round: str
    type: Literal["Practice 1", "Practice 2", "Practice 3"]


class TestingQueryRequest(BaseModel):
    year: str
    round: str
    day: int


class GroupDto(BaseModel):
    name: str
    color: str


class AverageTelemetryQuery(BaseModel):
    lap_id_filter: list[int]
    group: GroupDto

class AggregateLapDataQuery(BaseModel):
    lap_id_filter: list[int]
    group_name: str 

class GetAverageTelemetryQueriesRequestDto(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    queries: list[AverageTelemetryQuery]

class GetAggregatesRequestDto(BaseModel):
    queries: list[AggregateLapDataQuery]

class LapTelemetryQuery(BaseModel):
    driver: str
    lap_id_filter: list[int]

class GetTelemetryQueriesRequestDto(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    queries: list[LapTelemetryQuery]

class SessionQuery(BaseModel):
    driver: str
    lap_number_filter: list[int]

class SessionQueryFilter(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    queries: list[SessionQuery]


class LapRequestBody(BaseModel):
    lap_ids: list[int]
