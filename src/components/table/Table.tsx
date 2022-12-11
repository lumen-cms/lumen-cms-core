/* eslint-disable react/no-array-index-key,react/no-danger */
import React from 'react'
import { LmTableProps } from './tableTypes'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import clsx from 'clsx'

type TableRowProps = { content: string[]; index: number }

function TableRow({ content, index }: TableRowProps): JSX.Element {
  return (
    <tr>
      {content.map((column: string, iterator: number) => (
        <td
          key={`column_${index}_${iterator}`}
          dangerouslySetInnerHTML={{ __html: column }}
        />
      ))}
    </tr>
  )
}

export default function LmTable({ content }: LmTableProps): JSX.Element {
  const theme = useTheme()
  const tableBody = (content.body && content.body.tbody) || []
  const tableHead = (content.body && content.body.thead) || []

  return (
    <div style={{ overflowX: 'auto' }}>
      <Box
        component={'table'}
        sx={{
          tableLayout: 'fixed',
          borderSpacing: 0,
          borderCollapse: 'collapse',
          '&.lm-table__bordered, &.lm-table__bordered-bold': {
            '& td, & th': {
              border: `1px solid ${
                theme.palette.mode === 'dark'
                  ? theme.palette.common.white
                  : theme.palette.common.black
              }`,
              padding: theme.spacing(3)
            }
          },
          '&.lm-table__bordered-bold': {
            '& td, & th': {
              border: `2px solid ${
                theme.palette.mode === 'dark'
                  ? theme.palette.common.white
                  : theme.palette.common.black
              }`
            },

            '& th': {
              textAlign: 'left'
            },

            '& tbody tr:last-child': {
              '& td': {
                fontWeight: 'bold'
              }
            }
          },
          '&.lm-table__boxed': {
            border: `1px solid ${
              theme.palette.mode === 'dark'
                ? theme.palette.common.white
                : theme.palette.common.black
            }`,
            borderCollapse: 'separate',
            backgroundColor: theme.palette.background.paper,

            '& td': {
              border: `1px solid ${theme.palette.divider}`,
              padding: theme.spacing(3)
            }
          },
          '&.lm-table__price': {
            width: '100%',
            '& td': {
              padding: `${theme.spacing(4)} 0`,
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:first-child': {
                width: '80%'
              },
              '&:not(:first-child)': {
                textAlign: 'right'
              },
              '&:last-child': {
                fontWeight: 'bold',
                fontSize: '1.2rem'
                // fontFamily: '' // todo
              }
            }
          },
          '&.lm-table__comparison': {
            '& thead': {
              '& th': {
                textAlign: 'center',

                '&:not(:first-of-type)': {
                  borderRight: `1px solid ${theme.palette.divider}`,
                  padding: theme.spacing(4),
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.primary.main
                  // fontFamily: $table-comparison-header-font-family;
                },

                '&:nth-child(2)': {
                  borderTopLeftRadius: '10px'
                },

                '&:last-child': {
                  borderRight: 'none',
                  borderTopRightRadius: '10px'
                }
              }
            },

            '& tbody': {
              '& td': {
                padding: `${theme.spacing(4)} 0`,

                borderTop: `1px solid ${theme.palette.divider}`,

                '&:first-of-type': {
                  color: theme.palette.text.primary,
                  padding: '25px 35px 25px 0'
                },

                '&:not(:first-child)': {
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  boxShadow: '-1px 1px 3px 0 rgba(240, 240, 240, .7)', // theme.shadows[1],//'-1px 1px 3px 0 rgba(240, 240, 240, .7)',
                  borderLeft: `1px solid ${theme.palette.divider}`,
                  borderRight: `1px solid ${theme.palette.divider}`
                },

                '&:last-child': {
                  boxShadow: '1px 0 3px 0 rgba(240, 240, 240, .75)' // theme.shadows[2]//
                }
              },

              '& tr:last-child > td': {
                borderBottom: `1px solid ${theme.palette.divider}`,

                '&:not(:first-child)': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  boxShadow: '-1px 3px 7px 0 rgba(240, 240, 240, .7)'
                }
              }
            }
          }
        }}
        className={clsx('lm-table', content.class_names?.values, {
          [`lm-table__${content.variant}`]: !!content.variant
        })}
      >
        {!content.disable_table_head && (
          <thead>
            <tr>
              {tableHead.map((c, i) => (
                <th key={`head_${i}`}>{c}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {tableBody.map((row, i) => (
            <TableRow key={`row_${i}`} index={i} content={row} />
          ))}
        </tbody>
      </Box>
    </div>
  )
}
