<template>

  <v-container class="h-screen d-flex align-center justify-center">
    <v-col>
      <v-form v-model="valid" @submit.prevent>
      
        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="1200" rounded="lg">

          <v-row>
            <v-col cols="6">
              <h2 class="text-primary text-h2">Nueva cuenta</h2>
            </v-col>
            <v-col cols="6" class="d-flex justify-end">
              <v-btn class="justify-end" color="primary" variant="tonal" prepend-icon="mdi-arrow-left-thin">
                Volver inicio</v-btn>
            </v-col>
          </v-row>

          

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="loginStore.createdUser.name" density="compact" placeholder="Nombre" label="Nombre"
            variant="outlined" :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="loginStore.createdUser.lastname" density="compact" placeholder="Apellidos" label="Apellidos"
            variant="outlined" :rules="[rules.required]"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="loginStore.createdUser.email" density="compact" placeholder="Correo electrónico" type="email" label="Correo electrónico"
            variant="outlined" :rules="[rules.required, rules.email]"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="loginStore.createdUser.pass" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'" density="compact" placeholder="Contraseña"
            prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
            :rules="[rules.required]"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Dirección (Opcional)" 
                v-model="loginStore.createdUser.address" 
                density="compact" placeholder="Dirección"
                variant="outlined" ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Teléfono (Opcional)" 
                v-model="loginStore.createdUser.phone" 
                density="compact" placeholder="Teléfono"
                variant="outlined" ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                label="Grupo"
                v-model="loginStore.createdUser.status" 
                density="compact"
                :items="['Administrador', 'Cliente']"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea 
                label="Descripción (Opcional)"
                v-model="loginStore.createdUser.description"
                density="compact"
                variant="outlined"
              ></v-textarea>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-btn block class="mb-8" color="primary" size="large" type="submit" @click="create">
                Crear cuenta
              </v-btn>
            </v-col>
          </v-row>

          

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

