<template>
  <v-app>
    <v-snackbar v-model="snackbarStore.activate" :color="snackbarStore.color" :location="snackbarStore.location"
    :timeout="snackbarStore.timeout">
    <div class="text-subtitle-1 pb-2"> {{ snackbarStore.text }}</div>
  </v-snackbar>
    <v-main class="main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>

import { useSnackbarStore } from '@/store/index';
const snackbarStore = useSnackbarStore();

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
