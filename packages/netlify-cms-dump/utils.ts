import dot from 'dot-object'
import nodeFs from 'fs'
import nodePath from 'path'

import { Relation } from './yaml'

export const readdirSync = (path: string): string[] => {
    return nodeFs.readdirSync(path).map((basename) => {
        return nodePath.resolve(path, basename)
    })
}

export const readFileAsJson = <T>(file: string): T => {
    if (!nodeFs.lstatSync(file).isFile()) {
        throw new Error(`"${file}" is not a file!`)
    }

    return JSON.parse(nodeFs.readFileSync(file, 'utf8')) as T
}

export const readDirectoryAsJson = <T>(directory: string): T[] => {
    if (!nodeFs.lstatSync(directory).isDirectory()) {
        throw new Error(`"${directory}" is not a directory!`)
    }

    return readdirSync(directory).map((file) => readFileAsJson<T>(file));
}

type ContentEntries<T> = [ name: string, entries: T | T[] ][];

export const readNetlifyContent = <T>(contentPath: string): ContentEntries<T> => {
    const contentEntries: ContentEntries<T> = readdirSync(contentPath).map((filepath) => {
        if (nodeFs.lstatSync(filepath).isFile()) {
            return [nodePath.basename(filepath, '.json'), readFileAsJson<T>(filepath)];
        }

        return [nodePath.basename(filepath), readDirectoryAsJson<T>(filepath)];
    });

    return contentEntries;
}

type GenericObject = {
    [key: string]: unknown;
};

type Content = {
    [collectionName: string]: GenericObject | GenericObject[];
};

export const resolveNestedObjects = (keys: string[], content: { [key: string]: unknown }, currentIndex: number = 0, currentKey: string = '', memo: string[] = []) => {
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
        const collectionIndex = collectionObject.findIndex((obj: GenericObject) => obj.id === fieldObject);

        return [
            field,
            `${collection}[${collectionIndex}]`
        ];
    });
}