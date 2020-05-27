import { CONFIG } from '../../utils/config'
import React, { useEffect, useState } from 'react'
import StoryblokService from '../../utils/StoryblokService'
import Head from 'next/head'
import { useAppContext } from '../provider/AppProvider'

const statusCodes = {
  400: 'Bad Request',
  401: 'Not Authorized | Invalid API key',
  404: 'This page could not be found',
  500: 'Internal Server Error',
  501: 'Not Implemented'
}

const getErrorPath = ({ locale, statusCode = 404 }: { locale?: string, statusCode?: number }) => {
  const currentLocale = locale !== CONFIG.defaultLocale ? locale : ''
  const directory = CONFIG.rootDirectory || currentLocale || ''
  return `cdn/stories/${directory ? `${directory}/` : ''}error-${statusCode}`
}

type NotFoundProps = { statusCode?: number, locale?: string }

export function NotFound({ statusCode = 404, locale }: NotFoundProps): JSX.Element {
  const title = (statusCodes as any)[statusCode]
  const { ComponentRender } = useAppContext()

  const [errorContent, setErrorContent] = useState<{ title: string, body: any[] } | null | undefined>(undefined)
  useEffect(
    () => {
      const fetchErrorContent = async () => {
        return await StoryblokService.get(getErrorPath({ statusCode, locale }))
      }

      fetchErrorContent()
        .then(({ data }) => {
          const errorContext = data && data.story && data.story.content
          if (errorContext) {
            setErrorContent(errorContext)
          } else {
            setErrorContent(null)
          }
        })
        .catch(e => {
          console.error(e)
          setErrorContent(null)
        })
    },
    [statusCode]
  )

  const errorTitle = (errorContent && errorContent.title) || `${statusCode} - ${title}`

  return (
    <>
      <Head>
        {errorContent !== undefined && <title>{errorTitle}</title>}
        <meta key="robots" name="robots" content="noindex" />
      </Head>
      <div className="p-5">
        {
          errorContent && errorContent.body && errorContent.body.map((blok, i) => ComponentRender({ content: blok, i}))
        }
        {
          errorContent === null && (
            <div>
              {statusCode ? <h1>{statusCode}</h1> : null}
              <div>
                <h2>{title}.</h2>
              </div>
            </div>
          )
        }
      </div>
    </>
  )
}
