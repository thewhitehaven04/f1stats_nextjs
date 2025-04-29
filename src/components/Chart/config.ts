import type { FontSpec, TooltipOptions } from "chart.js"

export const SCALE_FONT_CONFIG = {
    family: '"Archivo", sans-serif',
    size: 13,
} satisfies Partial<FontSpec>

export const TICKS_FONT_CONFIG = SCALE_FONT_CONFIG
export const LEGEND_FONT_CONFIG = SCALE_FONT_CONFIG

export const TOOLTIP_CONFIG = {
    enabled: true,
    includeInvisible: false,
    axis: "x",
    mode: "nearest",
    intersect: false,
    titleFont: {
        size: 16,
        family: '"Archivo", sans-serif',
    },
    bodyFont: {
        size: 14,
        family: '"Archivo", sans-serif',
    },
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    cornerRadius: 8,
    boxPadding: 2,
    bodySpacing: 4,
} satisfies Partial<TooltipOptions>
