
import mock from 'mock-fs';

import { getContent } from './index';

describe('netlify-cms', () => {
    beforeEach(() => {
        mock({
            '/content/people': {
                'person-1.json': JSON.stringify({ id: '1', name: 'Person 1' }),
                'person-2.json': JSON.stringify({ id: '2', name: 'Person 2' }),
            },
            '/content/companies': {
                'company-1.json': JSON.stringify({ id: '1', name: 'Company 1', peopleId: '2' }),
                'company-2.json': JSON.stringify({ id: '2', name: 'Company 2', peopleId: ['1', '2', '3'] }),
            },
            '/content/profile.json': JSON.stringify({ id: '1', fullname: 'John Doe', peopleId: '1' }),
            '/content/settings.json': JSON.stringify({ id: '1', profileId: '1' }),
        });
    });

    afterEach(() => {
        mock.restore();
    });

    it('getContent should read json files from the given path and resolve the linked collections', () => {
        const content = getContent('/content');

        expect(content).toStrictEqual({
            people: [
                { id: '1', name: 'Person 1' },
                { id: '2', name: 'Person 2' },
            ],
            companies: [
                { id: '1', name: 'Company 1', person: { id: '2', name: 'Person 2' } },
                {
                    id: '2',
                    name: 'Company 2',
                    people: [
                        { id: '1', name: 'Person 1' },
                        { id: '2', name: 'Person 2' },
                    ],
                },
            ],
            profile: { id: '1', fullname: 'John Doe', person: { id: '1', name: 'Person 1' } },
            settings: { id: '1', profile: { id: '1', fullname: 'John Doe', peopleId: '1' } }
        });
    });
});
