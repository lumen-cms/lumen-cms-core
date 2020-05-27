import React from 'react'
import { ButtonStoryblok } from '../src/typings/generated/components-schema'
import {  LmComponentRender as LmButton } from '../src/'
import { storyButton } from '../src/storybook/core/various'

const defaultProps: ButtonStoryblok = {
  label: 'Text Button',
  _uid: '123',
  component: 'button'
}

const iconProps: ButtonStoryblok = {
  icon: { name: 'home' },
  _uid: '123',
  component: 'button'
}

const twitterPng = 'https://img2.storyblok.com/f/66717/273x256/42d8e47bd5/twitter-icon.png'

const iconButton: ButtonStoryblok = {
  _uid: '34334',
  component: 'button',
  image: twitterPng
}

export default {
  title: 'Button'
}

export const MaterialButton = () => (
  <>
    <h3>Default</h3>
    <div className="p-2">
      <LmButton content={defaultProps} />
      <LmButton content={{ ...defaultProps, icon: { name: 'home' }, color: 'primary' }} />
      <LmButton content={{ ...defaultProps, icon: { name: 'home' }, color: 'secondary' }} />
      <LmButton content={{ ...defaultProps, icon: { name: 'home' }, custom_color: { rgba: '#219' } }} />
      <LmButton content={{ ...iconProps, color: 'secondary' }} />
      <LmButton content={{ ...iconProps, custom_color: { rgba: '#219' } }} />
    </div>
    <h3>Fab</h3>
    <div className="p-2">
      <LmButton content={{ ...defaultProps, variant: 'fab' }} />
      <LmButton content={{ ...defaultProps, variant: 'fab', icon: { name: 'home' }, color: 'primary' }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'fab',
        icon: { name: 'home' },
        color: 'secondary',
        custom_color: { rgba: '#219' }
      }} />
      <LmButton content={{ ...iconProps, variant: 'fab', color: 'secondary' }} />
      <LmButton content={{ ...iconProps, variant: 'fab', color: 'secondary', custom_color: { rgba: '#219' } }} />
    </div>
    <h3>Dense</h3>
    <div className="p-2">
      <LmButton content={{ ...defaultProps, variant: 'fab', size: 'dense' }} />
      <LmButton
        content={{ ...defaultProps, variant: 'fab', size: 'dense', icon: { name: 'home' }, color: 'primary' }} />
      <LmButton
        content={{ ...defaultProps, variant: 'fab', size: 'dense', icon: { name: 'home' }, color: 'secondary' }} />
      <LmButton content={{ ...iconProps, variant: 'fab', size: 'dense', color: 'secondary' }} />
    </div>

    <h3>Large</h3>
    <div className="p-2">
      <LmButton content={{ ...defaultProps, variant: 'fab', size: 'lm-button-large' }} />
      <LmButton
        content={{
          ...defaultProps,
          variant: 'fab',
          size: 'lm-button-large',
          icon: { name: 'home' },
          color: 'primary'
        }} />
      <LmButton
        content={{
          ...defaultProps,
          variant: 'fab',
          size: 'lm-button-large',
          icon: { name: 'home' },
          color: 'secondary'
        }} />
      <LmButton content={{ ...iconProps, variant: 'fab', size: 'lm-button-large', color: 'secondary' }} />
    </div>
    <div className="p-2">
      <LmButton content={{ ...defaultProps, variant: 'fab', size: 'lm-button-xlarge' }} />
      <LmButton
        content={{
          ...defaultProps,
          variant: 'fab',
          size: 'lm-button-xlarge',
          icon: { name: 'home' },
          color: 'primary'
        }} />
      <LmButton
        content={{
          ...defaultProps,
          variant: 'fab',
          size: 'lm-button-xlarge',
          icon: { name: 'home' },
          color: 'secondary'
        }} />
      <LmButton content={{ ...iconProps, variant: 'fab', size: 'lm-button-xlarge', color: 'secondary' }} />
    </div>
    <div className="p-2">
      <LmButton content={{ ...defaultProps, variant: 'raised' }} />
      <LmButton content={{ ...defaultProps, variant: 'raised', icon: { name: 'home' }, color: 'primary' }} />
      <LmButton content={{ ...defaultProps, variant: 'raised', icon: { name: 'home' }, color: 'secondary' }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'raised',
        icon: { name: 'home' },
        color: 'secondary',
        custom_color: { rgba: '#219' }
      }} />
      <LmButton content={{ ...iconProps, variant: 'raised', color: 'secondary' }} />
      <LmButton
        content={{ ...iconProps, variant: 'raised', color: 'secondary', custom_color: { rgba: '#219' } }} />
    </div>
    <div className="p-2">
      <LmButton content={{ ...defaultProps, variant: 'outlined' }} />
      <LmButton content={{ ...defaultProps, variant: 'outlined', icon: { name: 'home' }, color: 'primary' }} />
      <LmButton content={{ ...defaultProps, variant: 'outlined', icon: { name: 'home' }, color: 'secondary' }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'outlined',
        icon: { name: 'home' },
        color: 'secondary',
        custom_color: { rgba: '#219' }
      }} />
      <LmButton content={{ ...iconProps, variant: 'outlined', color: 'secondary' }} />
      <LmButton
        content={{ ...iconProps, variant: 'outlined', color: 'secondary', custom_color: { rgba: '#219' } }} />
    </div>
    <div className="p-2">
      <LmButton content={{ ...defaultProps, variant: 'outlined', corners: 'lm-button-shaped' }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'outlined',
        icon: { name: 'home' },
        color: 'primary',
        corners: 'lm-button-shaped'
      }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'outlined',
        icon: { name: 'home' },
        color: 'secondary',
        corners: 'lm-button-shaped'
      }} />
      <LmButton
        content={{ ...iconProps, variant: 'outlined', color: 'secondary', corners: 'lm-button-shaped' }} />
    </div>
    <div className="p-2">
      <LmButton
        content={{ ...defaultProps, variant: 'outlined', corners: 'lm-button-square', size: 'dense' }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'outlined',
        icon: { name: 'home' },
        color: 'primary',
        size: 'dense',
        corners: 'lm-button-square'
      }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'outlined',
        icon: { name: 'home' },
        color: 'secondary',
        size: 'dense',
        corners: 'lm-button-square'
      }} />
      <LmButton
        content={{ ...iconProps, variant: 'outlined', color: 'secondary', corners: 'lm-button-square' }} />
    </div>
    <div className="p-2">
      <LmButton
        content={{ ...defaultProps, variant: 'outlined', corners: 'lm-button-square', size: 'lm-button-large' }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'outlined',
        icon: { name: 'home' },
        color: 'primary',
        size: 'lm-button-large',
        corners: 'lm-button-square'
      }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'outlined',
        icon: { name: 'home' },
        color: 'secondary',
        size: 'lm-button-large',
        corners: 'lm-button-square'
      }} />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'secondary',
          corners: 'lm-button-square',
          size: 'lm-button-large'
        }} />
    </div>
    <div className="p-2">
      <LmButton
        content={{ ...defaultProps, variant: 'outlined', corners: 'lm-button-square', size: 'lm-button-xlarge' }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'outlined',
        icon: { name: 'home' },
        color: 'primary',
        size: 'lm-button-xlarge',
        corners: 'lm-button-square'
      }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'raised',
        icon: { name: 'home' },
        color: 'secondary',
        size: 'lm-button-xlarge',
        corners: 'lm-button-square'
      }} />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'secondary',
          corners: 'lm-button-square',
          size: 'lm-button-xlarge'
        }} />
    </div>
    <h3>XLarge</h3>
    <div className="p-2">
      <LmButton
        content={{ ...defaultProps, variant: 'outlined', corners: 'lm-button-shaped', size: 'lm-button-xlarge' }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'outlined',
        icon: { name: 'home' },
        color: 'primary',
        size: 'lm-button-xlarge',
        corners: 'lm-button-shaped'
      }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'raised',
        icon: { name: 'home' },
        color: 'secondary',
        size: 'lm-button-xlarge',
        corners: 'lm-button-shaped'
      }} />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'secondary',
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }} />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'primary',
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }} />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }} />
    </div>
    <div className="p-2">
      <LmButton
        content={{
          ...defaultProps,
          variant: 'outlined',
          corners: 'lm-button-shaped',
          properties: ['disable-ripple'],
          size: 'lm-button-xlarge'
        }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'outlined',
        icon: { name: 'home' },
        color: 'primary',
        size: 'lm-button-xlarge',
        properties: ['disable-ripple'],
        corners: 'lm-button-shaped'
      }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'raised',
        icon: { name: 'home' },
        color: 'secondary',
        properties: ['disable-ripple'],
        size: 'lm-button-xlarge',
        corners: 'lm-button-shaped'
      }} />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'secondary',
          properties: ['disable-ripple'],
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }} />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'primary',
          properties: ['disable-ripple'],
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }} />
      <LmButton
        content={{
          ...iconProps,
          properties: ['disable-ripple'],
          variant: 'outlined',
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }} />
    </div>
  </>
)

