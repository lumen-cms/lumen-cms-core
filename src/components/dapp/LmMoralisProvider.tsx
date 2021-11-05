import { FC } from 'react'
import { MoralisProvider } from 'react-moralis'

const LmMoralisProvider: FC = ({ children }) => {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID as string}
      serverUrl={process.env.NEXT_PUBLIC_SERVER_URL as string}
    >
      {children}
    </MoralisProvider>
  )
}

export default LmMoralisProvider
