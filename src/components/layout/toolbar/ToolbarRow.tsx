import Grid from '../../../vendor/grid'
import { LmComponentRender } from '@LmComponentRender'
import { LmToolbarRowProps } from './toolbarTypes'
import ToolbarSystemBarRow from './ToolbarSystemBarRow'

export function LmToolbarRow({
  content
}: LmToolbarRowProps): React.JSX.Element {
  if (content.is_system_bar) {
    return <ToolbarSystemBarRow content={content} />
  }
  return (
    <Grid
      container
      justifyContent={content.justify || 'space-between'}
      className="h-100"
      alignItems="center"
      width={'100%'}
    >
      {content.body?.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </Grid>
  )
}
