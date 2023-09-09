<template>
  <v-snackbar v-model="snackbarStore.activate" :color="snackbarStore.color" :location="snackbarStore.location"
    :timeout="snackbarStore.timeout">
    <div class="text-subtitle-1 pb-2"> {{ snackbarStore.text }}</div>
  </v-snackbar>

  <v-container>

    <v-card elevation="8" rounded="lg" color="secondary" min-width="70%">

      <veloxHeader :path="appStore.currentGroup.path" :name="appStore.currentGroup.name"
        :description="appStore.currentGroup.description" />


      <v-card-text class="pa-12">
        <v-form v-model="valid" @submit.prevent>

          <v-row class="my-4">
            <v-col ols="12" lg="6" class="d-flex align-center justify-lg-start justify-center">
              <h2 class="text-primary text-h5 text-lg-h2 text-md-h4">Nuevo Usuario</h2>
            </v-col>
            <v-col cols="12" lg="6" class="d-flex justify-lg-end justify-md-center justify-sm-center justify-center pt-0">
              <v-breadcrumbs :items="breadcrumbsItems">
                <template v-slot:prepend>
                  <v-icon size="small" icon="mdi-home"></v-icon>
                </template>
              </v-breadcrumbs>
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
            <v-col cols="12" md="6">
              <v-text-field v-model="userStore.createdUser.email" density="compact" placeholder="Correo electrónico"
                type="email" label="Correo electrónico" variant="outlined"
                :rules="[rules.required, rules.email]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <Datepicker v-model="userStore.createdUser.birth" locale="es" :format="format" :format-locale="es"
                cancelText="Cancelar" selectText="Aceptar" required placeholder="Fecha de nacimiento" />

            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="userStore.createdUser.pass" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'" density="compact" placeholder="Contraseña"
                prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
                :rules="[rules.required]"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="userStore.createdUser.confirmPass"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                density="compact" placeholder="Repetir contraseña" prepend-inner-icon="mdi-lock-outline"
                variant="outlined" @click:append-inner="visible = !visible"
                :rules="[val => rules.pwdConfirm(val, password)]"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field label="Dirección (Opcional)" v-model="userStore.createdUser.address" density="compact"
                placeholder="Dirección" variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Teléfono (Opcional)" v-model="userStore.createdUser.phone" density="compact"
                placeholder="Teléfono" variant="outlined" :rules="[rules.telephone]"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-file-input accept="image/*" label="Elige una imagen para el nuevo usuario" v-model="files"
                :rules="[rules.requiredFile]"></v-file-input>
            </v-col>
          </v-row>
          <v-row>
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

import { ref, computed, onBeforeMount } from 'vue'
import { useAppStore, useUsersStore, useSnackbarStore } from '@/store/index';
import rules from '../../../support/rules/fieldRules'
import axios from "axios";
import veloxHeader from '@/components/veloxHeader.vue'
import veloxBtnReturn from '@/components/veloxBtnReturn.vue'
import { es } from 'date-fns/locale';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useRoute, useRouter } from "vue-router";

const appStore = useAppStore()
const userStore = useUsersStore()
const snackbarStore = useSnackbarStore();


const $router = useRouter();
const $route = useRoute();
const idGroup = computed(() => $route.params.idGroup)
const valid = ref(false)
let visible = ref(false)
const password = computed(() => userStore.createdUser.pass);
const files = ref([]);

const breadcrumbsItems= [
  {
    title: 'Inicio',
    disabled: false,
    to:{name: 'Groups'},
  },
]


onBeforeMount(async () => {
  userStore.createdUser = {};
});


// In case of a range picker, you'll receive [Date, Date]
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}


const createNewUser = async () => {
  try {
    if (valid.value) {
      const { file } = await subirArchivo();
      const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

      try {

        if (userStore.createdUser.birth) userStore.createdUser.birth = userStore.createdUser.birth.toISOString().split('T')[0];
        userStore.createdUser['createdBy'] = appStore.currentUser.id;
        userStore.createdUser['status'] = 1;
        userStore.createdUser['path'] = `${file.destination}/${file.filename}`;


        const res = await axios.post(`${url}/users/create`, userStore.createdUser)
        const { data } = res;
        snackbarStore.activateMessage('Usuario creado correctamente', 'primary', 2500)
        $router.push(`/${idGroup.value}/groups`);

      } catch (error) {
        snackbarStore.activateMessage(error, 'error', 2500)
      }
    }

  } catch (error) {
    console.error(error);
  }
}

const subirArchivo = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000';
  const config = {
    headers: {
      'X-Multipart-Size': files.value[0].size,
    },
  }
  let formData = new FormData();
  formData.append("file", files.value[0]);


  try {
    const res = await axios.post(`${url}/users/upload`, formData, config)
    const { data } = res;
    return data;
  }
  catch (err) {
    console.log("err", err);
    throw err;
  }
}


</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}
</style>

