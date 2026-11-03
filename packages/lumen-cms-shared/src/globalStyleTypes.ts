export type CSSObject = { [key: string]: string | number | undefined | CSSObject }
export interface GlobalStyleTheme {
 spacing: (value: number) => string
 shape: { borderRadius: number }
 palette: {
  mode: 'light' | 'dark'
  primary: { main: string; contrastText: string }
  secondary: { main: string; contrastText: string }
  error: { main: string; contrastText: string }
  warning: { main: string }; success: { main: string }; info: { main: string }
  text: { primary: string; secondary: string; disabled: string }
  common: { white: string; black: string }
 }
 breakpoints: { only: (value: 'xs') => string; up: (value: 'sm' | 'md' | 'lg') => string }
 alternativeFont?: { alt1?: string; alt2?: string; alt3?: string; alt4?: string }
 toolbar?: { progressColor?: string }
 zIndex?: { tooltip: number }
}
