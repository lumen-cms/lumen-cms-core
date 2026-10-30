import { SSR_CONFIG } from '../../utils/initial-props/ssrConfig'
import { getAuslandszeitContent } from '../utils/getAuslandszeitContent'
export function registerAuslandszeitServerHooks() {
  SSR_CONFIG.ssrHooks.componentData.auslandszeit_list_widget =
    getAuslandszeitContent
}
export { getAuslandszeitContent }
