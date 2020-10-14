export const getNumber = (
  value?: string | number,
  fallbackValue?: string | number
) => (value ? Number(value) : fallbackValue)
