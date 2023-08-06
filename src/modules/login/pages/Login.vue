<template>
  <v-container class="h-screen d-flex align-center justify-center">
    <v-col>
      <v-form v-model="valid" @submit.prevent>
        <v-row class="d-flex mx-auto my-6 justify-center text-h2 font-weight-thin">
          <h2 class="text-primary text-h1">Velocikaptor</h2>
        </v-row>
        <!--
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    >
  </v-img>-->

        <v-row class="d-flex justify-center">
          <v-card elevation="8" min-width="448" rounded="lg" color="secondary" :loading="loading">
            <v-img :src="appStore.currentGroup.path" class="align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px" cover>
              <v-card-item>
                <v-card-title class="text-white" v-text="appStore.currentGroup.name"></v-card-title>
                <v-card-subtitle class="text-white" v-text="appStore.currentGroup.description"></v-card-subtitle>
              </v-card-item>
            </v-img>
            <v-card-text class="pa-8">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="loginStore.loggedUser.email" placeholder="Correo electrónico"
                    label="Correo electrónico" prepend-inner-icon="mdi-email-outline"
                    :rules="[rules.required, rules.email]"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="loginStore.loggedUser.pass"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    placeholder="Contraseña" label="Contraseña" prepend-inner-icon="mdi-lock-outline"
                    @click:append-inner="visible = !visible" :rules="[rules.required]"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-btn block class="mb-8" color="primary" size="large" type="submit" @click="login" :disabled="calling">
                    iniciar sesión
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-row>


      </v-form>
    </v-col>

  </v-container>
  <v-snackbar v-model="snackbarStore.activate" :color="snackbarStore.color" :location="snackbarStore.location"
    :timeout="snackbarStore.timeout">
    <div class="text-subtitle-1 pb-2"> {{ snackbarStore.text }}</div>
  </v-snackbar>
</template>



<script setup>

import axios from "axios";
import router from '@/router';
import { ref, onBeforeMount, computed } from 'vue'
import { useAppStore, useLoginStore, useSnackbarStore } from '@/store/index';
import loginService from '../login.service';
import rules from '../../../support/rules/fieldRules'
import { useRoute, useRouter } from "vue-router";
import handleError from "@/support/errors/handleError";

const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loginStore = useLoginStore()
const snackbarStore = useSnackbarStore();
appStore.showMenu = false

const valid = ref(false)
let visible = ref(false)
let loading = ref(false)


const calling = ref(false);

const idGroup = computed(() => {
  loginStore.loggedUser.groupId = ($route.params.idGroup)
  return $route.params.idGroup
})

const getGroupData = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/groups/group/${idGroup.value}`)
    appStore.currentGroup = res.data;
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

const login = async () => {

  loading.value = true
  if (valid.value) {
    try {
      calling.value = true;
      const user = await loginService.login(loginStore.loggedUser);
      appStore.currentUser = user.user;
      appStore.admin = user.admin
      const to = $route.query.to?.toString();
      $router.push(to || "/user");


    } catch (error) {
      const mensajeError = handleError.getErrorNormalizado(error);
      snackbarStore.activateMessage(mensajeError, 'error', 2500000)
    }
    finally {
      loading.value = false
      calling.value = false;
    }
  }
}

onBeforeMount(() => {
  getGroupData()
});

</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}

.cursorPointer {
  cursor: pointer;
}

.title {
  text-shadow: 1px 1px 2px black;
}
</style>

