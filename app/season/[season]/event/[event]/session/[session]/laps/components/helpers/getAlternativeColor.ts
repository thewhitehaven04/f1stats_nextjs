import Color from "color"

export function getAlternativeColor(color: string) {
    const transformedColor = `#${color}`
    return Color(transformedColor).isDark()
        ? Color(transformedColor).lighten(0.3).hex()
        : Color(transformedColor).darken(0.3).hex()
}
