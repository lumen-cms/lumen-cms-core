import { pagesGetStaticPaths, pagesGetStaticProps } from 'lumen-cms-nextjs'

export { LmDefaultPage as default } from '../../../dist/lumen-cms-core.esm'

export const getStaticProps = pagesGetStaticProps
export const getStaticPaths = pagesGetStaticPaths

