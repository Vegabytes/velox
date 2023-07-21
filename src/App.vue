<template>
  <v-app>
    <v-main class="main">

      <Menu v-if="appStore.showMenu" :user="currentUser"></Menu>

      <router-view />

    </v-main>
  </v-app>
</template>

<script setup>
import Menu from '@/components/Menu.vue';
import { useAppStore } from '@/store/index';
import "./support/http/interceptors";
import { computed } from 'vue'

const appStore = useAppStore()

const currentUser = computed(() => appStore.currentUser);
</script>

<style>
@font-face {
  font-family: 'Calistoga';
  src: url('@/assets/fonts/Calistoga/Calistoga-Regular.ttf') format('truetype');
}

.main {
  /**
  background-image: url("assets/fondo3.png") !important;
  background-attachment: fixed !important;
  background-size: cover;
  */
  
}

h2,
h3,
h4 {
  font-family: Calistoga;
  font-weight: lighter;
}
</style>
