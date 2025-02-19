import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Header from '../Header.vue';
import SearchBar from '../SearchBar.vue';

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Header', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Header, {
      global: {
        components: {
          SearchBar,
        }
      }
    });
  });

  it('should render correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should contain the correct title', () => {
    const title = wrapper.find('.header__title');
    expect(title.text()).toBe('TV Shows');
  });

  it('should include the SearchBar component', () => {
    const searchBar = wrapper.findComponent(SearchBar);
    expect(searchBar.exists()).toBe(true);
  });

  it('should have correct structure', () => {
    const header = wrapper.find('.header');
    expect(header.exists()).toBe(true);

    const branding = wrapper.find('.header__branding');
    expect(branding.exists()).toBe(true);

    const brandingChildren = branding.element.children;
    expect(brandingChildren[0].tagName.toLowerCase()).toBe('svg');
    expect(brandingChildren[1].tagName.toLowerCase()).toBe('h1');
  });

  it('should apply correct CSS classes', () => {
    const header = wrapper.find('.header');
    expect(header.classes()).toContain('header');

    const branding = wrapper.find('.header__branding');
    expect(branding.classes()).toContain('header__branding');

    const icon = wrapper.find('.header__icon');
    expect(icon.classes()).toContain('header__icon');
  });
});