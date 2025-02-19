import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ShowsList from '../ShowsList.vue';

const mockRouter = {
    push: vi.fn()
};

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter
}));

describe('ShowsList', () => {
    const mockShows = [
        {
            id: 1,
            title: 'Breaking Bad',
            imageUrl: 'test1.jpg',
            rating: 8.5
        },
        {
            id: 2,
            title: 'The Wire',
            imageUrl: 'test2.jpg',
            rating: 9.0
        }
    ];

    const mockProps = {
        genre: 'Drama',
        shows: mockShows
    };

    let wrapper;
    let scrollByMock;

    beforeEach(() => {
        scrollByMock = vi.fn();

        wrapper = mount(ShowsList, {
            props: mockProps,
        });

        wrapper.vm.scrollContainer = {
            scrollBy: scrollByMock,
            scrollWidth: 1000,
            clientWidth: 500,
            scrollLeft: 200,
        };

        mockRouter.push.mockClear();
    });

    it('should render properly with props', () => {
        expect(wrapper.find('.shows-list__title').text()).toBe('Drama');
        expect(wrapper.findAll('.shows-list__item')).toHaveLength(2);
    });

    it('should display show information correctly', () => {
        const firstShow = wrapper.findAll('.shows-list__item')[0];

        expect(firstShow.find('img').attributes('src')).toBe('test1.jpg');
        expect(firstShow.find('h3').text()).toBe('Breaking Bad');
        expect(firstShow.find('.shows-list__rating').text()).toContain('8.5');
    });

    it('should navigate to show details when show is clicked', async () => {
        const firstShow = wrapper.findAll('.shows-list__item')[0];

        await firstShow.trigger('click');

        expect(mockRouter.push).toHaveBeenCalledWith('/show/1');
    });

    it('should disable left scroll button when at start', () => {
        const leftButton = wrapper.findAll('.shows-list__nav-button')[0];

        expect(leftButton.attributes('disabled')).toBeDefined();
    });

    it('should update scrollPosition when handleScroll() is triggered', async () => {
        wrapper.vm.handleScroll();

        expect(wrapper.vm.scrollPosition).toBe(200);
    });

    it('should update maxScroll on mount', () => {
        const scrollContainer = wrapper.find('.shows-list__list');
        Object.defineProperties(scrollContainer.element, {
        scrollWidth: { value: 1000 },
        clientWidth: { value: 500 }
        });

        wrapper.vm.updateMaxScroll();

        expect(wrapper.vm.maxScroll).toBe(500);
    });

    it('should scroll left by 300px when scrollLeft() is triggered', async () => {
        await wrapper.vm.scrollLeft();

        expect(scrollByMock).toHaveBeenCalledWith({ left: -300, behavior: 'smooth' });
    });

    it('should scroll right by 300px when scrollRight() is triggered', async () => {
        await wrapper.vm.scrollRight();

        expect(scrollByMock).toHaveBeenCalledWith({ left: 300, behavior: 'smooth' });
    });
});