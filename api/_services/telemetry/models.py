from typing import Sequence
from pydantic import BaseModel, ConfigDict

from api._services.color_resolver.models import PlotStyle
from api._services.laps.models.laps import TeamPlotStyleDto


class TelemetryMeasurementDto(BaseModel):
    speed: float
    rpm: float
    throttle: float
    brake: float
    gear: int
    laptime_at: float
    distance: float
    relative_distance: float


class LapTelemetryDto(BaseModel):
    id: int
    lap_number: int
    telemetry: list[TelemetryMeasurementDto]
    lap_distance: int


class DeltaInstance(BaseModel):
    relative_distance: float
    distance: float
    gap: float
    gap_dt: float


class FastestDelta(BaseModel):
    driver: str
    relative_distance: float

class DriverTelemetryDelta(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    reference: str
    delta: list[DeltaInstance]


class AverageTelemetryPlotData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    driver: str
    team: TeamPlotStyleDto
    style: PlotStyle
    stint_length: int
    telemetry: Sequence[TelemetryMeasurementDto]
    delta: DriverTelemetryDelta | None


class DriverTelemetryPlotData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    driver: str
    team: TeamPlotStyleDto
    style: PlotStyle
    lap: LapTelemetryDto
    delta: DriverTelemetryDelta | None

class LapTelemetriesResponseDto(BaseModel): 
    model_config = ConfigDict(arbitrary_types_allowed=True)

    telemetries: list[DriverTelemetryPlotData]
    delta: list[FastestDelta]
    circuit_distance: float

class AverageTelemetriesResponseDto(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    telemetries: list[AverageTelemetryPlotData]
    delta: list[FastestDelta]
    circuit_distance: float