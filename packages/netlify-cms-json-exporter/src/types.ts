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

export type Field = WidgetBoolean | WidgetRelation | WidgetList

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

export type YamlCollection = CollectionTypeFolder | CollectionTypeFiles

export type ContentCollection = {
    id: string
    [key: string]: unknown
}

export type Yaml = {
    collections: YamlCollection[]
}

export type Relation = [fieldPath: string, relation: string]

export type ContentEntries<T> = [ collectionName: string, entries: T | T[] ][];

export type Content<T> = {
    [collectionName: string]: T | T[];
};