import type { StorybookSchemaField } from './schema'
import { ArgTypes, Meta } from '@storybook/react'
// @ts-ignore
import COMPONENT_JSON from '../../components.82895.json'

export const genericArgTypes = {
  component: {
    table: {
      disable: true
    }
  },
  _uid: {
    table: {
      disable: true
    }
  },
  storybook_name: {
    table: {
      disable: true
    }
  }
} as Meta['argTypes']

const typMap: Record<string, 'number' | 'string' | undefined> = {
  number: 'number',
  text: 'string',
  markdown: 'string',
  textarea: 'string'
}

const controlTypeMap: Record<
  string,
  'text' | 'number' | 'select' | 'inline-check' | 'boolean' | undefined
> = {
  image: 'text',
  number: 'number',
  option: 'select',
  options: 'inline-check',
  boolean: 'boolean'
}

export function getComponentArgTypes(componentName: string): Meta['argTypes'] {
  const findComponents = COMPONENT_JSON.components.find((component) => {
    return component.name === componentName
  })
  const obj = {} as ArgTypes
  const schema: Record<string, StorybookSchemaField | undefined> | undefined =
    findComponents?.schema
  if (!schema) {
    throw new Error(`component declaration not found: ${componentName}`)
  }
  Object.keys(schema).forEach((schemaKey) => {
    const currentSchema = schema[schemaKey]
    if (!currentSchema) return
    const { type } = currentSchema

    if (['section', 'tab', 'richtext', 'multilink', 'file'].includes(type)) {
      return
    }
    obj[schemaKey] = {
      name: schemaKey,
      ...(typMap[type] && {
        type: { name: typMap[type]!, required: !!currentSchema.required }
      }),
      control: {
        type: controlTypeMap[type]
      }
    }
    if (currentSchema.options?.length && type !== 'custom') {
      obj[schemaKey].options = [
        '',
        ...currentSchema.options.map((i: any) => i.value)
      ]
    }
    if (type === 'options') {
      obj[schemaKey].options = obj[schemaKey].options?.slice(1) // remove empty value
    } else if (currentSchema.field_type === 'vue-color-picker') {
      // obj[schemaKey].control = {
      //   type: 'select'
      // }
      // obj[schemaKey] = {
      //   rgba: {
      //     name: schemaKey + ' ' + 'pick',
      //     control: {
      //       type: 'color'
      //     }
      //   }
      // }
      obj[schemaKey].control = { type: 'object' }
    }

    // console.log(currentSchema, type, schemaKey, obj[schemaKey])
  })
  let allTypes = {
    ...obj,
    ...genericArgTypes
  }
  // console.log(allTypes)
  return allTypes
}
