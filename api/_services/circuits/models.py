from geojson_pydantic import Feature, LineString
from pydantic import BaseModel, StrictInt, StrictStr


class CircuitFeatureProperties(BaseModel):
    id: StrictInt | StrictStr | None
    Location: str
    Name: str
    opened: int
    firstgp: int
    length: int
    altitude: int


class CircuitGeometryDto(BaseModel):
    geojson: Feature[LineString, CircuitFeatureProperties]
    rotation: float
