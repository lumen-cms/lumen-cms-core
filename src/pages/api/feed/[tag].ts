import { NextApiRequest, NextApiResponse } from 'next'
import { StoriesParams } from 'storyblok-js-client'
import { PageItem } from '../../../typings/generated/schema'
import { getAllStoriesOfProject } from '../../../utils/initial-props/storyblokPagesConfig'

const storiesRssXML = (stories: PageItem[], host: string) => {
  let latestPostDate = ''
  let rssItemsXml = ''
  stories.forEach((story) => {
    const date = story.published_at || story.created_at || ''
    const postDate = Date.parse(date)
    const postHref = `${host}/${story.slug}`

    if (!latestPostDate || postDate > Date.parse(latestPostDate)) {
      latestPostDate = date
    }

    rssItemsXml += `
          <item>
            <title><![CDATA[${story.name || ''}]]></title>
            <link>${postHref}</link>
            <pubDate>${date}</pubDate>
            <guid isPermaLink="false">${postHref}</guid>
            <description>
            <![CDATA[${story.content?.meta_description || ''}]]>
            </description>
            <content:encoded>
               <![CDATA[${story.content}]]>
            </content:encoded>
        </item>`
  })
  return {
    rssItemsXml,
    latestPostDate
  }
}

const getXmlFeed = (stories: PageItem[], host: string) => {
  const { rssItemsXml, latestPostDate } = storiesRssXML(stories, host)
  const title = 'title' // @TODO
  const language = 'en' // @TODO
  const description = 'description' // @TODO

  return `<?xml version="1.0" ?>
      <rss
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:content="http://purl.org/rss/1.0/modules/content/"
        xmlns:atom="http://www.w3.org/2005/Atom"
        version="2.0"
      >
        <channel>
            <title><![CDATA[${title}]]></title>
            <link>${host}</link>
            <description>
              <![CDATA[${description}]]>
            </description>
            <language>${language}</language>
            <lastBuildDate>${latestPostDate}</lastBuildDate>
            ${rssItemsXml}
        </channel>
      </rss>`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { tag },
    headers: { host }
  } = req
  const extendDefaultPageConfig: StoriesParams = {
    excluding_fields: 'body,right_body,property,seo_body',
    with_tag: Array.isArray(tag) ? tag.join(',') : tag
  }

  const stories = await getAllStoriesOfProject(extendDefaultPageConfig)
  const storiesXML = getXmlFeed(stories, host || '')
  console.log(storiesXML)
  res.setHeader('Content-Type', 'text/xml')
  res.write(storiesXML)
  res.end()
}
