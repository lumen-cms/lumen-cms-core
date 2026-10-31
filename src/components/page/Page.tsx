import type {
  PageStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'
import { LmCoreComponents } from '../../utils/config'
import RightDrawer from './RightDrawer'
import { MainContent } from './MainContent'
import { LmPageProps } from './pageTypes'
import { usePage } from '../provider/SettingsPageProvider'
import EmptyContent from './EmptyContent'
import { LmComponentRender } from '../CoreComponents'

function sectionForContent(
  page: PageStoryblok | NonNullable<SectionStoryblok['body']>[number]
): SectionStoryblok {
  return {
    component: 'section',
    _uid: page._uid,
    body: page.component === 'page' ? [] : [page]
  }
}

export function LmPage({ content }: LmPageProps): React.JSX.Element {
  const page = usePage()
  const currentContent = page || content
  const body = currentContent?.body || []
  const rightBody = currentContent?.right_body || []
  if (page.component !== 'page') {
    return <LmComponentRender content={sectionForContent(page)} />
  }
  if (!body.length) {
    return <EmptyContent />
  }

  if (
    currentContent.property?.includes('enable_parallax') ||
    body.some((i) => i.component === 'section_parallax')
  ) {
    return (
      // @ts-ignore
      <LmCoreComponents.parallax_provider>
        {rightBody.length > 0 && <RightDrawer rightBody={rightBody} />}
        <MainContent body={body} />
      </LmCoreComponents.parallax_provider>
    )
  }
  return (
    // @ts-ignore
    <>
      {rightBody.length > 0 && <RightDrawer rightBody={rightBody} />}
      <MainContent body={body} />
    </>
  )
}
