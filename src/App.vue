<template>
  <v-app>
    <v-main class="main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
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
