import dynamic from 'next/dynamic'
import { LmCoreComponents } from '../../utils/config'
const AuslandszeitListWidget = dynamic(
  () => import('../components/auslandszeit/AuslandszeitListWidget')
)
export function registerAuslandszeitComponents() {
  LmCoreComponents.auslandszeit_list_widget = AuslandszeitListWidget
}
registerAuslandszeitComponents()
