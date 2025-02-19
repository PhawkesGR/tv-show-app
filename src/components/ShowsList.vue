<script setup>
    import { ChevronLeftIcon, ChevronRightIcon , StarIcon} from 'lucide-vue-next';
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const navigateToShowDetails = (id) => {
        router.push(`/show/${id}`);
    };

    const props = defineProps({
        genre: {
            type: String,
            required: true,
        },
        shows: {
            type: Array,
            required: true,
        },
    });

    const scrollContainer = ref(null);
    const scrollPosition = ref(0);
    const maxScroll = ref(0);

    onMounted(() => {
        updateMaxScroll();
        window.addEventListener('resize', updateMaxScroll);
    });

    const updateMaxScroll = () => {
        if (scrollContainer.value) {
            maxScroll.value = scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth;
        }
    };

    const handleScroll = () => {
        if (scrollContainer.value) {
            scrollPosition.value = scrollContainer.value.scrollLeft;
        }
    };

    const scrollLeft = () => {
        if (scrollContainer.value) {
            scrollContainer.value.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainer.value) {
            scrollContainer.value.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };
</script>

<template>
    <div class="shows-list">
        <div class="shows-list__header">
            <h2 class="shows-list__title">{{ genre }}</h2>
            <div class="shows-list__nav-buttons">
            <button
                @click="scrollLeft"
                class="shows-list__nav-button"
                :disabled="scrollPosition <= 0"
            >
                <ChevronLeftIcon :class="scrollPosition <= 0 ? 'shows-list__icon--disabled' : ''" />
            </button>
            <button
                @click="scrollRight"
                class="shows-list__nav-button"
                :disabled="scrollPosition >= maxScroll"
            >
                <ChevronRightIcon :class="scrollPosition >= maxScroll ? 'shows-list__icon--disabled' : ''" />
            </button>
        </div>
        </div>
        <div
            ref="scrollContainer"
            class="shows-list__list"
            @scroll="handleScroll"
        >
            <div
                v-for="show in shows"
                :key="show.id"
                class="shows-list__item"
                @click="navigateToShowDetails(show.id)"
            >
                <img
                    loading="lazy"
                    :src="show.imageUrl"
                    :alt="show.title"
                    class="shows-list__image"
                >
                <div class="shows-list__show-title">
                    <h3>{{ show.title }}</h3>
                    <div class="shows-list__rating">
                        {{ show.rating }}
                        <StarIcon class="shows-list__show-title-icon" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<style lang="scss" scoped>
    .shows-list {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 1.25rem 1rem;

        &__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
            padding-right: 1rem;
        }

        &__nav-buttons {
            display: flex;
            gap: .5rem;
            justify-content: flex-end;
        }

        &__nav-button {
            background-color: #333;
            color: white;
            border: none;
            border-radius: 50%;
            width: 2.5rem;
            height: 2.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s;

            &:disabled {
                cursor: not-allowed;
            }

            &:not(:disabled):hover {
                background-color: #555;
            }
        }

        &__icon--disabled {
            stroke: #666;
        }

        &__list {
            display: flex;
            overflow-x: auto;
            scroll-behavior: smooth;
            gap: 1.25rem;
            scrollbar-width: none;
            -ms-overflow-style: none;

            &::-webkit-scrollbar {
                display: none;
            }
        }

        &__item {
            flex: 0 0 auto;
            width: 200px;

            &:hover {
                cursor: pointer;
            }
        }

        &__image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 0.5rem;
            transition: transform 0.3s;

            &:hover {
                transform: scale(1.05);
            }
        }

        &__title {
            margin-top: 0.5rem;
            text-align: center;
            font-weight: bold;
        }

        &__show-title {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
        }

        &__show-title-icon {
            color: #f5c518;
            fill: #f5c518;
            width: 1.2rem;
            height: 1.2rem;
        }

        &__rating {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
    }
</style>