import { makeStyles } from '@material-ui/core/styles'

export const useFormColorStyles = makeStyles({
  dark: {
    '& .MuiButton-root.lm-default-color, & .MuiIconButton-root.lm-default-color, & .MuiInputBase-root, & .MuiFormLabel-root':
      {
        color: 'inherit',
        '&.MuiInput-underline:before, &.MuiFilledInput-underline:before, &.MuiFilledInput-underline:after':
          {
            borderBottom: '1px solid currentColor'
          },
        '& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline':
          {
            borderColor: 'currentColor'
          },
        '&.MuiButton-outlined,&.lm-outlined': {
          borderColor: 'currentColor'
        }
      }
  }
})
