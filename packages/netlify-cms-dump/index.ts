import dot from 'dot-object'
import { readNetlifyContent, resolveFieldPaths, resolveRelations } from './utils';
import { getRelationsFromYaml } from './yaml';

type Collection = {
    [key: string]: unknown;
};

type Content = {
    [collectionName: string]: Collection | Collection[];
};

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

