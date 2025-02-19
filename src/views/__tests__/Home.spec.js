import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Home from '../Home.vue';
import ShowsList from '../../components/ShowsList.vue';
import { tvMazeService } from '../../services/tvMazeService';

vi.mock('../../services/tvMazeService.js', () => ({
    tvMazeService: {
        getAllGenresWithShows: vi.fn()
    }
}));

vi.mock('../../components/ShowsList.vue', () => ({
    default: {
        name: 'ShowsList',
        props: ['genre', 'shows'],
        template: '<div data-test="shows-list">{{ genre }}</div>'
    }
}));

describe('Home', () => {
    const mockShowsByGenre = {
        'Drama': [
            { id: 1, title: 'Breaking Bad', imageUrl: 'test1.jpg', rating: 9.5 },
            { id: 2, title: 'The Wire', imageUrl: 'test2.jpg', rating: 9.3 }
        ],
        'Comedy': [
            { id: 3, title: 'The Office', imageUrl: 'test3.jpg', rating: 8.9 },
            { id: 4, title: 'Friends', imageUrl: 'test4.jpg', rating: 8.5 }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();

        tvMazeService.getAllGenresWithShows.mockReset();
    });

    it('should fetch shows on mount', async () => {
        tvMazeService.getAllGenresWithShows.mockResolvedValue(mockShowsByGenre);

        const wrapper = mount(Home);

        await wrapper.vm.$nextTick();

        expect(tvMazeService.getAllGenresWithShows).toHaveBeenCalledTimes(1);
    });

    it('should render ShowsList components for each genre', async () => {
        tvMazeService.getAllGenresWithShows.mockResolvedValue(mockShowsByGenre);

        const wrapper = mount(Home);

        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        const showsLists = wrapper.findAllComponents(ShowsList);

        expect(showsLists).toHaveLength(2);
        expect(showsLists[0].props('genre')).toBe('Drama');
        expect(showsLists[0].props('shows')).toEqual(mockShowsByGenre['Drama']);
        expect(showsLists[1].props('genre')).toBe('Comedy');
        expect(showsLists[1].props('shows')).toEqual(mockShowsByGenre['Comedy']);
    });

    it('should handle empty data', async () => {
        tvMazeService.getAllGenresWithShows.mockResolvedValue({});

        const wrapper = mount(Home);

        await wrapper.vm.$nextTick();

        const showsLists = wrapper.findAllComponents(ShowsList);

        expect(showsLists).toHaveLength(0);
    });

    it('should handle API error', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const error = new Error('API Error');
        tvMazeService.getAllGenresWithShows.mockRejectedValue(error);

        const wrapper = mount(Home);

        await wrapper.vm.$nextTick();

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading shows:', error);

        consoleErrorSpy.mockRestore();
    });

    it('should update showsByGenre ref when data is fetched', async () => {
        tvMazeService.getAllGenresWithShows.mockResolvedValue(mockShowsByGenre);

        const wrapper = mount(Home);

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.showsByGenre).toEqual(mockShowsByGenre);
    });
});