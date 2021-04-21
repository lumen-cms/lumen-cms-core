import { Meta, Story } from '@storybook/react'
import { LmButton } from './Button'
import { getComponentArgTypes } from '../../storybook/configControls'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'
import { LmButtonProps } from './buttonTypes'
import { findFirstPreset } from '../../storybook/findStorybookPresets'
import StorybookSpacingContainer from '../../storybook/components/StorybookSpacingContainer'

export default {
  title: 'Design/Inputs/Button',
  component: LmButton,
  argTypes: {
    ...getComponentArgTypes('button')
  }
} as Meta

export const Presets = () => (
  <StorybookPresetsContainer componentName="button" />
)

const Template: Story<LmButtonProps['content']> = (args) => (
  <LmButton content={args} />
)

const presetContent = findFirstPreset<LmButtonProps['content']>('button')

export const Basic = Template.bind({})
Basic.args = {
  ...presetContent
}

const iconProps = {
  ...presetContent,
  icon: { name: 'home' }
}

const imageProps = {
  ...presetContent,
  image:
    'https://img2.storyblok.com/f/66717/273x256/42d8e47bd5/twitter-icon.png'
}

export const ButtonVariants = () => (
  <>
    <h3>Default</h3>
    <StorybookSpacingContainer>
      <LmButton content={presetContent} />
      <LmButton
        content={{ ...presetContent, ...iconProps, color: 'primary' }}
      />
      <LmButton
        content={{
          ...presetContent,
          icon: { name: 'home' },
          color: 'secondary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          icon: { name: 'home' },
          custom_color: { rgba: '#219' }
        }}
      />
      <LmButton
        content={{ ...presetContent, ...iconProps, color: 'secondary' }}
      />
      <LmButton
        content={{
          ...presetContent,
          ...iconProps,
          custom_color: { rgba: '#219' }
        }}
      />
    </StorybookSpacingContainer>
    <h3>Fab</h3>
    <StorybookSpacingContainer>
      <LmButton content={{ ...presetContent, variant: 'fab' }} />
      <LmButton
        content={{
          ...presetContent,
          variant: 'fab',
          icon: { name: 'home' },
          color: 'primary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'fab',
          icon: { name: 'home' },
          color: 'secondary',
          custom_color: { rgba: '#219' }
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          ...iconProps,
          variant: 'fab',
          color: 'secondary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          ...iconProps,
          variant: 'fab',
          color: 'secondary',
          custom_color: { rgba: '#219' }
        }}
      />
    </StorybookSpacingContainer>
    <h3>Dense</h3>
    <StorybookSpacingContainer>
      <LmButton content={{ ...presetContent, variant: 'fab', size: 'dense' }} />
      <LmButton
        content={{
          ...presetContent,
          variant: 'fab',
          size: 'dense',
          icon: { name: 'home' },
          color: 'primary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'fab',
          size: 'dense',
          icon: { name: 'home' },
          color: 'secondary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          ...iconProps,
          variant: 'fab',
          size: 'dense',
          color: 'secondary'
        }}
      />
    </StorybookSpacingContainer>

    <h3>Large</h3>
    <StorybookSpacingContainer>
      <LmButton
        content={{ ...presetContent, variant: 'fab', size: 'lm-button-large' }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'fab',
          size: 'lm-button-large',
          icon: { name: 'home' },
          color: 'primary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'fab',
          size: 'lm-button-large',
          icon: { name: 'home' },
          color: 'secondary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          ...iconProps,
          variant: 'fab',
          size: 'lm-button-large',
          color: 'secondary'
        }}
      />
    </StorybookSpacingContainer>
    <StorybookSpacingContainer>
      <LmButton
        content={{ ...presetContent, variant: 'fab', size: 'lm-button-xlarge' }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'fab',
          size: 'lm-button-xlarge',
          icon: { name: 'home' },
          color: 'primary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'fab',
          size: 'lm-button-xlarge',
          icon: { name: 'home' },
          color: 'secondary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          ...iconProps,
          variant: 'fab',
          size: 'lm-button-xlarge',
          color: 'secondary'
        }}
      />
    </StorybookSpacingContainer>
    <StorybookSpacingContainer>
      <LmButton content={{ ...presetContent, variant: 'raised' }} />
      <LmButton
        content={{
          ...presetContent,
          variant: 'raised',
          icon: { name: 'home' },
          color: 'primary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'raised',
          icon: { name: 'home' },
          color: 'secondary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'raised',
          icon: { name: 'home' },
          color: 'secondary',
          custom_color: { rgba: '#219' }
        }}
      />
      <LmButton
        content={{ ...iconProps, variant: 'raised', color: 'secondary' }}
      />
      <LmButton
        content={{
          ...iconProps,
          variant: 'raised',
          color: 'secondary',
          custom_color: { rgba: '#219' }
        }}
      />
    </StorybookSpacingContainer>
    <StorybookSpacingContainer>
      <LmButton content={{ ...presetContent, variant: 'outlined' }} />
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          icon: { name: 'home' },
          color: 'primary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          icon: { name: 'home' },
          color: 'secondary'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          icon: { name: 'home' },
          color: 'secondary',
          custom_color: { rgba: '#219' }
        }}
      />
      <LmButton
        content={{ ...iconProps, variant: 'outlined', color: 'secondary' }}
      />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'secondary',
          custom_color: { rgba: '#219' }
        }}
      />
    </StorybookSpacingContainer>
    <StorybookSpacingContainer>
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          corners: 'lm-button-shaped'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          icon: { name: 'home' },
          color: 'primary',
          corners: 'lm-button-shaped'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          icon: { name: 'home' },
          color: 'secondary',
          corners: 'lm-button-shaped'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'secondary',
          corners: 'lm-button-shaped'
        }}
      />
    </StorybookSpacingContainer>
    <StorybookSpacingContainer>
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          corners: 'lm-button-square',
          size: 'dense'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          icon: { name: 'home' },
          color: 'primary',
          size: 'dense',
          corners: 'lm-button-square'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          icon: { name: 'home' },
          color: 'secondary',
          size: 'dense',
          corners: 'lm-button-square'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'secondary',
          corners: 'lm-button-square'
        }}
      />
    </StorybookSpacingContainer>
    <StorybookSpacingContainer>
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          corners: 'lm-button-square',
          size: 'lm-button-large'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          icon: { name: 'home' },
          color: 'primary',
          size: 'lm-button-large',
          corners: 'lm-button-square'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          icon: { name: 'home' },
          color: 'secondary',
          size: 'lm-button-large',
          corners: 'lm-button-square'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'secondary',
          corners: 'lm-button-square',
          size: 'lm-button-large'
        }}
      />
    </StorybookSpacingContainer>
    <StorybookSpacingContainer>
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          corners: 'lm-button-square',
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          icon: { name: 'home' },
          color: 'primary',
          size: 'lm-button-xlarge',
          corners: 'lm-button-square'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'raised',
          icon: { name: 'home' },
          color: 'secondary',
          size: 'lm-button-xlarge',
          corners: 'lm-button-square'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'secondary',
          corners: 'lm-button-square',
          size: 'lm-button-xlarge'
        }}
      />
    </StorybookSpacingContainer>
    <h3>XLarge</h3>
    <StorybookSpacingContainer>
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          icon: { name: 'home' },
          color: 'primary',
          size: 'lm-button-xlarge',
          corners: 'lm-button-shaped'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'raised',
          icon: { name: 'home' },
          color: 'secondary',
          size: 'lm-button-xlarge',
          corners: 'lm-button-shaped'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'secondary',
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'primary',
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }}
      />
    </StorybookSpacingContainer>
    <div className="p-2">
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          corners: 'lm-button-shaped',
          properties: ['disable-ripple'],
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'outlined',
          icon: { name: 'home' },
          color: 'primary',
          size: 'lm-button-xlarge',
          properties: ['disable-ripple'],
          corners: 'lm-button-shaped'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'raised',
          icon: { name: 'home' },
          color: 'secondary',
          properties: ['disable-ripple'],
          size: 'lm-button-xlarge',
          corners: 'lm-button-shaped'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'secondary',
          properties: ['disable-ripple'],
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          variant: 'outlined',
          color: 'primary',
          properties: ['disable-ripple'],
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          properties: ['disable-ripple'],
          variant: 'outlined',
          corners: 'lm-button-shaped',
          size: 'lm-button-xlarge'
        }}
      />
    </div>
  </>
)

