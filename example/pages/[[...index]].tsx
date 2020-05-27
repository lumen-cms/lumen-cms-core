import { pagesGetStaticPaths, pagesGetStaticProps } from 'lumen-cms-nextjs'
import { LmDefaultPage } from 'lumen-cms-core'


export const getStaticProps = pagesGetStaticProps
export const getStaticPaths = pagesGetStaticPaths

export default LmDefaultPage
