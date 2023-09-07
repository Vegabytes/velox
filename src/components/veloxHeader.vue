<template>
  <v-row>
    <v-col md="1" cols="12" class="d-flex justify-center align-center">
      <v-img class="" max-width="80" src="@/assets/logo.png" />
    </v-col>
    <v-col md="11" cols="12" class="d-flex justify-center py-0">

      <v-img :src="`${path}/${props.path}`" class="align-end rounded-bs-xl"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="150px" cover>
        <v-card-title class="text-white text-h2" v-text="props.name"></v-card-title>
        <v-card-subtitle class="text-white text-h5 mb-4" v-text="props.description"></v-card-subtitle>
      </v-img>

    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps(['path', 'name', 'description'])
const path = ref(import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000');
</script>