from typing import Any
from api._services.color_resolver.models import ColorMap, PlotColor


class ColorMapBuilder:

    def __init__(self) -> None:
        self.map: ColorMap = {}

    def set(self, key: str, value: PlotColor) -> None:
        self.map[key] = value

    def get(self, key: str) -> PlotColor:
        return self.map[key]

    def __call__(self, *args: Any, **kwds: Any) -> ColorMap:
        return self.map