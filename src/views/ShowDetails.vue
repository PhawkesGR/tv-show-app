<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { ArrowLeftIcon } from 'lucide-vue-next';
    import { tvMazeService } from '../services/tvMazeService.js';

    const props = defineProps({
        id: String,
    });

    const show = ref({});

    const getShowDetails = async () => {
        try {
            const data = await tvMazeService.getShowById(props.id);
            show.value = data;
        } catch (e) {
            console.error('Error fetching show:', e)
        }
    }

    onMounted(getShowDetails);

    watch(() => props.id, (newId, oldId) => {
        if (newId !== oldId) {
            getShowDetails(newId);
        }
    });
</script>

<template>
    <div class="show-details" v-if="show">
        <div class="show-details__back-home">
            <router-link class="show-details__back-home__link" to="/">
                <ArrowLeftIcon size="24" />
                <span class="show-details__back-home__text">Back home</span>
            </router-link>
        </div>
        <section class="show-details__info-wrapper">
            <img
                class="show-details__image"
                :src="show.imageUrl"
                alt="">
            <div class="show-details__info">
                <h2 class="show-details__title">{{ show.title }}</h2>
                <div class="show-details__genres">
                    <span v-for="genre in show.genres" class="show-details__genre">
                        {{ genre }}
                    </span>
                </div>
                <dl class="show-details__info-list">
                    <div class="show-details__item">
                        <dt class="show-details__term">Rating</dt>
                        <dd v-if="show.rating" class="show-details__detail">{{ show.rating }}/10</dd>
                        <dd v-else class="show-details__detail">Unknown</dd>
                    </div>
                    <div class="show-details__item">
                        <dt class="show-details__term">Status</dt>
                        <dd class="show-details__detail">{{ show.status }}</dd>
                    </div>
                    <div class="show-details__item">
                        <dt class="show-details__term">Network</dt>
                        <dd class="show-details__detail">{{ show.network }}</dd>
                    </div>
                    <div class="show-details__item">
                        <dt class="show-details__term">Premiered</dt>
                        <dd class="show-details__detail">{{ show.premiered }}</dd>
                    </div>
                    <div class="show-details__item">
                        <dt class="show-details__term">Runtime</dt>
                        <dd class="show-details__detail">{{ show.runtime }} minutes</dd>
                    </div>
                    <div class="show-details__item">
                        <dt class="show-details__term">Country</dt>
                        <dd class="show-details__detail">{{ show.country }}</dd>
                    </div>
                    <div class="show-details__item">
                        <dt class="show-details__term">Language</dt>
                        <dd class="show-details__detail">{{ show.language }}</dd>
                    </div>
                    <div class="show-details__item">
                        <dt class="show-details__term">Summary</dt>
                        <dd class="show-details__detail" v-html="show.summary"></dd>
                    </div>
                </dl>
            </div>
        </section>
        <div class="show-details__cast">
            <h2 class="show-details__cast-title">Cast</h2>
            <div class="show-details__cast-items">
                <div
                    v-for="person in show.cast"
                    :key="person.id"
                    class="show-details__cast-item"
                >
                    <img
                        :src="person.imageUrl"
                        :alt="person.title"
                        class="show-details__cast-image"
                    >
                <div class="show-details__cast-name">
                    <h3>{{ person.name }}</h3>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .show-details {
        display: flex;
        flex-direction: column;
        padding: 0 1rem;

        &__back-home {
            padding: 0 1rem;

            &__text {
                font-size: 1rem;
            }

            &__link {
                display: flex;
                gap: .3rem;
                color: #f0f4f8;
                text-decoration: none;
            }
        }

        &__info-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 1rem;
            padding: 1rem;

            @media (min-width: 768px) {
                flex-direction: row;
            }
        }

        &__info {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        &__genres {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        &__genre {
            display: inline-block;
            background-color: #f0f4f8;
            color: #333;
            font-size: 0.875rem;
            padding: 0.375rem 0.75rem;
            border-radius: 1rem;
            margin: 0.25rem;
            text-align: center;
            white-space: nowrap;
        }

        &__image {
            width: 250px;
            height: 350px;
        }

        &__info-list {
            margin-top: 0;
        }

        &__item {
            display: flex;
        }

        &__term {
            font-weight: bold;
            color: #959595;
            text-transform: uppercase;
        }

        &__detail {
            margin-left: 1rem;
        }

        &__cast {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
        }

        &__cast-items {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
        }

        &__cast-title {
            margin-bottom: 1rem;
        }
    }
</style>