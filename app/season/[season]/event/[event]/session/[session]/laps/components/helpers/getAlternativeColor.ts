import Color from "color"

export function getAlternativeColor(color: string) {
    return Color(color).isDark() ? Color(color).saturate(1.3).darken(0.1).hex() : Color(color).saturate(0.8).whiten(0.4).hex()
}
