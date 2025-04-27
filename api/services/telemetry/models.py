from pydantic import BaseModel, ConfigDict

from services.color_resolver.models import PlotStyle
from services.laps.models.laps import TeamPlotStyleDto


class TelemetryMeasurementDto(BaseModel):
    speed: float
    rpm: float
    throttle: float
    brake: float
    gear: int
    laptime_at: float
    distance: float
    relative_distance: float


class LapDto(BaseModel):
    id: int
    lap_number: int
    telemetry: list[TelemetryMeasurementDto]


class DriverTelemetryMeasurement(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    driver: str
    team: TeamPlotStyleDto
    lap: LapDto
    style: PlotStyle