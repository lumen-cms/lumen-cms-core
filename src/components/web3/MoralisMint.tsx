import { LmComponentRender } from '@LmComponentRender'
import { Alert, MenuItem, TextField } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { MoralisMintProps } from './moralisTypings'
import {
  getMintErrorMessage,
  getPurchaseEventData,
  MintError
} from './eventHelper'
import useWhitelist from './hooks/useWhitelist'
import Skeleton from '@mui/material/Skeleton'
import {
  ButtonStoryblok,
  FlexRowStoryblok
} from '../../typings/generated/components-schema'
import { useContract } from './hooks/useContract'
import { parseEther } from 'ethers/lib/utils'

const envAbi = process.env.NEXT_PUBLIC_ABI
  ? JSON.parse(process.env.NEXT_PUBLIC_ABI)
  : null
export default function MoralisMint({
  content
}: MoralisMintProps): JSX.Element {
  const {
    account,
    error: errorConnect,
    signed,
    isValidatingWhitelist,
    maxAmountWhitelist,
    isCorrectChain,
    selectedChain
  } = useWhitelist(content)
  const abi = envAbi || content.moralis_mint_data?.abi
  const amountRef = useRef<number>(1)
  const contract = useContract(content.contract_token, abi)

  const currentCost =
    content.sale === 'whitelist'
      ? (content.price_whitelist as string)
      : (content.price as string)
  let mintAmount = 1
  if (content.sale === 'whitelist' && content.mint_amount_whitelist) {
    mintAmount = Number(content.mint_amount_whitelist)
  } else if (content.sale === 'public' && content.mint_amount) {
    mintAmount = Number(content.mint_amount)
  }
  if (maxAmountWhitelist) {
    mintAmount = maxAmountWhitelist
  }
  const items: number[] = useMemo(() => {
    const cur = []
    if (mintAmount > 1) {
      for (let i = 1; i <= mintAmount; i++) {
        cur.push(i)
      }
    }
    return cur
  }, [mintAmount])

  const [error, setError] = useState<MintError | null>()
  const [success, setSuccess] = useState<boolean>()

  const trackEvent = (isPurchase?: boolean) => {
    const selectedAmount = amountRef.current || 1
    const { google, facebook } = getPurchaseEventData(content, {
      currentCost,
      amount: selectedAmount
    })
    if (isPurchase) {
      window.fbq && fbq('track', 'Purchase', facebook)
      window.gtag && gtag('event', 'purchase', google)
    } else {
      window.fbq && window.fbq('track', 'InitiateCheckout')
      window.gtag && gtag('event', 'begin_checkout')
    }
  }

  if (isValidatingWhitelist) {
    return <Skeleton />
  }

  if (!account) {
    return (
      <>
        {content.fallback_login_message?.map((block) => (
          <LmComponentRender key={block._uid} content={block} />
        ))}
      </>
    )
  }
  if (!isCorrectChain) {
    return (
      <div className={'py-3'}>
        You are not in the correct Network. Please change to{' '}
        <strong>
          <i>{selectedChain.displayName}</i>
        </strong>
      </div>
    )
  }
  if (error || errorConnect) {
    const errorMessage = error?.message || errorConnect?.message
    let customError
    if (error?.code === 'not_whitelisted') {
      customError = content.fallback_not_whitelisted
    } else if (error?.code === 'sale_not_started') {
      customError = content.fallback_not_started
    } else if (error?.code === 'insufficient_fund') {
      customError = content.fallback_insufficient_funds
    }
    return (
      <div className={'py-3'}>
        <Alert severity={'error'} onClose={() => setError(null)}>
          {customError?.[0]
            ? customError.map((blok) => (
                <LmComponentRender content={blok} key={blok._uid} />
              ))
            : errorMessage}
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <LmComponentRender
        content={
          {
            component: 'flex_row',
            _uid: 'mint-flex-row',
            ...content.mint_flexbox_container?.[0]
          } as FlexRowStoryblok
        }
      >
        {mintAmount > 1 && (
          <TextField
            color={'primary'}
            size={'medium'}
            id={'lm-mint-amount'}
            defaultValue={1}
            select
            style={{
              minWidth: `55px`
            }}
            onChange={(event) => {
              amountRef.current = Number(event.target.value)
            }}
          >
            {items.map((value) => (
              <MenuItem value={value} key={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        )}
        <LmComponentRender
          content={
            {
              component: 'button',
              _uid: 'mint_button_' + content._uid,
              label: 'Mint',
              ...content.mint_style?.[0]
            } as ButtonStoryblok
          }
          onClick={async () => {
            if (content.contract_token && abi && account) {
              const selectedAmount = amountRef.current || 1
              const value = currentCost
                ? parseEther(currentCost).mul(selectedAmount)
                : 0
              trackEvent()
              // const signer = library.getSigner()

              if (content.sale === 'whitelist' && !signed) {
                setError({
                  message:
                    'You are not whitelisted. If you are make sure you have the right account connected.',
                  code: 'not_whitelisted'
                })
                return
              }
              // const contract = new ethers.Contract(
              //   content.contract_token,
              //   abi,
              //   signer
              // )
              try {
                if (process.env.NEXT_PUBLIC_MINT_CALL === 'wild') {
                  await contract.functions.mint(selectedAmount, account, {
                    value: value
                  })
                } else if (
                  process.env.NEXT_PUBLIC_MINT_CALL === 'whitelistonly'
                ) {
                  await contract.functions.mint(
                    selectedAmount,
                    signed,
                    maxAmountWhitelist
                  )
                } else {
                  // TODO
                }
                trackEvent(true)
                setSuccess(true)
              } catch (error: any) {
                if (error.code === 4001) {
                  return
                }
                const currentError = getMintErrorMessage(error)
                window.gtag &&
                  gtag('event', 'exception', {
                    event_category: 'Mint Error',
                    event_label: currentError.code
                  })
                setError(currentError)
              }
            } else {
              setError({
                message:
                  'There is something wrong with the initialization of Web3. Contact us in case the error persist.',
                code: 'unknown'
              })
            }
          }}
        />
      </LmComponentRender>
      {success && (
        <div className={'py-3'}>
          <Alert severity={'success'} onClose={() => setSuccess(false)}>
            {content.success_message?.[0]
              ? content.success_message?.map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))
              : 'Your mint transaction was successful!'}
          </Alert>
        </div>
      )}
    </div>
  )
}
