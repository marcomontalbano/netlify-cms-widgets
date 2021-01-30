import { getRelations } from './yaml'

describe('yaml', () => {
    it('should be able to get a list of relations', () => {
        const collections = getRelations([
            {
                name: 'people',
                folder: 'folder',
                fields: [
                    {
                        label: 'Active',
                        name: 'active',
                        widget: 'boolean'
                    },
                    {
                        label: 'Favorite Artist',
                        name: 'favoriteArtist',
                        widget: 'relation',
                        collection: 'artists',
                        value_field: 'id',
                        search_fields: ['name'],
                        display_fields: ['name']
                    },
                    {
                        label: 'Interests',
                        name: 'interests',
                        widget: 'list',
                        fields: [
                            {
                                label: 'Visible',
                                name: 'visible',
                                widget: 'boolean'
                            },
                            {
                                label: 'Artists',
                                name: 'artists',
                                widget: 'relation',
                                collection: 'artists',
                                value_field: 'id',
                                search_fields: ['name'],
                                display_fields: ['name']
                            }
                        ]
                    },
                ]
            }
        ])

        expect(collections).toStrictEqual([
            ['people.favoriteArtist', 'artists'],
            ['people.interests.artists', 'artists']
        ])
    })

    it('should be able to get a list of relations', () => {
        const collections = getRelations([
            {
                name: 'widgets',
                files: [
                    {
                        name: 'custom',
                        file: 'content/custom.json',
                        fields: [
                            {
                                label: 'Active',
                                name: 'active',
                                widget: 'boolean'
                            },
                            {
                                label: 'Favorite Artist',
                                name: 'favoriteArtist',
                                widget: 'relation',
                                collection: 'artists',
                                value_field: 'id',
                                search_fields: ['name'],
                                display_fields: ['name']
                            },
                            {
                                label: 'Interests',
                                name: 'interests',
                                widget: 'list',
                                fields: [
                                    {
                                        label: 'Visible',
                                        name: 'visible',
                                        widget: 'boolean'
                                    },
                                    {
                                        label: 'Artists',
                                        name: 'artists',
                                        widget: 'relation',
                                        collection: 'artists',
                                        value_field: 'id',
                                        search_fields: ['name'],
                                        display_fields: ['name']
                                    }
                                ]
                            },
                        ]
                    }
                ],
            }
        ])

        expect(collections).toStrictEqual([
            ['custom.favoriteArtist', 'artists'],
            ['custom.interests.artists', 'artists']
        ])
    })
});
