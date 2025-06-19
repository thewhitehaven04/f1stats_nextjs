from typing import Sequence
from pydantic import BaseModel, ConfigDict

from api._services.color_resolver.models import ColorMap


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
    point: tuple[float, float]


class DriverTelemetryDelta(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    reference: str
    delta: list[DeltaInstance]


class AverageTelemetryPlotData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    driver: str
    stint_length: int
    telemetry: Sequence[TelemetryMeasurementDto]
    delta: DriverTelemetryDelta | None


class DriverTelemetryPlotData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    driver: str
    lap: LapTelemetryDto
    delta: DriverTelemetryDelta | None


class LapTelemetriesResponseDto(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    telemetries: list[DriverTelemetryPlotData]
    delta: list[FastestDelta]
    circuit_distance: float
    color_map: ColorMap


class AverageTelemetriesResponseDto(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    telemetries: list[AverageTelemetryPlotData]
    delta: list[FastestDelta]
    circuit_distance: float
    color_map: ColorMap
