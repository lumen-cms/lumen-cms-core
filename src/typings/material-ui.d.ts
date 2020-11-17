import {
  FastSpringData,
  FastSpringWebhookReceivedData
} from '../components/ecommerce/fastspring/fastSpringTypes'

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    defaultContainerWidth: string | boolean
    drawer: {
      left: string
      right: string
    }
    toolbar: {
      progressColor?: string
      height: {
        mobile: number
        landscape: number
        desktop: number
        custom?: number
        systemBar: number
      }
    }
    alternativeFont: {
      alt1: string
      alt2: string
      alt3: string
      alt4: string
    }
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    defaultContainerWidth?: string | boolean
    drawer: {
      left: string
      right: string
    }
    toolbar: {
      progressColor?: string
      height: {
        mobile: number
        landscape: number
        desktop: number
        custom?: number
        systemBar: number
      }
    }
    alternativeFont?: {
      alt1?: string
      alt2?: string
      alt3?: string
      alt4?: string
    }
  }
}

declare global {
  interface Window {
    fastspring: any
    fscDataCallback: (data: FastSpringData) => void
    fscDataPopupClosed: (
      data: { id?: string; reference?: string } | null
    ) => void
    fscDataPopupWebhookReceived: (data: FastSpringWebhookReceivedData) => void
    adroll: {
      track: (k: string, opts?: any) => void
    }
  }
}
