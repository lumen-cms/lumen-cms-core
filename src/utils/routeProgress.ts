import { BProgress } from '@bprogress/core'

// Preserve NProgress's slow, random advance instead of BProgress's larger steps.
export class RouteProgress extends BProgress {
  static trickle() {
    return this.inc(Math.random() * 0.02)
  }
}

RouteProgress.configure({
  easing: 'ease',
  speed: 200,
  trickleSpeed: 800,
  // The existing theme styles supply the appearance; no package CSS is needed.
  template:
    '<div class="bar"><div class="peg"></div></div><div class="spinner"><div class="spinner-icon"></div></div>'
})
