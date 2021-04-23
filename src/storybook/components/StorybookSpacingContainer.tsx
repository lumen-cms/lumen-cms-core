import { FC } from 'react'

const StorybookSpacingContainer: FC = ({ children }) => {
  return (
    <div
      style={{
        margin: '24px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: '12px',
        columnGap: '12px'
      }}
    >
      {children}
    </div>
  )
}
export default StorybookSpacingContainer
