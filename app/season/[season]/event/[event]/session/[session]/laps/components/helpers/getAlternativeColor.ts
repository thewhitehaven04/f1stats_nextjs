import Color from "color"

export function getAlternativeColor(color: string) {
    return Color(color).isDark() ? Color(color).saturate(0.7).darken(0.6).hex() : Color(color).saturate(0.8).whiten(0.4).hex()
}
