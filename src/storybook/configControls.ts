import { ArgTypes, Meta } from '@storybook/react'
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

const typMap = {
  number: 'number',
  text: 'string',
  markdown: 'string',
  textarea: 'string'
}

const controlTypeMap = {
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
  const schema = findComponents && findComponents.schema
  if (!schema) {
    throw new Error(`component declaration not found: ${componentName}`)
  }
  Object.keys(schema).forEach((schemaKey) => {
    const currentSchema = schema[schemaKey]
    const { type } = currentSchema

    if (['section', 'tab', 'richtext', 'multilink', 'file'].includes(type)) {
      return
    }
    obj[schemaKey] = {
      name: schemaKey,
      type: {
        name: typMap[type] || undefined,
        required: !!currentSchema.required
      },
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
      obj[schemaKey].options?.shift() // remove empty value
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
      obj[schemaKey].control.type = 'object'
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
