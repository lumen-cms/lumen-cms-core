import { ContentSpace } from '../layout/ContentSpace'
import type { PageStoryblok } from '../../typings/generated/components-schema'
import { usePage } from '../provider/SettingsPageProvider'
import { PageRightDrawer } from './PageRightDrawer'

// Preserve the existing context-based entry point.
export default function RightDrawer({
  rightBody
}: {
  rightBody: NonNullable<PageStoryblok['right_body']>
}) {
  const page = usePage()
  return (
    <PageRightDrawer
      rightBody={rightBody}
      headerSpace={<ContentSpace />}
      mobileBreakpoint={page?.mobile_breakpoint}
    />
  )
}
