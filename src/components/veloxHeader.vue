<template>
  <v-row>
    <v-col md="1" cols="12" class="d-flex justify-center align-center" style="height: auto;">
      <v-img class="mx-auto my-6" max-width="80" src="@/assets/logo.png" />
    </v-col>
    <v-col md="11" cols="12" class="d-flex justify-center align-center">

      <v-img :src="props.path" class="align-end rounded-bs-xl" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="150px" cover>
        <v-card-title class="text-white text-h2" v-text="props.name"></v-card-title>
        <v-card-subtitle class="text-white text-h5 mb-4" v-text="props.description"></v-card-subtitle>
      </v-img>

    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps(['path','name','description'])
</script>