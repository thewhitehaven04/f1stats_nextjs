import Color from "color"
import type { PlotColor } from "../../../shared/client/generated"

export const getColorFromColorMap = (map: Record<string, PlotColor>, driver: string) =>
    map[driver].style === "alternative" ? getAlternativeColor(map[driver].color) : map[driver].color

export const getAlternativeColor = (color: string) =>
    Color(color).isDark() ? Color(color).lighten(0.4).hex() : Color(color).darken(0.4).hex()
