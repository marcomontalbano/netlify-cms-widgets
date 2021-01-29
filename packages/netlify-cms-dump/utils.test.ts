
import mock from 'mock-fs';

import { findInCollection, getForeignKey, readDirectoryAsJson, readdirSync, readFileAsJson, readNetlifyContent } from './utils';

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

    describe('relations', () => {
        describe('getForeignKey', () => {
            it('should return undefined if the provided value is not valid', () => {
                expect(getForeignKey('profile')).toBe(undefined)
            })

            it('should return the foreignKey for a given value', () => {
                expect(getForeignKey('profileId')).toBe('profile')
            })

            it('should return the foreignKey for a given value and a gived suffix', () => {
                expect(getForeignKey('userKey', 'Key')).toBe('user')
            })
        })

        describe('findInCollection', () => {
            it('should be able to filter a list of <T> by id ', () => {
                const result = findInCollection([
                    { id: '1', value: 'Value 1' },
                    { id: '2', value: 'Value 2' }
                ], '2')

                expect(result).toStrictEqual({ id: '2', value: 'Value 2' })
            })

            it('should be able to filter a list of <T> by multiple ids ', () => {
                const result = findInCollection([
                    { id: '1', value: 'Value 1' },
                    { id: '2', value: 'Value 2' },
                    { id: '3', value: 'Value 3' }
                ], ['1', '3', '4'])

                expect(result).toStrictEqual([
                    { id: '1', value: 'Value 1' },
                    { id: '3', value: 'Value 3' },
                ])
            })

            it('should be able to get the element if id is present', () => {
                const result = findInCollection({ id: '1', value: 'Value 1' }, '1')

                expect(result).toStrictEqual({ id: '1', value: 'Value 1' })
            })

            it('should be able to get the element if one of the ids is present', () => {
                const result = findInCollection({ id: '1', value: 'Value 1' }, ['1', '2'])

                expect(result).toStrictEqual({ id: '1', value: 'Value 1' })
            })

            it('should return undefined is id is not found', () => {
                expect(
                    findInCollection([{ id: '1', value: 'Value 1' }], '2')
                ).toBe(undefined)

                expect(
                    findInCollection({ id: '1', value: 'Value 1' }, '2')
                ).toBe(undefined)
            })

            it('should return an empty array if a list of ids is not found', () => {
                expect(
                    findInCollection([{ id: '1', value: 'Value 1' }], ['2'])
                ).toStrictEqual([])

                expect(
                    findInCollection({ id: '1', value: 'Value 1' }, ['2'])
                ).toStrictEqual([])
            })
        })
    })
});