export const ButtonWithImage = () => (
  <>
    <LmButton content={{ ...iconButton, size: 'dense' }} />
    <LmButton content={iconButton} />
    <LmButton content={{ ...iconButton, size: 'lm-button-large' }} />
    <LmButton content={{ ...iconButton, size: 'lm-button-xlarge' }} />
    <LmButton content={{ ...iconButton, size: 'lm-button-xlarge', label: 'Label' }} />
    <div>
      <LmButton content={{ ...iconButton, variant: 'outlined', label: 'Label' }} />
      <LmButton content={{ ...iconButton, variant: 'outlined', label: 'Label', corners: 'lm-button-shaped' }} />
      <LmButton content={{ ...iconButton, variant: 'outlined', label: 'Label', corners: 'lm-button-square' }} />
    </div>
    <div>
      <LmButton content={{ ...iconButton, variant: 'fab', label: 'Label', size: 'dense' }} />
      <LmButton content={{
        ...iconButton,
        variant: 'fab',
        label: 'Label',
        size: 'lm-button-large',
        corners: 'lm-button-shaped'
      }} />
      <LmButton content={{
        ...iconButton,
        variant: 'fab',
        label: 'Label',
        size: 'lm-button-xlarge',
        corners: 'lm-button-square'
      }} />
    </div>
  </>
)

