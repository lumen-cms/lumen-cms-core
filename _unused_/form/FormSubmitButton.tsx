// import { mapButtonProps } from '../button/LmMuiButton'
// import { Button } from '@rmwc/button'
import * as React from 'react'
import { FunctionComponent } from 'react'
import { ButtonStoryblok } from '../../typings/generated/components-schema'
import Button from '@material-ui/core/Button'

const FormSubmitButton: FunctionComponent<ButtonStoryblok> = (content) => {
  // if (content.isLoading) {
  //   buttonProps.icon = <CircularProgress />
  // }
// todo
  return (
    <Button disabled={content.isLoading}
            type="submit">
      {content.label}
    </Button>
  )
}

export default FormSubmitButton
