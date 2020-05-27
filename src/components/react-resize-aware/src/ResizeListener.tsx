// @flow
import * as React from 'react'
import { CSSProperties } from 'react'
import useOnResize from './useOnResize'

const style: CSSProperties = {
  display: 'block',
  opacity: 0,
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: -1
}

// This automatically attaches to itself the resize event listener
// and adds onResize as callback
// @ts-ignore
export default ({ onResize }) => {
  const ref = React.useRef()
  useOnResize(ref, () => onResize(ref))

  // @ts-ignore
  return <iframe style={style} src="about:blank" ref={ref} aria-hidden={true} aria-label="resize-listener" tabIndex={-1}
                 frameBorder={0} />
};
