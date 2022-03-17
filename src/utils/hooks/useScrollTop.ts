import useScrollTrigger from '@mui/material/useScrollTrigger'

export default function useScrollTop() {
  const scrolledWithoutHysteresis = useScrollTrigger({
    disableHysteresis: true,
    threshold: 60
  })
  // const [value] = useDebounce(scrolledWithoutHysteresis, 700)
  return scrolledWithoutHysteresis
}
