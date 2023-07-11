<template>
  <v-container>
    <h1 class="text-h2 font-weight-bold mb-3">Login</h1>
  </v-container>
</template>



<script setup>

import { useLoginStore } from '@/store/index';
import { ref } from 'vue'

let valid = ref(false)
const loginStore = useLoginStore()


</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}
</style>

