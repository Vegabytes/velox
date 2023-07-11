<template>
  <v-app>
    <v-main class="d-flex align-center justify-center main">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  //
</script>

<style>
  .main{
   background-image: url("assets/fondo3.png") !important;
    background-attachment: fixed !important;
    background-size: cover;
  }
</style>
