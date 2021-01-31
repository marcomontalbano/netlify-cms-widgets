import nodeFs from 'fs'
import nodePath from 'path'

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

/*
export const getForeignKey = (value: string, suffix: string = 'Id'): string | undefined => {
    const [, foreignKey] = new RegExp(`([\\S]+)${suffix}$`).exec(value) || [];
    return foreignKey
}

type MaybeId = {
    id?: string
}

export const findInCollection = <T extends MaybeId>(entries: T | T[], id: string | string[]): T | T[] | undefined => {
    const hasManyIds = Array.isArray(id)
    const ids = hasManyIds ? id : [id];

    if (Array.isArray(entries)) {
        const filterMethod = hasManyIds ? 'filter' : 'find';
        return entries[filterMethod](entry => entry.id && ids.includes(entry.id))
    }

    if (entries.id && ids.includes(entries.id)) {
        return entries
    }

    return hasManyIds ? [] : undefined
}

*/
