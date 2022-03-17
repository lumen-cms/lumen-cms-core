import Pagination, { PaginationProps } from '@mui/material/Pagination'
import React from 'react'
import { LmListStoriesPaginationProps } from './listWidgetTypes'

const paginationShape: {
  [k: string]: PaginationProps['shape']
} = {
  round: 'circular',
  rounded: 'rounded',
  fallback: undefined
}
export default function LmListStoriesPagination({
  options,
  onChange,
  totalCount,
  page,
  className,
  anchorId,
  disabled
}: LmListStoriesPaginationProps) {
  return (
    <Pagination
      className={className}
      disabled={disabled}
      page={page}
      count={totalCount}
      onChange={(_event, page) => {
        onChange(page)
        if (anchorId) {
          const destination = document.getElementById(anchorId)
          if (destination) {
            destination.scrollIntoView({
              behavior: 'auto'
            })
          }
        }
      }}
      size={options?.size || 'medium'}
      color={options?.color || 'standard'}
      shape={paginationShape[options?.shape || 'fallback']}
      variant={options?.variant || 'text'}
    />
  )
}
