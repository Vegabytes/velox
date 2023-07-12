<template>
  
  <div>


    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
      color="white"
    >

      <h2 class="mb-6">Nueva cuenta</h2>
    
      <div class="text-subtitle-1 text-medium-emphasis">Nombre y apellidos</div>

      <v-text-field
        density="compact"
        placeholder="Nombre y apellidos"
        variant="outlined"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis">Correo electrónico</div>

      <v-text-field
        density="compact"
        placeholder="Correo electrónico"
        variant="outlined"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Contraseña
      </div>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Contraseña"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-btn
        block
        class="mb-8"
        color="primary"
        size="large"
        variant="tonal"
      >
        Crear cuenta
      </v-btn>

    </v-card>
  </div>



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

