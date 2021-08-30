import { LmComponentRender } from '@LmComponentRender'
import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
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
