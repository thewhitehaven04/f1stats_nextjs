from enum import StrEnum

from pydantic import BaseModel, ConfigDict


class PlotStyle(StrEnum):
    DEFAULT = "default"
    ALTERNATIVE = "alternative"

class TeamDto(BaseModel):
    id_: int
    name: str
class TeamPlotData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    team: TeamDto
    color: str
    driver: str
    style: PlotStyle
