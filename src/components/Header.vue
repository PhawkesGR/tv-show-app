<script setup>
    import { TvIcon } from 'lucide-vue-next';
    import SearchBar from './SearchBar.vue';
</script>

<template>
    <header class="header">
        <div class="header__branding">
            <TvIcon size="28" class="header__icon"  />
            <h1 class="header__title">TV Shows</h1>
        </div>
        <SearchBar />
    </header>
</template>

<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem 1rem;
    color: white;

    &__branding {
        display: flex;
        align-items: center;
    }

    &__icon {
        margin-right: 1rem;
    }
}
</style>