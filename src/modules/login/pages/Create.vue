<template>
  <v-container class="h-screen d-flex align-center justify-center">
    <v-col>
      <v-form v-model="valid" @submit.prevent>
        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg" color="white">

          <h2 class="mb-6">Nueva cuenta</h2>

          <div class="text-subtitle-1 text-medium-emphasis">Nombre y apellidos</div>

          <v-text-field v-model="loginStore.createdUser.name" density="compact" placeholder="Nombre y apellidos"
            variant="outlined" :rules="[rules.required]"></v-text-field>

          <div class="text-subtitle-1 text-medium-emphasis">Correo electrónico</div>

          <v-text-field v-model="loginStore.createdUser.email" density="compact" placeholder="Correo electrónico"
            variant="outlined" :rules="[rules.required, rules.email]"></v-text-field>

          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            Contraseña
          </div>

          <v-text-field v-model="loginStore.createdUser.pass" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'" density="compact" placeholder="Contraseña"
            prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
            :rules="[rules.required]"></v-text-field>

          <v-btn block class="mb-8" color="primary" size="large" variant="tonal" type="submit" @click="create">
            Crear cuenta
          </v-btn>

        </v-card>
      </v-form>
    </v-col>
  </v-container>
</template>



<script setup>

import { ref } from 'vue'
import { useAppStore, useLoginStore } from '@/store/index';
import loginService from '../login.service';
import rules from '../../../support/rules/fieldRules'

const appStore = useAppStore()
const loginStore = useLoginStore()

appStore.showMenu = false
const valid = ref(false)
let visible = ref(false)

/* const required = [
  value => {
    if (value) return true
    return 'El campo es obligatorio.'
  }
] */

const create = async () => {
  try {
    if (valid.value) {
      await loginService.create(loginStore.createdUser);
    }

  } catch (error) {
    console.error(error);
  }
}


</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}
</style>