export const ButtonWithAddons = () => (
  <>
    <div className="p-2">
      <LmButton content={defaultProps} />
      <LmButton content={{ ...defaultProps, icon: { name: 'home' }, color: 'primary' }} />
      <LmButton content={{ ...defaultProps, icon: { name: 'home' }, color: 'secondary' }} />
      <LmButton content={{ ...defaultProps, color: 'secondary' }} />
      <LmButton content={{ ...iconProps, color: 'secondary' }} />
    </div>
    <div className="p-2">
      <LmButton content={defaultProps} />
      <LmButton content={{ ...defaultProps, icon: { name: 'home' }, color: 'primary', variant: 'outlined' }} />
      <LmButton content={{ ...defaultProps, icon: { name: 'home' }, color: 'secondary', variant: 'raised' }} />
      <LmButton
        content={{ ...defaultProps, label: 'light', icon: { name: 'home' }, color: 'light', variant: 'raised' }} />
      <LmButton
        content={{ ...defaultProps, label: 'dark', icon: { name: 'home' }, color: 'dark', variant: 'raised' }} />
      <LmButton content={{ ...defaultProps, label: 'unelevated', color: 'secondary', variant: 'unelevated' }} />
      <LmButton content={{ ...defaultProps, label: 'unelevated', color: 'primary', variant: 'unelevated' }} />
      <LmButton content={{
        ...defaultProps, label: 'unelevated', color: 'primary', variant: 'unelevated',
        custom_color: { rgba: '#219' }
      }} />
      <LmButton content={{ ...defaultProps, variant: 'fab' }} />
      <LmButton content={{ ...defaultProps, variant: 'fab', color: 'dark', properties: ['disable-shadow'] }} />
      <LmButton content={{ ...iconProps, color: 'secondary', variant: 'fab', properties: ['disable-ripple'] }} />
      <LmButton content={{ ...iconProps, color: 'secondary', variant: 'fab', properties: ['disable-shadow'] }} />
      <LmButton content={{
        ...iconProps,
        color: 'secondary',
        variant: 'fab',
        properties: ['disable-shadow'],
        custom_color: { rgba: '#219' }
      }} />
    </div>

    <div className="p-2">
      <LmButton content={defaultProps} />
      <LmButton content={{
        ...defaultProps,
        icon: { name: 'home' },
        color: 'primary',
        variant: 'outlined',
        size: 'lm-button-large'
      }} />
      <LmButton content={{
        ...defaultProps,
        icon: { name: 'home' },
        color: 'secondary',
        variant: 'raised',
        size: 'lm-button-large'
      }} />
      <LmButton
        content={{
          ...defaultProps,
          label: 'light',
          icon: { name: 'home' },
          color: 'light',
          variant: 'raised',
          size: 'lm-button-large'
        }} />
      <LmButton
        content={{
          ...defaultProps,
          label: 'dark',
          icon: { name: 'home' },
          color: 'dark',
          variant: 'raised',
          size: 'lm-button-large'
        }} />
      <LmButton content={{
        ...defaultProps,
        label: 'unelevated',
        color: 'secondary',
        variant: 'unelevated',
        size: 'lm-button-large'
      }} />
      <LmButton content={{
        ...defaultProps,
        label: 'unelevated',
        color: 'primary',
        variant: 'unelevated',
        size: 'lm-button-large'
      }} />
      <LmButton content={{ ...defaultProps, variant: 'fab', size: 'lm-button-large' }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'fab',
        color: 'dark',
        properties: ['disable-shadow'],
        size: 'lm-button-large'
      }} />
      <LmButton content={{
        ...iconProps,
        color: 'secondary',
        variant: 'fab',
        properties: ['disable-ripple'],
        size: 'lm-button-large'
      }} />
      <LmButton content={{
        ...iconProps,
        color: 'secondary',
        variant: 'fab',
        properties: ['disable-shadow'],
        size: 'lm-button-large'
      }} />
    </div>
    <div className="p-2">
      <LmButton content={defaultProps} />
      <LmButton content={{
        ...defaultProps,
        icon: { name: 'home' },
        color: 'primary',
        variant: 'outlined',
        size: 'lm-button-xlarge'
      }} />
      <LmButton content={{
        ...defaultProps,
        icon: { name: 'home' },
        color: 'secondary',
        variant: 'raised',
        size: 'lm-button-xlarge'
      }} />
      <LmButton
        content={{
          ...defaultProps,
          label: 'light',
          icon: { name: 'home' },
          color: 'light',
          variant: 'raised',
          size: 'lm-button-xlarge'
        }} />
      <LmButton
        content={{
          ...defaultProps,
          label: 'dark',
          icon: { name: 'home' },
          color: 'dark',
          variant: 'raised',
          size: 'lm-button-xlarge'
        }} />
      <LmButton content={{
        ...defaultProps,
        label: 'unelevated',
        color: 'secondary',
        variant: 'unelevated',
        size: 'lm-button-xlarge'
      }} />
      <LmButton content={{
        ...defaultProps,
        label: 'unelevated',
        color: 'primary',
        variant: 'unelevated',
        size: 'lm-button-xlarge'
      }} />
      <LmButton content={{ ...defaultProps, variant: 'fab', size: 'lm-button-large' }} />
      <LmButton content={{
        ...defaultProps,
        variant: 'fab',
        color: 'dark',
        properties: ['disable-shadow'],
        size: 'lm-button-xlarge'
      }} />
      <LmButton content={{
        ...iconProps,
        color: 'secondary',
        variant: 'fab',
        properties: ['disable-ripple'],
        size: 'lm-button-xlarge'
      }} />
      <LmButton content={{
        ...iconProps,
        color: 'secondary',
        variant: 'fab',
        properties: ['disable-shadow'],
        size: 'lm-button-xlarge'
      }} />
    </div>
  </>
)
export const Playground = () => {
  return (
    <div className="p-5">
      <LmButton content={storyButton()} />
    </div>
  )
}

