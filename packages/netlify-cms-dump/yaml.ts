import yaml from 'js-yaml'
import nodeFs from 'fs'

type BaseWidget = {
    /** Specify as false to make a field optional; defaults to true */
    required?: boolean

    /** Optionally add helper text directly below a widget. Useful for including instructions */
    hint?: string

    /** Add field validation by specifying a list with a regex pattern and an error message; more extensive validation can be achieved with custom widgets */
    pattern?: string[]

    name: string
    label: string
    label_singular?: string
}

type WidgetList = BaseWidget & {
    widget: 'list'

    /** A single widget field to be repeated */
    field?: Field

    /** A nested list of multiple widget fields to be included in each repeatable iteration */
    fields?: Field[]
}

type WidgetBoolean = BaseWidget & {
    widget: 'boolean'

    /** Accepts true or false; defaults to false when required is set to false */
    default?: boolean
}

type WidgetRelation = BaseWidget & {
    widget: 'relation'
    collection: string
    value_field: string
    search_fields: string[]
    display_fields: string[]
}

type Field = WidgetBoolean | WidgetRelation | WidgetList

type File = {
    name: string;
    file: string;
    fields: Field[];
}

type CollectionTypeFolder = {
    name: string
    folder: string
    fields: Field[]
}

type CollectionTypeFiles = {
    name: string
    files: File[]
}

type Collection = CollectionTypeFolder | CollectionTypeFiles

type Yaml = {
    collections: Collection[]
}

export type Relation = [fieldPath: string, relation: string]

const parseFields = (fields: Field[], prevName: string, memo: Relation[] = []): Relation[] => {
    fields.forEach(field => {
        if ('fields' in field && field.fields?.length) {
            return parseFields(field.fields, `${prevName}.${field.name}`, memo)
        }

        if (field.widget === 'relation') {
            const { name, collection } = field;
            memo.push([`${prevName}.${name}`, collection])
        }
    })

    return memo
}

export const getRelations = (items: Collection[]): Relation[] => {
    return items.reduce((cv, collection) => {
        if ('folder' in collection) {
            return [
                ...cv,
                ...parseFields(collection.fields, collection.name)
            ]
        }

        if ('files' in collection) {
            return [
                ...cv,
                ...collection.files.reduce((cv, file) => [
                    ...cv,
                    ...parseFields(file.fields, file.name)
                ], [] as Relation[])
            ]
        }

        return cv
    }, [] as Relation[])
}

export const getRelationsFromYaml = (path: string): Relation[] => {
    const document = yaml.load(nodeFs.readFileSync(path, 'utf8')) as Yaml;
    return getRelations(document.collections);
}