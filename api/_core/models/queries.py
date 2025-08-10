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


class GroupRequest(BaseModel):
    name: str
    color: str

class SessionQuery(BaseModel):
    driver: str
    lap_filter: list[int] | None
    group: GroupRequest | None 


class SessionQueryFilter(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    queries: list[SessionQuery]


class LapRequestBody(BaseModel):
    lap_ids: list[int]
