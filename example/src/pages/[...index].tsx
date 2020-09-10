import { pagesGetStaticPaths, pagesGetStaticProps } from '../../../../lumen-cms-nextjs/src'

export { LmDefaultPage as default } from '../../../src'

export const getStaticProps = pagesGetStaticProps
export const getStaticPaths = pagesGetStaticPaths

