import dynamic from 'next/dynamic'

// Both callers render only after their existing visibility checks. Share one
// boundary so the SVG parser is not loaded by pages with no visible SVGs.
const LazyInlineSvg = dynamic(() => import('react-inlinesvg'))

export default LazyInlineSvg
