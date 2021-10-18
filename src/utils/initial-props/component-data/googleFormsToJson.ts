import cheerio from 'cheerio'

import {
  Column,
  CustomizableOption,
  FieldsOrder,
  Line,
  Option
} from 'react-google-forms-hooks'
import { FieldWithDate, GoogleFormWithDate } from './googleFormsToJsonTypes'

type FormData = {
  formData: object
  fbzx: string
}

const toBool = (n: number): boolean => n === 1

const toString = (n: number): string => `${n}`

const assertValidUrl = (formUrl: string): void => {
  const googleFormsHosts = ['docs.google.com', 'forms.gle']
  const url = new URL(formUrl)

  if (!googleFormsHosts.includes(url.host)) {
    throw new Error(
      `Invalid google forms host. ${
        url.host
      } is expected to be ${googleFormsHosts
        .join(', ')
        .replace(/, ([^,]*)$/, ' or $1')}.`
    )
  }

  if (url.host === googleFormsHosts[0] && !url.pathname.endsWith('/viewform')) {
    throw new Error(
      `Please use the form's public URL. Starts with "docs.google.com" | "forms.gle" and ends with "/viewform". Submitted: ${url.toString()}`
    )
  }
}

const getFormHtml = async (formUrl: string) => {
  const response = await fetch(formUrl).then((r) => r.text())
  return response
  // throw new Error('fetch to google not successful', formUrl)
}

const extractFormData = (html: string): FormData => {
  const $ = cheerio.load(html)
  const fbzx = $('[name="fbzx"]').attr('value')

  if (!fbzx) {
    throw new Error(`Invalid form. Couldn't find fbzx field.`)
  }

  const scriptStringIdentifier = 'var FB_PUBLIC_LOAD_DATA_ ='
  let scriptHtml = $('script')
    .filter((_, el) => {
      return $(el).html()!.includes(scriptStringIdentifier)
    })
    .first()
    .html()

  if (!scriptHtml) {
    throw new Error(`Invalid form. Couldn't find script tag.`)
  }

  scriptHtml = scriptHtml.replace(';', '')
  scriptHtml = scriptHtml.replace(scriptStringIdentifier, '')

  const formDataRaw = JSON.parse(scriptHtml)

  return { formData: formDataRaw, fbzx }
}

const parseGridMultiSelect = (rawField: Array<object>): 1 | 0 => {
  const firstLine = rawField[4][0]
  const canSelectMultiple = firstLine[11][0]

  return canSelectMultiple
}

const parseFieldType = (rawField: Array<object>, fieldId: number) => {
  const fieldTypes = [
    'SHORT_ANSWER',
    'LONG_ANSWER',
    'RADIO',
    'DROPDOWN',
    'CHECKBOX',
    'LINEAR'
  ] as const

  if (fieldId === 7) {
    if (parseGridMultiSelect(rawField) === 1) {
      return 'CHECKBOX_GRID'
    } else {
      return 'RADIO_GRID'
    }
  }
  if (fieldId === 9) {
    return 'DATE'
  }

  return fieldTypes[fieldId]
}

const parseOptions = (options: Array<object>): Array<Option> => {
  return options.map((rawOption) => ({ label: rawOption[0] }))
}

const parseCustomizableOptions = (
  options: Array<object>
): Array<CustomizableOption> => {
  return options.map((rawOption) => ({
    label: rawOption[0],
    custom: rawOption[4] === 1
  }))
}

const flattenArray = (array: Array<Array<string>>): Array<Option | Column> => {
  return array.map((item) => ({ label: item[0] }))
}

const parseLines = (lines: Array<any>): Array<Line> => {
  return lines.map((rawLine) => {
    const line = {} as Line
    line.id = toString(rawLine[0])
    line.label = rawLine[3][0]
    return line
  })
}

const parseField = (rawField: Array<any>): FieldWithDate => {
  const field = {} as FieldWithDate

  field.label = rawField[1]

  const fieldId = rawField[3]
  field.type = parseFieldType(rawField, fieldId)

  switch (field.type) {
    case 'SHORT_ANSWER':
    case 'LONG_ANSWER': {
      const fieldInfo = rawField[4][0]
      field.id = toString(fieldInfo[0])
      field.required = toBool(fieldInfo[2])
      break
    }
    case 'CHECKBOX':
    case 'RADIO': {
      const fieldInfo = rawField[4][0]
      field.id = toString(fieldInfo[0])
      field.options = parseCustomizableOptions(fieldInfo[1])
      field.required = toBool(fieldInfo[2])
      break
    }
    case 'DROPDOWN': {
      const fieldInfo = rawField[4][0]
      field.id = toString(fieldInfo[0])
      field.options = parseOptions(fieldInfo[1])
      field.required = toBool(fieldInfo[2])
      break
    }
    case 'LINEAR': {
      const fieldInfo = rawField[4][0]
      field.id = toString(fieldInfo[0])
      const [labelFirst, labelLast] = fieldInfo[3]
      field.legend = { labelFirst, labelLast }
      field.options = flattenArray(fieldInfo[1])
      field.required = toBool(fieldInfo[2])
      break
    }
    case 'CHECKBOX_GRID':
    case 'RADIO_GRID': {
      field.id = toString(rawField[0])
      field.columns = flattenArray(rawField[4][0][1])
      field.lines = parseLines(rawField[4])
      field.required = toBool(rawField[4][0][2])
      break
    }
    case 'DATE': {
      const fieldInfo = rawField[4][0]
      field.id = toString(fieldInfo[0])
      field.required = toBool(rawField[4][0][2])
      break
    }
  }

  return field
}

const parseFields = (
  rawFields: Array<any>
): { fields: Array<FieldWithDate>; fieldsOrder: FieldsOrder } => {
  const fieldsOrder = {}

  const fields = rawFields.map((rawField: Array<any>, i: number) => {
    const field = parseField(rawField)
    fieldsOrder[`${field.id}`] = i
    return field
  })

  return { fields, fieldsOrder }
}

const parseFormData = ({ formData, fbzx }: FormData): GoogleFormWithDate => {
  const googleForm = {} as GoogleFormWithDate

  googleForm.fvv = 1
  googleForm.pageHistory = 0
  googleForm.fbzx = fbzx
  googleForm.action = formData[14]

  const { fields, fieldsOrder } = parseFields(formData[1][1])
  googleForm.fields = fields
  googleForm.fieldsOrder = fieldsOrder

  return googleForm
}

export const googleFormsToJson = async (formUrl: string) => {
  assertValidUrl(formUrl)

  let html
  try {
    html = await getFormHtml(formUrl)
  } catch (err) {
    throw new Error(`Failed to fetch form. ${err}`)
  }

  const formData = extractFormData(html)
  return parseFormData(formData)
}
