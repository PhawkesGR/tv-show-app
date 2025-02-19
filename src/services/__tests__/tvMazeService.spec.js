import { vi, describe, it, expect, beforeEach } from 'vitest';
import { tvMazeService } from '../../services/tvMazeService';

const BASE_URL = 'https://api.tvmaze.com';

global.fetch = vi.fn();

describe('tvMazeService', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    describe('getShows', () => {
        it('should fetch show details by ID and map response correctly', async () => {
            const mockShowData = {
                id: 1,
                name: 'Breaking Bad',
                image: { original: 'image-url' },
                rating: { average: 8.5 },
                genres: ['Drama', 'Thriller'],
                summary: 'This is a summary.',
                premiered: '2022-01-01',
                status: 'Running',
                network: { name: 'AMC', country: { name: 'USA' } },
                language: 'English',
                runtime: 60,
                _embedded: {
                    cast: [
                        {
                            person: { name: 'Actor 1', id: 123, image: { medium: 'actor1-image' } },
                            character: { name: 'Character 1' },
                        },
                    ],
                },
            };

            fetch.mockResolvedValueOnce({
                json: () => mockShowData,
            });

            const show = await tvMazeService.getShowById(1);

            expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/shows/1?embed=cast`);
            expect(show).toEqual({
                id: 1,
                title: 'Breaking Bad',
                imageUrl: 'image-url',
                rating: 8.5,
                genres: ['Drama', 'Thriller'],
                summary: 'This is a summary.',
                premiered: '2022-01-01',
                status: 'Running',
                network: 'AMC',
                country: 'USA',
                language: 'English',
                runtime: 60,
                cast: [
                    { name: 'Actor 1', character: 'Character 1', id: 123, imageUrl: 'actor1-image' },
                ],
            });
        });

        it('should throw an error when the fetch request fails', async () => {
            fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

            try {
                await tvMazeService.getShowById(1);
            } catch (error) {
                expect(error.message).toBe('Failed to fetch');
            }
        });
    });

    describe('getShows', () => {
        it('should fetch and map shows correctly', async () => {
            const mockShowsData = [
                {
                    id: 1,
                    name: 'Breaking Bad',
                    image: { medium: 'image-url' },
                    rating: { average: 9.0 },
                    genres: ['Drama'],
                },
                {
                    id: 2,
                    name: 'The Wire',
                    image: { medium: 'image-url-2' },
                    rating: { average: 8.5 },
                    genres: ['Drama'],
                },
            ];

            fetch.mockResolvedValueOnce({
                json: () => mockShowsData,
            });

            const shows = await tvMazeService.getShows(1);

            expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/shows?page=1`);
            expect(shows).toEqual([
                { id: 1, title: 'Breaking Bad', imageUrl: 'image-url', rating: 9.0, genres: ['Drama'] },
                { id: 2, title: 'The Wire', imageUrl: 'image-url-2', rating: 8.5, genres: ['Drama'] },
            ]);
        });

        it('should throw an error when the fetch request fails', async () => {
            fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

            try {
                await tvMazeService.getShows(1);
            } catch (error) {
                expect(error.message).toBe('Failed to fetch');
            }
        });
    });

    describe('getAllGenresWithShows', () => {
        it('should return shows grouped by genre', async () => {
            const mockShowsData = [
                { id: 1, name: 'Breaking Bad', genres: ['Drama'], rating: { average: 9.0 } },
                { id: 2, name: 'Modern Family', genres: ['Comedy'], rating: { average: 8.5 } },
                { id: 3, name: 'The Wire', genres: ['Drama'], rating: { average: 8.0 } },
            ];

            fetch.mockResolvedValueOnce({
                json: () => mockShowsData,
            });

            const genres = await tvMazeService.getAllGenresWithShows(1);

            expect(genres).toEqual({
                Drama: [
                    { id: 1, title: 'Breaking Bad', imageUrl: undefined, rating: 9.0, genres: ['Drama'] },
                    { id: 3, title: 'The Wire', imageUrl: undefined, rating: 8.0, genres: ['Drama'] },
                ],
                Comedy: [
                    { id: 2, title: 'Modern Family', imageUrl: undefined, rating: 8.5, genres: ['Comedy'] },
                ],
            });
        });

        it('should throw an error when the fetch request fails', async () => {
            fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

            try {
                await tvMazeService.getAllGenresWithShows(1);
            } catch (error) {
                expect(error.message).toBe('Failed to fetch');
            }
        });
    });

    describe('searchShows', () => {
        it('should return search results correctly', async () => {
            const mockSearchData = [
                { show: { id: 1, name: 'Breaking Bad', image: { medium: 'image-url' }, rating: { average: 8.0 }, genres: ['Drama'] } },
                { show: { id: 2, name: 'Breaking Good', image: { medium: 'image-url-2' }, rating: { average: 7.5 }, genres: ['Comedy'] } },
            ];

            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => mockSearchData,
            });

            const results = await tvMazeService.searchShows('breaking');

            expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/search/shows?q=breaking`);
            expect(results).toEqual([
                { id: 1, title: 'Breaking Bad', imageUrl: 'image-url', rating: 8.0, genres: ['Drama'] },
                { id: 2, title: 'Breaking Good', imageUrl: 'image-url-2', rating: 7.5, genres: ['Comedy'] },
            ]);
        });

        it('should throw an error when the fetch request fails', async () => {
            fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

            try {
                await tvMazeService.searchShows('test');
            } catch (error) {
                expect(error.message).toBe('Failed to fetch');
            }
        });

        it('should return an empty array if query is empty', async () => {
            const results = await tvMazeService.searchShows('');

            expect(results).toEqual([]);
        });
    });
});
