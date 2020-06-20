import { pagesGetServerSideProps } from 'lumen-cms-nextjs'

export { LmDefaultPage as default } from '../../../../dist/lumen-cms-core.esm'

export const getServerSideProps = pagesGetServerSideProps

