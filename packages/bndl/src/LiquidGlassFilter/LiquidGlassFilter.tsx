import React from 'react'

export const LIQUID_GLASS_FILTER_ID = 'bndl-liquid-glass'

// Displacement map, stretched over each element: red encodes x offset, green
// encodes y. Edges ramp toward the centre so the rim samples the backdrop from
// further inside (reads as lens magnification); the blurred neutral-grey core
// leaves the middle undistorted.
const DISPLACEMENT_MAP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
  <defs>
    <linearGradient id="x"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#000"/></linearGradient>
    <linearGradient id="y" x2="0" y2="1"><stop offset="0" stop-color="#0f0"/><stop offset="1" stop-color="#000"/></linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <rect width="100" height="100" fill="url(#x)"/>
  <rect width="100" height="100" fill="url(#y)" style="mix-blend-mode:screen"/>
  <rect x="12" y="12" width="76" height="76" rx="10" fill="#808080" filter="url(#soft)"/>
</svg>`

const DISPLACEMENT_MAP_URI = `data:image/svg+xml,${encodeURIComponent(DISPLACEMENT_MAP)}`

export interface LiquidGlassFilterProps {
  /** Refraction strength as a fraction of the element's size. */
  strength?: number;
}

/**
 * Renders the SVG filter that `.glass` references for refraction. Mount once,
 * near the root. Chromium-only; other browsers keep the CSS-only look.
 */
const LiquidGlassFilter = ({ strength = 0.12 }: LiquidGlassFilterProps) => (
  // Not display:none — that stops browsers resolving the filter reference.
  <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
    <filter
      id={LIQUID_GLASS_FILTER_ID}
      x="0"
      y="0"
      width="1"
      height="1"
      primitiveUnits="objectBoundingBox"
      colorInterpolationFilters="sRGB"
    >
      <feImage
        href={DISPLACEMENT_MAP_URI}
        x="0"
        y="0"
        width="1"
        height="1"
        preserveAspectRatio="none"
        result="map"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale={strength}
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
)

export default LiquidGlassFilter
