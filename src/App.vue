<template>
  <v-app>
    <v-main class="main">

      <Menu v-if="appStore.showMenu"></Menu>
      
        <router-view />

    </v-main>
  </v-app>
</template>

<script setup>
import Menu from '@/components/Menu.vue';
import { useAppStore } from '@/store/index';

const appStore = useAppStore()


</script>

<style>


@font-face {
  font-family: 'Calistoga';
  src: url('@/assets/fonts/Calistoga/Calistoga-Regular.ttf') format('truetype');
}

  .main{
    background-image: url("assets/fondo3.png") !important;
    background-attachment: fixed !important;
    background-size: cover;
  }

  h2,h3,h4{
    font-family: Calistoga;
  }
</style>
