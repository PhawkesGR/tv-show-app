import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShowDetails from '../ShowDetails.vue';
import { tvMazeService } from '../../services/tvMazeService.js';

vi.mock('../../services/tvMazeService.js', () => ({
    tvMazeService: {
        getShowById: vi.fn()
    }
}));

vi.mock('vue-router', () => ({
    useRouter: vi.fn(),
}));

describe('ShowDetails.vue', () => {
    const mockShow = {
        title: 'Breaking Bad',
        imageUrl: 'test.jpg',
        rating: 9.5,
        status: 'Ended',
        network: 'AMC',
        premiered: '2008-01-20',
        runtime: 60,
        country: 'USA',
        language: 'English',
        summary: '<p>A high school chemistry teacher turned meth producer.</p>',
        genres: ['Crime', 'Drama'],
        cast: [
            { id: 1, name: 'Bryan Cranston', imageUrl: 'actor1.jpg' },
            { id: 2, name: 'Aaron Paul', imageUrl: 'actor2.jpg' }
        ]
    };

    let wrapper;

    beforeEach(async () => {
        tvMazeService.getShowById.mockResolvedValue(mockShow);

        wrapper = mount(ShowDetails, {
            props: { id: '1' },
            global: {
                stubs: {
                    RouterLink: {
                        template: '<a><slot /></a>'
                    }
                }
            }
        });

        await wrapper.vm.$nextTick();
    });

    it('should call getShowById when mounted', async () => {
        expect(tvMazeService.getShowById).toHaveBeenCalledWith('1');
    });

    it('should update show data correctly after fetch', async () => {
        expect(wrapper.vm.show.title).toBe('Breaking Bad');
    });

    it('should display show information correctly', async () => {
        expect(wrapper.find('.show-details__title').text()).toBe('Breaking Bad');
        expect(wrapper.find('.show-details__detail').text()).toContain('9.5');
    });

    it('should render genres correctly', async () => {
        const genres = wrapper.findAll('.show-details__genre');

        expect(genres).toHaveLength(2);
        expect(genres[0].text()).toBe('Crime');
        expect(genres[1].text()).toBe('Drama');
    });

    it('should render cast correctly', async () => {
        const castItems = wrapper.findAll('.show-details__cast-item');

        expect(castItems).toHaveLength(2);
        expect(castItems[0].find('h3').text()).toBe('Bryan Cranston');
        expect(castItems[1].find('h3').text()).toBe('Aaron Paul');
    });

    it('should update show details when id prop changes', async () => {
        tvMazeService.getShowById.mockResolvedValue({
            ...mockShow,
            title: 'Better Call Saul'
        });

        await wrapper.setProps({ id: '2' });

        expect(tvMazeService.getShowById).toHaveBeenCalledWith('2');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('.show-details__title').text()).toBe('Better Call Saul');
    });

    it('should render a back home link', () => {
        const backHomeLink = wrapper.find('.show-details__back-home__link');

        expect(backHomeLink.exists()).toBe(true);
        expect(backHomeLink.attributes('to')).toBe('/');
    });

    it('should handle API errors gracefully', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        tvMazeService.getShowById.mockRejectedValueOnce(new Error('API Error'));

        await wrapper.vm.getShowDetails();

        await wrapper.vm.$nextTick();

        expect(console.error).toHaveBeenCalledWith('Error fetching show:', expect.any(Error));
    });
});
