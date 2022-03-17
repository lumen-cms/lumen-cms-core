import Pagination from '@mui/material/Pagination'
import React from 'react'
import { LmListStoriesPaginationProps } from './listWidgetTypes'

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
      shape={options?.shape || 'round'}
      variant={options?.variant || 'text'}
    />
  )
}
