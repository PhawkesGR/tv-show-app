import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SearchBar from '../SearchBar.vue';
import { tvMazeService } from '../../services/tvMazeService';

vi.mock('../../services/tvMazeService', () => ({
    tvMazeService: {
        searchShows: vi.fn().mockResolvedValue([
            { id: 1, name: 'Breaking Bad' },
            { id: 2, name: 'The Wire' }
        ])
    }
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({
      push: vi.fn(),
    }),
}));

describe('SearchBar', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SearchBar);
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper.exists()).toBe(true);
    const searchButton = wrapper.find('.search-bar__button');

    expect(searchButton.exists()).toBe(true);
  });

  it('should open search overlay when search button is clicked', async () => {
    const searchButton = wrapper.find('.search-bar__button');
    await searchButton.trigger('click');

    const overlay = wrapper.find('.search-bar__overlay');
    expect(overlay.exists()).toBe(true);
  });

  it('should close search overlay when the close button is clicked', async () => {
    await wrapper.find('.search-bar__button').trigger('click');

    const closeButton = wrapper.find('.search-bar__close-button');
    await closeButton.trigger('click');

    const overlay = wrapper.find('.search-bar__overlay');
    expect(overlay.exists()).toBe(false);
  });

  it('should close search overlay when clicking outside', async () => {
    await wrapper.find('.search-bar__button').trigger('click');

    const overlay = wrapper.find('.search-bar__overlay');
    await overlay.trigger('click');

    expect(wrapper.find('.search-bar__overlay').exists()).toBe(false);
  });

  it('should call the search API with debounce when typing', async () => {
    tvMazeService.searchShows.mockResolvedValue([
      { id: 1, title: 'Breaking Bad', genres: [], rating: 8.5 }
    ]);

    await wrapper.find('.search-bar__button').trigger('click');


    const input = wrapper.find('.search-bar__input');
    await input.setValue('Breaking Bad');

    await new Promise(resolve => setTimeout(resolve, 300));

    expect(tvMazeService.searchShows).toHaveBeenCalledWith('Breaking Bad');
  });

  it('should display a loading state while searching', async () => {
    tvMazeService.searchShows.mockImplementation(() =>
      new Promise(resolve => setTimeout(resolve, 1000))
    );

    await wrapper.find('.search-bar__button').trigger('click');
    await wrapper.find('.search-bar__input').setValue('test');

    await new Promise(resolve => setTimeout(resolve, 300));

    const loading = wrapper.find('.search-bar__loading');
    expect(loading.exists()).toBe(true);
  });

  it('should display an error state when API fails', async () => {
    tvMazeService.searchShows.mockRejectedValue(new Error('API Error'));

    await wrapper.find('.search-bar__button').trigger('click');
    await wrapper.find('.search-bar__input').setValue('test');

    await new Promise(resolve => setTimeout(resolve, 300));
    await nextTick();

    const error = wrapper.find('.search-bar__error');
    expect(error.exists()).toBe(true);
  });

  it('should close overlay if the escape key is pressed', async () => {
    await wrapper.find('.search-bar__button').trigger('click');

    await wrapper.trigger('keydown', { key: 'Escape' });

    expect(wrapper.find('.search-bar__overlay').exists()).toBe(false);
  });
});