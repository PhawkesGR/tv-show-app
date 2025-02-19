<script setup>
  import Header from './components/Header.vue';
</script>

<template>
  <Header />
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <div v-if="Component">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
</style>
