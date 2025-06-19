from typing import Literal

from pydantic import BaseModel, ConfigDict


PlotStyle = Literal["default", "alternative"]


class TeamDto(BaseModel):
    id_: int
    name: str


class TeamPlotData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    team: TeamDto
    color: str
    driver: str
    style: PlotStyle


class PlotColor(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    color: str
    style: PlotStyle


ColorMap = dict[str, PlotColor]
