import App from '@core/pages/_app'
import { LmCoreComponents } from '@core/utils/config'
import MuiNextLink from '@core/components/link/MuiNextLink'
import type { LmAppProps } from '@core/components/pages/_app'
import { Hydrated } from '../shared/Hydrated'

// The existing generic link does not consume CONFIG.prefetch. Disable prefetch
// explicitly in the baseline, matching the App pilot's environment setting.
LmCoreComponents.lm_link_render = (props) => (
  <MuiNextLink {...props} prefetch={false} />
)
export default function PilotApp(props: LmAppProps) {
  return (
    <>
      <App {...props} />
      <Hydrated />
    </>
  )
}
