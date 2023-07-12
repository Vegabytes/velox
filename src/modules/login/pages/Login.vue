<template>
  
  <div>



    <v-row class="d-flex mx-auto my-6 justify-center text-h1 font-weight-thin">
      <h2>Velox</h2>
    </v-row>
    <!--
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    >
  </v-img>-->

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
      color="white"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Usuario</div>

      <v-text-field
        density="compact"
        placeholder="Correo electrónico"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Contraseña

        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          ¿Olvidaste la contraseña?</a>
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
        iniciar sesión
      </v-btn>

      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none "
          @click="toCreateUser()"
          rel="noopener noreferrer"
          target="_blank"
        >
          Crear cuenta <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>
  </div>



</template>



<script setup>

import router from '@/router';
import { useLoginStore } from '@/store/index';
import { ref } from 'vue'

let valid = ref(false)
const loginStore = useLoginStore()

const toCreateUser = () => {
  router.push('/create')
}

</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}

.cursorPointer{
  cursor: pointer;
}
</style>

