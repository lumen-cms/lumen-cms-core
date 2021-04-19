export type StructuredFormFieldProps = {
  questionTypeCode: number
  questionTypeName: { name: string }
  questionTextValue: string
  answerOptionsList: string[]
  answerSubmitIdValue: number
  isRequired: boolean
}

export const GoogleFormFieldTypes = {
  0: { name: 'ShortAnswer' },
  1: { name: 'Paragraph' },
  2: { name: 'MultiChoice' },
  3: { name: 'DropDown' },
  4: { name: 'CheckBoxes' },
  // 5: { name: 'LinearScale' },
  // 7: { name: 'MultiGridChoice' },
  9: { name: 'Date' }
  // 10: { name: 'Time' }
}
export type ParseHijackGoogleFormPayload = {
  description: string
  title: string
  formId: string
  fields: StructuredFormFieldProps[]
  formAction: string
}

export default function parseHijackedFormData(
  form: string
): ParseHijackGoogleFormPayload {
  // @see url(https://gist.github.com/UdaraAlwis/c338a9de4af4509ba0ff67e2c4f37f5c)

  const publicLoadDataString = form
    .split('FB_PUBLIC_LOAD_DATA_ = ')[1]
    .split(';</script>')[0]
  const publicLoadDataArray = JSON.parse(publicLoadDataString)
  const description = publicLoadDataArray[1][0]
  const title = publicLoadDataArray[1][8]
  const formId = publicLoadDataArray[14]
  const fieldsArray = publicLoadDataArray[1][1]
  const fields: StructuredFormFieldProps[] = []
  fieldsArray.forEach((field: any[]) => {
    // Check if this Field is submittable or not, index [4] contains the Field Answer
    // Submit Id of a Field Object, ex: ignore Fields used as Description panels
    if (!Array.isArray(field) || field.length < 4 || !field[4]) {
      return
    }
    const questionTextValue = field[1]
    const questionTypeCode = field[3]
    const questionTypeName = GoogleFormFieldTypes[questionTypeCode]
    const answerOptionsList: string[] = []
    const answerOptionsListValue: string[][] | null = field[4][0][1]
    if (answerOptionsListValue?.length) {
      answerOptionsListValue.forEach((answerOption) =>
        answerOptionsList.push(`${answerOption[0]}`)
      )
    }
    const answerSubmitIdValue = field[4][0][0]
    const isRequired = Boolean(field[4][0][2])
    fields.push({
      questionTypeCode,
      questionTypeName,
      questionTextValue,
      answerOptionsList,
      answerSubmitIdValue,
      isRequired
    })
  })
  return {
    description,
    title,
    formId,
    fields,
    formAction: formId
      ? `https://docs.google.com/forms/d/${formId}/formResponse?embedded=true`
      : ''
  }
}
