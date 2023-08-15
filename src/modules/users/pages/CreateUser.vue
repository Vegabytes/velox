<template>
  <v-container class="d-flex justify-center">

    <v-card elevation="8" rounded="lg" color="secondary" min-width="70%">

      <v-img :src="appStore.currentGroup.path" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="150px" cover>
        <v-card-title class="text-white text-h2" v-text="appStore.currentGroup.name"></v-card-title>
        <v-card-subtitle class="text-white text-h5 mb-4" v-text="appStore.currentGroup.description"></v-card-subtitle>
      </v-img>

      <v-card-text class="pa-12">
        <v-form v-model="valid" @submit.prevent>

          <v-row class="d-flex justify-center align-center mb-6">
            <v-col cols="8">
              <h2 class="text-primary text-h2">Nuevo Usuario</h2>
            </v-col>
            <v-col cols="4" class="d-flex justify-end">
              <v-btn class="justify-end" color="primary" variant="" prepend-icon="mdi-arrow-left-thin"
                @click="toUserPage()">
                Volver</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="userStore.createdUser.name" density="compact" placeholder="Nombre" label="Nombre"
                variant="outlined" :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="userStore.createdUser.lastName" density="compact" placeholder="Apellidos"
                label="Apellidos" variant="outlined" :rules="[rules.required]"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="userStore.createdUser.email" density="compact" placeholder="Correo electrónico"
                type="email" label="Correo electrónico" variant="outlined"
                :rules="[rules.required, rules.email]"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="userStore.createdUser.pass" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'" density="compact" placeholder="Contraseña"
                prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
                :rules="[rules.required]"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Dirección (Opcional)" v-model="userStore.createdUser.address" density="compact"
                placeholder="Dirección" variant="outlined"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="Teléfono (Opcional)" v-model="userStore.createdUser.phone" density="compact"
                placeholder="Teléfono" variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select label="Grupo" v-model="userStore.createdUser.status" density="compact"
                :items="['Administrador', 'Cliente']" variant="outlined"></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea label="Descripción (Opcional)" v-model="userStore.createdUser.description" density="compact"
                variant="outlined"></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn block class="mb-8" color="primary" size="large" type="submit" @click="createNewUser">
                Crear nuevo usuario
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>


  </v-container>
</template>



<script setup>

import { ref, onBeforeMount } from 'vue'
import { useAppStore, useUsersStore, useLoginStore } from '@/store/index';
import rules from '../../../support/rules/fieldRules'
import axios from "axios";

const appStore = useAppStore()
const userStore = useUsersStore()
const loginStore = useLoginStore()

import { useRouter } from "vue-router";
const $router = useRouter();

const valid = ref(false)
let visible = ref(false)

const toUserPage = () => {
  $router.go(-1)
}


const createNewUser = async () => {
  try {
    if (valid.value) {

      const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

      try {

        userStore.createdUser['createdBy'] = appStore.currentUser.id

        const res = await axios.post(`${url}/users/create`, userStore.createdUser)
        const { data } = res;
        console.log(`Data: ${data} `);
        return data;

      } catch (error) {
        console.error(error);
      }
    }

  } catch (error) {
    console.error(error);
  }
}

onBeforeMount(() => {
  if (!loginStore.loggedUser.groupId) {
    $router.push("error");
  }
});


</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}
</style>

