import '../utils/wdyr' // add why did you render
import { CONFIG } from '@CONFIG'
// import dynamic from 'next/dynamic'
// import '../components/ecommerce/shopify/ShopifyComponents' // dont forget to enable SSR Hook in _documents
// import { LmFastSpringProvider } from '../components/ecommerce/fastspring/LmFastspringProvider'
import '../components/web3/MoralisComponents'

// export { Auth0App as default } from '../components/pages/_appAuth0'
export { LmDefaultApp as default } from '../components/pages/_appDefault'
// if (process.env.NEXT_PUBLIC_AUTH_API_ASSIGN_ROLE) {
//   LmCoreComponents.lm_app_providers.push(LmFastSpringProvider)
// }

// LmCoreComponents.lm_app_providers.push(LmFastSpringProvider)
// LmCoreComponents.auth_form = dynamic(
//   () =>
//     import(
//       /* webpackChunkName: 'bottomNavigation' */ '../components/auth/AuthForm'
//     )
// )

CONFIG.authPathRequiredRoles = [
  {
    path: '/offensive-1/',
    roles: ['app-offensive']
  },
  {
    path: '/auth/offensive-1/',
    roles: ['app-offensive']
  },
  {
    path: '/de/auth/offensive-1/',
    roles: ['app-offensive']
  },
  {
    path: '/en/auth/offensive-1/',
    roles: ['app-offensive-en']
  }
]

CONFIG.web3MintFunction = async (contract, options) => {
  if (options.sale === 'whitelist' || options.sale === 'code') {
    console.log(options)
    await contract.functions.mint(
      options.mintAmount,
      options.signed,
      options.maxMintAmount || 1,
      options.code
    )
  } else {
    await contract.functions.publicMint(options.mintAmount)
  }
}
