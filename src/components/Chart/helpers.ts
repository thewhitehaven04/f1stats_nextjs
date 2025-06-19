import type { PlotColor } from "@/client/generated"
import { getAlternativeColor } from "../../../app/season/[season]/event/[event]/session/[session]/laps/components/helpers/getAlternativeColor"

export const getColorFromColorMap = (map: Record<string, PlotColor>, driver: string) =>
    map[driver].style === "alternative" ? getAlternativeColor(map[driver].color) : map[driver].color
