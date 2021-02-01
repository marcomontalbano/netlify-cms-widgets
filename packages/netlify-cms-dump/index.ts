import dot from 'dot-object'
import { readNetlifyContent } from './utils';
import { getRelationsFromYaml, Relation } from './yaml';

type Content = {
    [collectionName: string]: Collection | Collection[];
};

type Collection = {
    [key: string]: unknown;
};

export const resolveNestedObjects = (keys: string[], content: Content, currentIndex: number = 0, currentKey: string = '', memo: string[] = []) => {
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

export const resolveFieldPaths = (yamlRelations: Relation[], content: Content): Relation[] => {
    return yamlRelations.map(([fieldPath, relation]) => {
        return resolveNestedObjects(fieldPath.split('.'), content).map(resolvedFieldPath => ([
            resolvedFieldPath,
            relation
        ]));
    }).flat() as Relation[];
}

export const resolveRelations = (resolvedFieldPaths: Relation[], content: Content): Relation[] => {
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
    const yamlRelations = getRelationsFromYaml(configPath)
    const contentEntries = readNetlifyContent<Collection>(contentPath)

    const content = Object.fromEntries(contentEntries) as Content

    const resolvedFieldPaths = resolveFieldPaths(yamlRelations, content)
    const resolvedRelations = resolveRelations(resolvedFieldPaths, content)

    resolvedRelations.map(([fieldPath, relation]) => {
        dot.copy(relation, fieldPath, content, content)
    })

    // TODO: TypeError: Converting circular structure to JSON

    return content
}

