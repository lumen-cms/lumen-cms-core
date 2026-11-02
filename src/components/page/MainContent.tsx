import { usePage, useSettings } from '../provider/SettingsPageProvider'
import { LmComponentRender } from '../CoreComponents'
import { PageFrame, PageBody, type PageBodyProps } from './PageFrame'

// Compatibility adapter for consumers that use the document contexts.
export function MainContent({ body }: PageBodyProps): React.JSX.Element {
  const page = usePage()
  const settings = useSettings()
  return (
    <PageFrame
      hasRightDrawer={!!page?.right_body?.length}
      mobileBreakpoint={page?.mobile_breakpoint}
      mobileNavBreakpoint={settings.mobile_nav_breakpoint}
      promotion={
        !page?.property?.includes('has_feature') &&
        !page?.property?.includes('disable_promotion') &&
        settings.promotion?.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))
      }
    >
      <PageBody body={body} />
    </PageFrame>
  )
}
