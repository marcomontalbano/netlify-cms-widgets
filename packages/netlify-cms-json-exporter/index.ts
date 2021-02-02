import dot from 'dot-object'

import { Content, ContentCollection } from './src/types';
import { readNetlifyContent, resolveFieldPaths, resolveRelations } from './src/utils';
import { getRelationsFromYaml } from './src/yaml';

export const getContent = (configPath: string, contentPath: string) => {
    const yamlRelations = getRelationsFromYaml(configPath)
    const contentEntries = readNetlifyContent<ContentCollection>(contentPath)

    const content: Content<ContentCollection> = Object.fromEntries(contentEntries)

    const resolvedFieldPaths = resolveFieldPaths<ContentCollection>(yamlRelations, content)
    const resolvedRelations = resolveRelations<ContentCollection>(resolvedFieldPaths, content)

    resolvedRelations.map(([fieldPath, relation]) => {
        dot.copy(relation, fieldPath, content, content)
    })

    // TODO: TypeError: Converting circular structure to JSON

    return content
}

