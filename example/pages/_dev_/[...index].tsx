import React from 'react'
import { pagesGetServerSideProps } from 'lumen-cms-nextjs'
import { LmDefaultPage } from 'lumen-cms-core'

export const getServerSideProps = pagesGetServerSideProps
export default LmDefaultPage

