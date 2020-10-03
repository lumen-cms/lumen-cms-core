import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { CONFIG } from '@CONFIG'
import { LmComponentRender } from '@LmComponentRender'

const statusCodes = {
  400: 'Bad Request',
  401: 'Not Authorized | Invalid API key',
  404: 'This page could not be found',
  500: 'Internal Server Error',
  501: 'Not Implemented'
}

const getErrorPath = ({
  locale,
  statusCode = 404
}: {
  locale?: string
  statusCode?: number
}) => {
  const currentLocale = locale !== CONFIG.defaultLocale ? locale : ''
  const directory = CONFIG.rootDirectory || currentLocale || ''
  return `cdn/stories/${directory ? `${directory}/` : ''}error-${statusCode}`
}

type NotFoundProps = { statusCode?: number; locale?: string }

export function NotFound({
  statusCode = 404,
  locale
}: NotFoundProps): JSX.Element {
  const title = (statusCodes as any)[statusCode]

  const [errorContent, setErrorContent] = useState<
    { title: string; body: any[] } | null | undefined
  >(undefined)
  const isDev = process.env.NODE_ENV !== 'production'
  const token = isDev ? CONFIG.previewToken : CONFIG.publicToken
  const getParams = new URLSearchParams()
  getParams.append('token', token)
  if (isDev) {
    getParams.append('no_cache', 'true')
  }
  const paramString = getParams.toString()
  useEffect(() => {
    const fetchErrorContent = async () => {
      return fetch(
        `https://cdn-api.lumen.media/api/single-story?slug=cdn/stories/${getErrorPath(
          {
            statusCode,
            locale
          }
        )}&${paramString}`
      ).then((r) => r.json())
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
      .catch((e) => {
        console.error(e)
        setErrorContent(null)
      })
  }, [statusCode, locale, paramString])

  const errorTitle =
    (errorContent && errorContent.title) || `${statusCode} - ${title}`

  return (
    <>
      <Head>
        {errorContent !== undefined && <title>{errorTitle}</title>}
        <meta key="robots" name="robots" content="noindex" />
      </Head>
      <div className="p-5">
        {errorContent &&
          errorContent.body &&
          errorContent.body.map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))}
        {errorContent === null && (
          <div>
            {statusCode ? <h1>{statusCode}</h1> : null}
            <div>
              <h2>{title}.</h2>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
