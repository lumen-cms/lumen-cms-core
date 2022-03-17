import { DialogProps } from '@mui/material/Dialog'
import { DialogStoryblok } from '../../typings/generated/components-schema'

export type LmDialogProps = {
  content: DialogStoryblok
}
export type LmDialogAsyncProps = {
  content: DialogStoryblok
  dialogProps: DialogProps
  setOpen: (bool: boolean) => void
}
