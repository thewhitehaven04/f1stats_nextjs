from pydantic import BaseModel, ConfigDict


class TelemetryMeasurement(BaseModel):
    speed: float
    rpm: float
    throttle: float
    brake: float
    gear: int
    laptime_at: float
    distance: float

class DriverTelemetryMeasurement(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    driver: str
    telemetry: list[TelemetryMeasurement]