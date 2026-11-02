import { ContentSpace } from '../layout/ContentSpace'
import type { LmPageProps } from './pageTypes'
import { usePage, useSettings } from '../provider/SettingsPageProvider'
import { LmComponentRender } from '../CoreComponents'
import { PageContent } from './PageContent'
import EmptyContent from './EmptyContent'

// Keep context precedence so live preview edits override the initial route props.
export function LmPage({ content }: LmPageProps): React.JSX.Element {
  const page = usePage()
  const settings = useSettings()
  const currentContent = page?.component ? page : content
  if (!currentContent) return <EmptyContent />
  return (
    <PageContent
      content={currentContent}
      rightDrawerHeader={<ContentSpace />}
      mobileNavBreakpoint={settings.mobile_nav_breakpoint}
      promotion={settings.promotion?.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    />
  )
}
