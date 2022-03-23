import { LmComponentRender } from '@LmComponentRender'
import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContentText from '@mui/material/DialogContentText'
import DialogContent from '@mui/material/DialogContent'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import { ButtonStoryblok } from '../../../../typings/generated/components-schema'
import { ShopifyProductItemProps } from '../shopifyTypes'

export function ShopifyProductDescription({ item }: ShopifyProductItemProps) {
  const { config } = useShopifySdkContext()
  const [open, setOpen] = useState<boolean>(false)
  return (
    <>
      <LmComponentRender
        content={
          {
            component: 'button',
            label: 'About this item',
            _uid: '1321',
            ...config?.product_description_trigger?.[0]
          } as ButtonStoryblok
        }
        onClick={() => {
          setOpen(true)
        }}
      />
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            edge="end"
            onClick={() => {
              setOpen(false)
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <DialogContent>
          <DialogContentText
            dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
