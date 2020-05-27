import {  LmComponentRender as LmDivider } from '../src/'
import { storyDivider } from '../src/storybook/core/various'
import React from 'react'

export default {
  title: 'Divider'
}

export const Playground = () => (
  <>
    <div>
      <LmDivider
        content={storyDivider({ count: 1, options: { icon: { name: 'chevron_down' }, size: 24, width: 70 } })} />
    </div>
    <div>
      <LmDivider content={storyDivider({ count: 2, options: { icon: { name: 'chevron_down' }, size: 30 } })} />
    </div>
    <div>
      <LmDivider content={
        storyDivider({
          count: 3,
          options: {
            color: {
              rgba: 'rgba(121,121,121,1)'
            }
          }
        })
      } />
    </div>
    <div>
      <LmDivider content={
        storyDivider({
          count: 4,
          options: {
            color: {
              rgba: 'rgba(121,121,121,1)'
            },
            size: 40, width: 70
          }
        })
      } />
    </div>
    <div>
      <LmDivider content={
        storyDivider({
          count: 5,
          options: {
            icon: {
              name: 'chevron_down'
            },
            color: {
              rgba: 'rgba(121,121,121,1)'
            },
            size: 40, width: 15
          }
        })
      } />
    </div>
    <div>
      <LmDivider content={
        storyDivider({
          count: 6,
          options: {
            icon: {
              name: 'chevron_down'
            },
            color: {
              rgba: 'rgba(121,121,121,1)'
            },
            size: 50, width: 30
          }
        })
      } />
    </div>
    <div>
      <LmDivider content={
        storyDivider({
          count: 7,
          options: {
            icon: {
              name: 'chevron_down'
            },
            color: {
              rgba: 'rgba(22,333,1212,1)'
            },
            size: 60, width: 30
          }
        })
      } />
    </div>
    <div>
      <LmDivider content={
        storyDivider({
          count: 8,
          options: {
            icon: {
              name: 'chevron_down'
            },
            color: {
              rgba: 'rgba(22,333,1212,1)'
            },
            size: 79, width: 30
          }
        })} />
    </div>
  </>
)

