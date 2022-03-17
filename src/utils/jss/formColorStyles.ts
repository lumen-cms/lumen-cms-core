import makeStyles from '@mui/styles/makeStyles';

export const useFormColorStyles = makeStyles({
  dark: {
    '& .MuiAccordion-root': {
      color: 'inherit',
      backgroundColor: 'rgba(0,0,0,0.1)'
    },
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
