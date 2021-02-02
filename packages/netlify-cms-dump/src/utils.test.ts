
import mock from 'mock-fs';
import { Content, ContentCollection } from './types';

import { readDirectoryAsJson, readdirSync, readFileAsJson, readNetlifyContent, resolveNestedObjects, resolveFieldPaths, resolveRelations } from './utils';

describe('utils', () => {

    afterEach(() => {
        mock.restore();
    });

    describe('file helpers', () => {
        beforeEach(() => {
            mock({
                '/content/collections': {
                    'collection-1.json': JSON.stringify({ id: '1', name: 'Collection 1' }),
                    'collection-2.json': JSON.stringify({ id: '2', name: 'Collection 2' }),
                },
                '/content/profile.json': JSON.stringify({ id: '1', fullname: 'John Doe' }),
            });
        });

        describe('readdirSync', () => {
            it('should behave like the original fs.readdirSync but also add the original path as prefix', () => {
                const content = readdirSync('/content');

                expect(content).toStrictEqual([
                    '/content/collections',
                    '/content/profile.json'
                ]);
            });
        });

        describe('readFileAsJson', () => {
            it('should parse a file as json', () => {
                const content = readFileAsJson('/content/profile.json')
                expect(content).toStrictEqual({ id: '1', fullname: 'John Doe' })
            })

            it('should fails if is not a file', () => {
                expect(() => readFileAsJson('/content/collections')).toThrowError('"/content/collections" is not a file!')
            })
        })

        describe('readDirectoryAsJson', () => {
            it('should scan a directory and parse all files as json', () => {
                const content = readDirectoryAsJson('/content/collections')
                expect(content).toStrictEqual([
                    { id: '1', name: 'Collection 1' },
                    { id: '2', name: 'Collection 2' }
                ])
            })

            it('should fails if is not a directory', () => {
                expect(() => readDirectoryAsJson('/content/profile.json')).toThrowError('"/content/profile.json" is not a directory!')
            })
        })

        describe('readNetlifyContent', () => {
            it('should scan a Netlify CMS content folder and return a structured representation', () => {
                const content = readNetlifyContent('/content')
                expect(content).toStrictEqual([
                    ['collections', [
                        { id: '1', name: 'Collection 1' },
                        { id: '2', name: 'Collection 2' }
                    ]],
                    ['profile', { id: '1', fullname: 'John Doe' }]
                ])
            })
        })
    })

    describe('resolveNestedObjects', () => {
        it('should be able to resolve nested objects without array', () => {
            const content = {
                other: { color: 'blue' },
                person: {
                    name: 'John Doe',
                    link: {
                        url: 'https://example.com/1'
                    }
                },
            };

            expect(
                resolveNestedObjects(['person', 'link', 'url'], content)
            ).toStrictEqual([
                'person.link.url'
            ])
        })

        it('should be able to resolve nested objects with array', () => {
            const content = {
                people: [
                    {
                        name: 'John Doe',
                        links: [
                            { url: 'https://example.com/1' },
                            { url: 'https://example.com/2' }
                        ]
                    },
                    {
                        name: 'Foo Bar',
                        links: [
                            { url: 'https://example.com/1' },
                            { url: 'https://example.com/2' }
                        ]
                    }
                ]
            };

            expect(
                resolveNestedObjects(['people', 'links', 'url'], content)
            ).toStrictEqual([
                'people[0].links[0].url',
                'people[0].links[1].url',
                'people[1].links[0].url',
                'people[1].links[1].url'
            ])
        })

        it('should not resolve unexisting keys', () => {
            const content = {
                people: [{
                    links: [
                        { url: 'https://example.com/1' },
                        { name: 'Foo', url: 'https://example.com/2' },
                    ]
                }]
            };

            expect(
                resolveNestedObjects(['people', 'links', 'name'], content)
            ).toStrictEqual([
                'people[0].links[1].name'
            ])
        })
    })

    describe('resolveFieldPaths', () => {
        it('should be able to resolve nested objects without array', () => {
            const content = {
                other: { color: 'blue' },
                person: {
                    name: 'John Doe',
                    link: {
                        url: 'https://example.com/1'
                    }
                },
            };

            expect(
                resolveFieldPaths([['person.link.url', 'relation']], content)
            ).toStrictEqual([['person.link.url', 'relation']])
        })

        it('should be able to resolve nested objects with array', () => {
            const content = {
                people: [
                    {
                        name: 'John Doe',
                        links: [
                            { url: 'https://example.com/1' },
                            { url: 'https://example.com/2' }
                        ]
                    },
                    {
                        name: 'Foo Bar',
                        links: [
                            { url: 'https://example.com/1' },
                            { url: 'https://example.com/2' }
                        ]
                    }
                ]
            };

            expect(
                resolveFieldPaths([['people.links.url', 'relation']], content)
            ).toStrictEqual([
                ['people[0].links[0].url', 'relation'],
                ['people[0].links[1].url', 'relation'],
                ['people[1].links[0].url', 'relation'],
                ['people[1].links[1].url', 'relation']
            ])
        })

        it('should not resolve unexisting keys', () => {
            const content = {
                people: [{
                    links: [
                        { url: 'https://example.com/1' },
                        { name: 'Foo', url: 'https://example.com/2' },
                    ]
                }]
            };

            expect(
                resolveFieldPaths([['people.links.name', 'relation']], content)
            ).toStrictEqual([['people[0].links[1].name', 'relation']])
        })
    })

    describe('resolveRelations', () => {
        it('should be able to resolve nested objects with array', () => {
            const content: Content<ContentCollection> = {
                people: [
                    {
                        id: '1',
                        name: 'John Doe',
                        links: [
                            { rel: '1' },
                            { rel: '2' }
                        ]
                    },
                    {
                        id: '2',
                        name: 'Foo Bar',
                        links: [
                            { rel: '2' },
                            { rel: '1' }
                        ]
                    }
                ],
                links: [
                    {
                        id: '1',
                        url: 'https://example.com/1'
                    },
                    {
                        id: '2',
                        url: 'https://example.com/2'
                    }
                ]
            };

            expect(
                resolveRelations([
                    ['people[0].links[0].rel', 'links'],
                    ['people[0].links[1].rel', 'links'],
                    ['people[1].links[0].rel', 'links'],
                    ['people[1].links[1].rel', 'links']], content)
            ).toStrictEqual([
                ['people[0].links[0].rel', 'links[0]'],
                ['people[0].links[1].rel', 'links[1]'],
                ['people[1].links[0].rel', 'links[1]'],
                ['people[1].links[1].rel', 'links[0]']
            ])
        })
    })
});
