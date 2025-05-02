import Color from "color"

export function getAlternativeColor(color: string) {
    return Color(color).isDark() ? Color(color).saturate(0.9).darken(0.5).hex() : Color(color).saturate(0.8).darken(0.4).hex()
}