export const ButtonWithImage = () => (
  <>
    <StorybookSpacingContainer>
      <LmButton content={{ ...imageProps, size: 'dense' }} />
      <LmButton content={imageProps} />
      <LmButton content={{ ...imageProps, size: 'lm-button-large' }} />
      <LmButton content={{ ...imageProps, size: 'lm-button-xlarge' }} />
      <LmButton
        content={{ ...imageProps, size: 'lm-button-xlarge', label: 'Label' }}
      />
    </StorybookSpacingContainer>
    <StorybookSpacingContainer>
      <LmButton
        content={{ ...imageProps, variant: 'outlined', label: 'Label' }}
      />
      <LmButton
        content={{
          ...imageProps,
          variant: 'outlined',
          label: 'Label',
          corners: 'lm-button-shaped'
        }}
      />
      <LmButton
        content={{
          ...imageProps,
          variant: 'outlined',
          label: 'Label',
          corners: 'lm-button-square'
        }}
      />
    </StorybookSpacingContainer>
    <StorybookSpacingContainer>
      <LmButton
        content={{
          ...imageProps,
          variant: 'fab',
          label: 'Label',
          size: 'dense'
        }}
      />
      <LmButton
        content={{
          ...imageProps,
          variant: 'fab',
          label: 'Label',
          size: 'lm-button-large',
          corners: 'lm-button-shaped'
        }}
      />
      <LmButton
        content={{
          ...imageProps,
          variant: 'fab',
          label: 'Label',
          size: 'lm-button-xlarge',
          corners: 'lm-button-square'
        }}
      />
    </StorybookSpacingContainer>
  </>
)

