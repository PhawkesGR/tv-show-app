<script setup>
    import { onMounted, ref } from 'vue';
    import { tvMazeService } from '../services/tvMazeService.js';
    import ShowsList from '../components/ShowsList.vue';

    const showsByGenre = ref({});

    const initializeGenres = async () => {
        try {
            const data = await tvMazeService.getAllGenresWithShows();
            showsByGenre.value = data;
        } catch (e) {
            console.error('Error loading shows:', e)
        }
    }

    onMounted(initializeGenres);
</script>

<template>
    <ShowsList
        v-for="[genre, shows] in Object.entries(showsByGenre)"
        :key="genre"
        :genre="genre"
        :shows="shows"
    />
</template>

<style lang="scss" scoped>
</style>