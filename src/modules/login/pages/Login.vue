<template>
  <v-container class="d-flex justify-center">
    <v-row v-if="isLoading" class="text-h3 pa-5 mt-10 mb-10 font-weight-thin d-flex justify-center align-center">
      <v-progress-circular :size="100" :width="10" color="orange" indeterminate></v-progress-circular>
    </v-row>
    <v-col v-if="!isLoading">
      <v-form v-model="valid" @submit.prevent>

    <v-img
      class="mx-auto my-6"
      max-width="80"
      src="@/assets/logo.png"
    >
  </v-img>

        <v-row class="d-flex justify-center">
          <v-card elevation="8" min-width="448" rounded="lg" color="secondary" :loading="loading">
            <v-img :src="`${path}/${appStore.currentGroup.path}`" class="align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="120px" cover>
              <!--         <v-card-item>
                <v-card-title class="text-white" v-text="appStore.currentGroup.name"></v-card-title>
                <v-card-subtitle class="text-white" v-text="appStore.currentGroup.description"></v-card-subtitle>
              </v-card-item> -->
            </v-img>
            <v-card-text class="pa-4">
              <v-row>
                <v-col cols="12">
                  <p class="mt-2 mb-8 text-h6 text-center font-weight-bold">{{ appStore.currentGroup.name }}</p>
                  <v-text-field v-model="loginStore.loggedUser.email" class="grey-darken-1" variant="underlined"
                    placeholder="Correo electrónico" label="Correo electrónico" prepend-inner-icon="mdi-email-outline"
                    :rules="[rules.required, rules.email]"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="loginStore.loggedUser.pass" class="grey-darken-1"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    placeholder="Contraseña" label="Contraseña" prepend-inner-icon="mdi-lock-outline" variant="underlined"
                    @click:append-inner="visible = !visible" :rules="[rules.required]"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-btn block class="rounded-lg" color="primary" size="large" type="submit" @click="login"
                    :disabled="calling">
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
import { useAppStore, useLoginStore, useSnackbarStore, useLoadingStore } from '@/store/index';
import loginService from '../login.service';
import rules from '../../../support/rules/fieldRules'
import { useRoute, useRouter } from "vue-router";
import handleError from "@/support/errors/handleError";

const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loginStore = useLoginStore()
const snackbarStore = useSnackbarStore();
const loadingStore = useLoadingStore();

const path = ref(import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000');
const isLoading = computed(() => loadingStore.isLoading);
const valid = ref(false)
let visible = ref(false)
const loading = ref(false)


const calling = ref(false);

const idGroup = computed(() => {
  loginStore.loggedUser.groupId = ($route.params.idGroup)
  return $route.params.idGroup
})

onBeforeMount(async () => {
  loadingStore.setLoading(true);
  try {
    await getGroupData()
  }
  catch (err) {
    console.error(err);
  }
  finally {
    loadingStore.setLoading(false);
  }

});


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
      appStore.setCurrentUser(user.user);
      
      //Comprobamos que el usuario sera Administrador
      if(user.admin){
        appStore.admin = true
      }else{
        appStore.admin = false
      }
      //appStore.setIsAdmin(user.admin)
      $router.push({
        name: 'Groups', pathMatch: `${idGroup.value} `
      });


    } catch (error) {
      const mensajeError = handleError.getErrorNormalizado(error);
      snackbarStore.activateMessage(mensajeError, 'error', 2500)
    }
    finally {
      loading.value = false
      calling.value = false;
    }
  }
}



</script>

<style scoped>
@import "@fontsource/poppins";
/* @import "@fontsource/poppins/200.css";

@import "@fontsource/poppins";
@import "@fontsource/poppins/400.css";
@import "@fontsource/poppins/400-italic.css"; */



body {
  font-family: "Poppins" !important;
}


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

