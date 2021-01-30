
import pluralize from 'pluralize';
import { findInCollection, getForeignKey, readNetlifyContent } from './utils';

type Content = {
    [collectionName: string]: Collection | Collection[] | undefined;
};

type Collection = {
    [key: string]: unknown;
};

type ContentEntries = [string, Collection | Collection[]][];

const resolveCollectionRelations = (contentEntries: ContentEntries, collection: Collection): Collection => {
    const itemEntries = Object.entries(collection).map(([key, id]) => {
        const relatedCollectionName = getForeignKey(key)

        if (relatedCollectionName) {
            if (typeof id !== 'string' && !Array.isArray(id)) {
                throw new Error('Relation should be sigle or array')
            }

            const content: Content = Object.fromEntries(contentEntries);
            const collections = content[relatedCollectionName];

            if (collections) {
                const relationType = Array.isArray(id) ? 'plural' : 'singular';
                const relationName = pluralize[relationType](relatedCollectionName)

                return [relationName, findInCollection<Collection>(collections, id)];
            }
        }

        if (typeof id === 'object') {
            if (Array.isArray(id)) {
                return [key, id.map(collection => typeof collection === 'object' ? resolveCollectionRelations(contentEntries, collection): collection)];
            }

            return [key, resolveCollectionRelations(contentEntries, id as Collection)];
        }

        return [key, id];
    });

    return Object.fromEntries(itemEntries) as Collection;
};

const resolveRelations = (contentEntries: ContentEntries): ContentEntries =>
    contentEntries.map(([collectionName, collections]) => [
        collectionName,
        Array.isArray(collections)
            ? collections.map((collection) => resolveCollectionRelations(contentEntries, collection))
            : resolveCollectionRelations(contentEntries, collections),
    ]);

const getContent = (contentPath: string): Content => {
    const contentEntries = readNetlifyContent<Collection>(contentPath);
    return Object.fromEntries(resolveRelations(contentEntries))
}

export { getContent };
