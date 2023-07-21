<template>
  <v-container>
    <v-card color="white" class="d-flex justify-start">
      <v-card-title class="pa-6">
        <h2>Admins</h2>
      </v-card-title>
      <v-card-text>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>

import { useAppStore } from '@/store/index';
const appStore = useAppStore()
appStore.showMenu = true



</script>