export const ButtonWithAddons = () => (
  <>
    <StorybookSpacingContainer>
      <LmButton content={presetContent} />
      <LmButton
        content={{ ...presetContent, icon: { name: 'home' }, color: 'primary' }}
      />
      <LmButton
        content={{
          ...presetContent,
          icon: { name: 'home' },
          color: 'secondary'
        }}
      />
      <LmButton content={{ ...presetContent, color: 'secondary' }} />
      <LmButton content={{ ...iconProps, color: 'secondary' }} />
    </StorybookSpacingContainer>
    <StorybookSpacingContainer>
      <LmButton content={presetContent} />
      <LmButton
        content={{
          ...presetContent,
          icon: { name: 'home' },
          color: 'primary',
          variant: 'outlined'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          icon: { name: 'home' },
          color: 'secondary',
          variant: 'raised'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'light',
          icon: { name: 'home' },
          color: 'light',
          variant: 'raised'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'dark',
          icon: { name: 'home' },
          color: 'dark',
          variant: 'raised'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'unelevated',
          color: 'secondary',
          variant: 'unelevated'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'unelevated',
          color: 'primary',
          variant: 'unelevated'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'unelevated',
          color: 'primary',
          variant: 'unelevated',
          custom_color: { rgba: '#219' }
        }}
      />
      <LmButton content={{ ...presetContent, variant: 'fab' }} />
      <LmButton
        content={{
          ...presetContent,
          variant: 'fab',
          color: 'dark',
          properties: ['disable-shadow']
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          color: 'secondary',
          variant: 'fab',
          properties: ['disable-ripple']
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          color: 'secondary',
          variant: 'fab',
          properties: ['disable-shadow']
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          color: 'secondary',
          variant: 'fab',
          properties: ['disable-shadow'],
          custom_color: { rgba: '#219' }
        }}
      />
    </StorybookSpacingContainer>

    <StorybookSpacingContainer>
      <LmButton content={presetContent} />
      <LmButton
        content={{
          ...presetContent,
          icon: { name: 'home' },
          color: 'primary',
          variant: 'outlined',
          size: 'lm-button-large'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          icon: { name: 'home' },
          color: 'secondary',
          variant: 'raised',
          size: 'lm-button-large'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'light',
          icon: { name: 'home' },
          color: 'light',
          variant: 'raised',
          size: 'lm-button-large'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'dark',
          icon: { name: 'home' },
          color: 'dark',
          variant: 'raised',
          size: 'lm-button-large'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'unelevated',
          color: 'secondary',
          variant: 'unelevated',
          size: 'lm-button-large'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'unelevated',
          color: 'primary',
          variant: 'unelevated',
          size: 'lm-button-large'
        }}
      />
      <LmButton
        content={{ ...presetContent, variant: 'fab', size: 'lm-button-large' }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'fab',
          color: 'dark',
          properties: ['disable-shadow'],
          size: 'lm-button-large'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          color: 'secondary',
          variant: 'fab',
          properties: ['disable-ripple'],
          size: 'lm-button-large'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          color: 'secondary',
          variant: 'fab',
          properties: ['disable-shadow'],
          size: 'lm-button-large'
        }}
      />
    </StorybookSpacingContainer>
    <StorybookSpacingContainer>
      <LmButton content={presetContent} />
      <LmButton
        content={{
          ...presetContent,
          icon: { name: 'home' },
          color: 'primary',
          variant: 'outlined',
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          icon: { name: 'home' },
          color: 'secondary',
          variant: 'raised',
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'light',
          icon: { name: 'home' },
          color: 'light',
          variant: 'raised',
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'dark',
          icon: { name: 'home' },
          color: 'dark',
          variant: 'raised',
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'unelevated',
          color: 'secondary',
          variant: 'unelevated',
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...presetContent,
          label: 'unelevated',
          color: 'primary',
          variant: 'unelevated',
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{ ...presetContent, variant: 'fab', size: 'lm-button-large' }}
      />
      <LmButton
        content={{
          ...presetContent,
          variant: 'fab',
          color: 'dark',
          properties: ['disable-shadow'],
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          color: 'secondary',
          variant: 'fab',
          properties: ['disable-ripple'],
          size: 'lm-button-xlarge'
        }}
      />
      <LmButton
        content={{
          ...iconProps,
          color: 'secondary',
          variant: 'fab',
          properties: ['disable-shadow'],
          size: 'lm-button-xlarge'
        }}
      />
    </StorybookSpacingContainer>
  </>
)
