import { readFileSync } from 'node:fs'
import { parse } from '@babel/parser'
import { expect, expectTypeOf, it } from 'vitest'
import type {
  AccordionStoryblok,
  CategoryStoryblok,
  ListWidgetStoryblok,
  IconStoryblok,
  ImageStoryblok,
  PageStoryblok,
  StylesStoryblok,
  TableStoryblok
} from '../../typings/generated/components-schema'

it('generates an explicit interface and every content field for every schema component', () => {
  const components = JSON.parse(
    readFileSync(
      'src/typings/storyblok/components/82895/components.json',
      'utf8'
    )
  ) as {
    name: string
    schema: Record<string, { type: string; required?: boolean }>
  }[]
  const source = readFileSync(
    'src/typings/storyblok/types/82895/components.d.ts',
    'utf8'
  )
  const ast = parse(source, { sourceType: 'module', plugins: ['typescript'] })
  const interfaces = ast.program.body.flatMap((statement) =>
    statement.type === 'ExportNamedDeclaration' &&
    statement.declaration?.type === 'TSInterfaceDeclaration'
      ? [statement.declaration]
      : []
  )
  const byComponent = new Map(
    interfaces.map((declaration) => {
      const discriminator = declaration.body.body.find(
        (member) =>
          member.type === 'TSPropertySignature' &&
          member.key.type === 'Identifier' &&
          member.key.name === 'component'
      )
      const type =
        discriminator?.type === 'TSPropertySignature'
          ? discriminator.typeAnnotation?.typeAnnotation
          : undefined
      const name =
        type?.type === 'TSLiteralType' && type.literal.type === 'StringLiteral'
          ? type.literal.value
          : undefined
      return [name, declaration] as const
    })
  )
  const registry = parse(
    readFileSync('src/typings/storyblok/types/82895/registry.ts', 'utf8'),
    { sourceType: 'module', plugins: ['typescript'] }
  )
  const map = registry.program.body.flatMap((statement) =>
    statement.type === 'ExportNamedDeclaration' &&
    statement.declaration?.type === 'TSInterfaceDeclaration' &&
    statement.declaration.id.name === 'GeneratedStoryblokComponentMap'
      ? [statement.declaration]
      : []
  )[0]
  expect(map).toBeDefined()
  const entries = map.body.body.map((member) => {
    if (
      member.type !== 'TSPropertySignature' ||
      member.key.type !== 'StringLiteral'
    ) {
      throw new Error('Invalid generated registry entry')
    }
    const type = member.typeAnnotation?.typeAnnotation
    if (
      type?.type !== 'TSTypeReference' ||
      type.typeName.type !== 'TSQualifiedName'
    ) {
      throw new Error('Registry must reference an official component interface')
    }
    return [member.key.value, type.typeName.right.name]
  })
  expect(Object.fromEntries(entries)).toEqual(
    Object.fromEntries(
      [...byComponent].map(([name, declaration]) => [name, declaration.id.name])
    )
  )
  expect([...byComponent.keys()].sort()).toEqual(
    components.map(({ name }) => name).sort()
  )
  expect(source).not.toMatch(/\bany\b/)
  for (const component of components) {
    const declaration = byComponent.get(component.name)!
    for (const [name, field] of Object.entries(component.schema)) {
      if (field.type === 'section' || field.type === 'tab') continue
      const property = declaration.body.body.find(
        (member) =>
          member.type === 'TSPropertySignature' &&
          (member.key.type === 'Identifier'
            ? member.key.name
            : member.key.type === 'StringLiteral'
              ? member.key.value
              : undefined) === name
      )
      expect(property, `${component.name}.${name}`).toBeDefined()
      if (property?.type === 'TSPropertySignature') {
        expect(
          property.typeAnnotation,
          `${component.name}.${name} type`
        ).toBeDefined()
        // The CLI does not support Storyblok's obsolete file field. Keep its
        // existing unknown type explicit instead of inventing a payload shape.
        if (component.name === 'button' && name === 'file') {
          expect(field.type).toBe('file')
          expect(property.typeAnnotation?.typeAnnotation.type).toBe(
            'TSUnknownKeyword'
          )
        } else {
          expect(
            property.typeAnnotation?.typeAnnotation.type,
            `${component.name}.${name}`
          ).not.toBe('TSUnknownKeyword')
        }
        if (field.required) expect(property.optional).not.toBe(true)
      }
    }
  }
})

it('preserves custom fields, nested component unions, and application extensions', () => {
  expectTypeOf<NonNullable<IconStoryblok['name']>['name']>().toEqualTypeOf<
    string | undefined
  >()
  expectTypeOf<
    NonNullable<StylesStoryblok['background_color']>['rgba']
  >().toEqualTypeOf<string | undefined>()
  expectTypeOf<ImageStoryblok['width']>().toEqualTypeOf<string | undefined>()
  expectTypeOf<PageStoryblok['uuid']>().toEqualTypeOf<string | undefined>()
  expectTypeOf<
    NonNullable<AccordionStoryblok['body']>[number]['component']
  >().toEqualTypeOf<'accordion_item'>()
  expectTypeOf<NonNullable<TableStoryblok['body']>['tbody']>().toEqualTypeOf<
    string[][] | undefined
  >()
  expectTypeOf<
    NonNullable<IconStoryblok['class_names']>['values']
  >().toEqualTypeOf<string[] | undefined>()
  expectTypeOf<
    NonNullable<CategoryStoryblok['tag_reference']>['values']
  >().toEqualTypeOf<string | undefined>()
  expectTypeOf<
    NonNullable<ListWidgetStoryblok['tags']>['values']
  >().toEqualTypeOf<string[] | undefined>()
})
