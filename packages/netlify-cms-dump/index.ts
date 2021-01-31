import dot from 'dot-object'
import { readNetlifyContent } from './utils';
import { getRelationsFromYaml } from './yaml';

type Content = {
    [collectionName: string]: Collection | Collection[] | undefined;
};

type Collection = {
    [key: string]: unknown;
};

type ContentEntries = [string, Collection | Collection[]][];

export const resolveNestedObjects = (keys: string[], content: { [k: string]: Collection | Collection[] }, currentIndex: number = 0, currentKey: string = '', memo: string[] = []) => {
    const key = `${currentKey ? `${currentKey}.` : ''}${keys[currentIndex]}`;

    const currentContent = dot.pick(key, content)

    if (currentIndex === keys.length) {
        memo.push(currentKey);
        return memo;
    }

    if (currentContent === undefined) {
        return [];
    }

    if (Array.isArray(currentContent)) {
        currentContent.forEach((_, i) => {
            resolveNestedObjects(keys, content, currentIndex + 1, `${key}[${i}]`, memo)
        })
    } else {
        resolveNestedObjects(keys, content, currentIndex + 1, key, memo)
    }

    return memo
}

export const resolveFieldPaths = (yamlRelations: [fieldPath: string, relation: string][], content: { [k: string]: Collection | Collection[]; }) => {
    return yamlRelations.map(([fieldPath, relation]) => {
        return resolveNestedObjects(fieldPath.split('.'), content).map(resolvedFieldPath => ([
            resolvedFieldPath,
            relation
        ]));
    }).flat() as [string, string][];
}

export function resolveRelations(resolvedFieldPaths: [fieldPath: string, relation: string][], content: { [k: string]: Collection | Collection[]; }) {
    return resolvedFieldPaths.map(([field, collection]) => {
        const collectionObject = dot.pick(collection, content);
        const fieldObject = dot.pick(field, content);
        const collectionIndex = collectionObject.findIndex((obj: Collection) => obj.id === fieldObject);

        return [
            field,
            `${collection}[${collectionIndex}]`
        ];
    });
}

export const getContent = (configPath: string, contentPath: string) => {
    const yamlRelations = getRelationsFromYaml(configPath);
    const contentEntries = readNetlifyContent<Collection>(contentPath);

    const content = Object.fromEntries(contentEntries);

    const resolvedFieldPaths = resolveFieldPaths(yamlRelations, content)
    const resolvedRelations = resolveRelations(resolvedFieldPaths, content)

    // TODO: TypeError: Converting circular structure to JSON

    resolvedRelations.map(([field, collection]) => {
        dot.copy(collection, field, content, content)
    });

    return content
}

