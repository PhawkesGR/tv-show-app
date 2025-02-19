<script setup>
  import { XIcon as CloseIcon, SearchIcon } from 'lucide-vue-next';
  import { useRouter } from 'vue-router';
  import { ref, onMounted, onUnmounted, watch } from "vue";
  import { tvMazeService } from '../services/tvMazeService.js';

  const router = useRouter();

  const navigateToShowDetails = (id) => {
      router.push(`/show/${id}`);
      clearSearch();
  };

  const isOpen = ref(false);
  const searchQuery = ref("");
  const searchInput = ref(null);
  const searchResults = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  const search = async (query) => {
    if (!query.trim()) {
      searchResults.value = [];
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      searchResults.value = await tvMazeService.searchShows(query);
    } catch (err) {
      error.value = 'Failed to fetch results. Please try again.';
      searchResults.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const debouncedSearch = debounce(search, 300);

  watch(searchQuery, (newQuery) => {
    debouncedSearch(newQuery);
  });

  const openSearch = () => {
    isOpen.value = true;
    setTimeout(() => {
      searchInput.value?.focus();
    }, 100);
  };

  const clearSearch = () => {
    searchQuery.value = "";
    isOpen.value = false;
  };

  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      isOpen.value = false;
    }
  };
</script>

<template>
  <div class="search-bar" @keydown="handleKeydown">
    <button
      type="button"
      class="search-bar__button"
      @click="openSearch"
      :aria-label="isOpen ? 'Close search' : 'Open search'"
    >
      <SearchIcon size="28" />
    </button>

    <div v-if="isOpen" class="search-bar__overlay" @click.self="isOpen = false">
      <div class="search-bar__box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search TV shows..."
          class="search-bar__input"
          ref="searchInput"
        />
        <button @click="clearSearch" class="search-bar__close-button">
          <CloseIcon size="20" color="black" />
        </button>
      </div>

      <div v-if="searchQuery" class="search-bar__results">
        <div v-if="isLoading" class="search-bar__loading">
          Loading...
        </div>
        <div v-else-if="error" class="search-bar__error">
          {{ error }}
        </div>
        <div v-else-if="searchResults.length === 0 && searchQuery" class="search-bar__no-results">
          No results found
        </div>
        <ul v-else class="search-bar__results-list">
          <li
            v-for="show in searchResults"
            :key="show.id"
            class="search-bar__result-item"
            @click="navigateToShowDetails(show.id)"
          >
            <img
              class="search-bar__result-image"
              :src="show.imageUrl || 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='"
              :alt="show.title"
            />
            <div class="search-bar__result-info">
              <h3 class="search-bar__result-title">{{ show.title }}</h3>
              <p class="search-bar__result-subtitle" v-if="show.genres.length">{{ show.genres.join(', ') }}</p>
              <p class="search-bar__result-subtitle">Rating: {{ show.rating || 'N/A' }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.search-bar {
    &__button {
        border: none;
        background: none;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            transform: scale(1.2);
        }
    }

    &__overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 2rem;
    }

    &__box {
      position: relative;
      width: 80%;
      max-width: 350px;

      @media (min-width: 768px) {
        max-width: 400px;
      }
    }

    &__input {
      width: 80%;
      padding: 0.8rem 2.5rem 0.8rem 1rem;
      border: none;
      outline: none;
      font-size: 1rem;
      border-radius: 1.5rem;
      background: #f5f5f5;
      color: #333;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    &__close-button {
      position: absolute;
      right: 8%;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    &__results {
      width: 80%;
      max-width: 400px;
      margin-top: 1rem;
      background: #242424;
      border-radius: 0.5rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      max-height: 70vh;
      overflow-y: auto;
    }

    &__loading,
    &__error,
    &__no-results {
      padding: 1rem;
      text-align: center;
      color: #e2e2e2;
    }

    &__results-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &__result-item {
      display: flex;
      padding: 1rem;
      border-bottom: 1px solid #eee;
      transition: transform 0.3s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        cursor: pointer;
        transform: scale(1.05);
      }
    }

    &__result-title {
      color: white;
      font-size: 1rem;
    }

    &__result-subtitle {
      color: #e2e2e2;
      margin: 0;
      font-size: 0.875rem;
    }

    &__result-image {
      width: 3rem;
      margin-right: 1rem;
    }
}
</style>