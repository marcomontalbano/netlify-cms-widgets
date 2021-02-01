import mock from 'mock-fs';

import { resolveNestedObjects, resolveFieldPaths, resolveRelations, getContent } from './index';

describe('netlify-cms', () => {

    beforeEach(() => {

        mock({
            '/config.yml': `
collections:
  - name: 'general'
    files: 
      - name: 'profile'
        label: 'Profile'
        file: 'content/profile.json'
        fields:
          - { label: 'ID', name: 'id', widget: 'id' }
          - { label: 'Favorite Color', name: 'favoriteColor', widget: 'relation', collection: 'colors', value_field: 'id', search_fields: ['name'], display_fields: ['name'] }
  - name: 'colors'
    label: 'Color'
    # folder: 'content/colors'
    fields:
      - { label: 'ID', name: 'id', widget: 'id' }
      - { label: 'Name', name: 'name', widget: 'string' }
`,
            '/content/colors': {
                'color-1.json': JSON.stringify({ id: '1', name: 'Red' }),
                'color-2.json': JSON.stringify({ id: '2', name: 'Green' }),
            },
            '/content/profile.json': JSON.stringify({ id: '1', favoriteColor: '2' }),
        })
    })

    afterEach(() => {
        mock.restore()
    })

    it('shoud use the config.yml to get all relations and the content folder to generate a single object', () => {
        const content = getContent('/config.yml', '/content')

        expect(content).toStrictEqual({
            colors: [
                { id: '1', name: 'Red' },
                { id: '2', name: 'Green' },
            ],
            profile: {
                id: '1',
                favoriteColor: {
                    id: '2',
                    name: 'Green'
                }
            }
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
            const content = {
                people: [
                    {
                        name: 'John Doe',
                        links: [
                            { rel: '1' },
                            { rel: '2' }
                        ]
                    },
                    {
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
})