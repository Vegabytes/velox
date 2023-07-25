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

        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg" color="white" :loading="loading">

          <form>
            <div class="text-subtitle-1">Correo electrónico</div>

            <v-text-field v-model="loginStore.loggedUser.email" density="compact" placeholder="Correo electrónico"
              prepend-inner-icon="mdi-email-outline" variant="outlined"
              :rules="[rules.required, rules.email]"></v-text-field>

            <div class="text-subtitle-1 d-flex align-center justify-space-between"
              :rules="[rules.required]">
              Contraseña
            </div>

            <v-text-field v-model="loginStore.loggedUser.pass" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'" density="compact" placeholder="Contraseña"
              prepend-inner-icon="mdi-lock-outline" variant="outlined"
              @click:append-inner="visible = !visible"></v-text-field>

            <v-btn block class="mb-8" color="primary" size="large" type="submit" @click="login">
              iniciar sesión
            </v-btn>

            <v-card-text class="text-center">
              <v-btn class="text-blue text-decoration-none " @click="toCreateUser()" rel="noopener noreferrer" color="primary" variant="tonal"
                target="_blank">
                Crear cuenta <v-icon icon="mdi-chevron-right"></v-icon>
              </v-btn>
            </v-card-text>
          </form>
        </v-card>
      </v-form>
    </v-col>

  </v-container>
</template>



<script setup>

import router from '@/router';
import { ref } from 'vue'
import { useAppStore, useLoginStore } from '@/store/index';
import loginService from '../login.service';
import rules from '../../../support/rules/fieldRules'
import { useRoute, useRouter } from "vue-router";

const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loginStore = useLoginStore()
appStore.showMenu = false

const valid = ref(false)
let visible = ref(false)
let loading = ref(false)

const toCreateUser = () => {
  router.push('/create')
}


const login = async () => {

  loading.value = true

  try {
    if (valid.value) {
      const user = await loginService.login(loginStore.loggedUser);
      appStore.currentUser = user.user;
      const to = $route.query.to?.toString();
      $router.push(to || "/admins");
    }

  } catch (error) {
    console.error(error);
  }
  finally {
    loading.value = false
  }
}

</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}

.cursorPointer {
  cursor: pointer;
}

.title{
  text-shadow: 1px 1px 2px black;
}

</style>

