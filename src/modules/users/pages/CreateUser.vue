<template>
  <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
    <v-card elevation="8" rounded="lg" color="secondary">
      <veloxHeader :path="appStore.currentGroup.path" :name="appStore.currentGroup.name"
        :description="appStore.currentGroup.description" />
      <v-card-text :class="mobile ? 'pa-4' : 'pa-12'">
        <v-row class="mt-4 my-8 justify-space-between">
          <v-col ols="12" lg="6" class="d-flex">
            <h2 class="text-primary text-h5 text-lg-h3 text-md-h4">Nuevo Usuario</h2>
          </v-col>
          <v-breadcrumbs :items="breadcrumbsItems" class="px-0">
            <template v-slot:prepend>
              <v-icon size="small" icon="mdi-home"></v-icon>
            </template>
          </v-breadcrumbs>
        </v-row>

        <v-form @submit.prevent ref="formNewUser">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="userStore.createdUser.name" density="compact" placeholder="Nombre" label="Nombre *"
                variant="outlined" :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="userStore.createdUser.lastName" density="compact" placeholder="Apellidos *"
                label="Apellidos" variant="outlined" :rules="[rules.required]"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="userStore.createdUser.email" density="compact" placeholder="Correo electrónico *"
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
                :type="visible ? 'text' : 'password'" density="compact" placeholder="Contraseña" label="Contraseña *"
                prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
                :rules="[rules.required]"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="userStore.createdUser.confirmPass"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                density="compact" placeholder="Repetir contraseña" prepend-inner-icon="mdi-lock-outline"
                label="Repetir contraseña *" variant="outlined" @click:append-inner="visible = !visible"
                :rules="[val => rules.pwdConfirm(val, password)]"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="Dirección (Opcional)" v-model="userStore.createdUser.address" density="compact"
                placeholder="Dirección" variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Teléfono (Opcional)" v-model="userStore.createdUser.phone" density="compact"
                placeholder="Teléfono" variant="outlined" :rules="[rules.telephone]"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-file-input accept="image/*" label="Elija una imagen para el nuevo usuaario *" v-model="files"
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
          <v-row class="mt-3">
            <v-col cols="12">
              <p class="text-sm-caption">
                Los campos señalados con * son obligatorios
              </p>
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

    <v-snackbar v-model="snackbarStore.activate" :color="snackbarStore.color" :location="snackbarStore.location"
      :timeout="snackbarStore.timeout">
      <div class="text-subtitle-1 pb-2"> {{ snackbarStore.text }}</div>
    </v-snackbar>
  </v-container>
</template>



<script setup>

import { ref, computed, onBeforeMount } from 'vue'
import { useAppStore, useUsersStore, useSnackbarStore, useLoadingStore } from '@/store/index';
import rules from '../../../support/rules/fieldRules'
import axios from "axios";
import veloxHeader from '@/components/veloxHeader.vue'
import { es } from 'date-fns/locale';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from 'vuetify';
import handleError from "@/support/errors/handleError";

const { mobile } = useDisplay()
const appStore = useAppStore()
const userStore = useUsersStore()
const snackbarStore = useSnackbarStore();
const loadingStore = useLoadingStore();
const currentUser = computed(() => appStore.getCurrentUser);


const $router = useRouter();
const $route = useRoute();
const idGroup = computed(() => $route.params.idGroup)
const visible = ref(false)
const password = computed(() => userStore.createdUser.pass);
const files = ref([]);
const formNewUser = ref(null);
const estadoFormulario = ref(false);
const isAdmin = computed(() => appStore.getIsAdmin);

const breadcrumbsItems = [
  {
    title: 'Inicio',
    disabled: false,
    to: { name: 'Groups' },
  },
]



onBeforeMount(async () => {
  userStore.createdUser = {};
  loadingStore.setLoading(true);
  if (!currentUser.value || !currentUser.value.id) {
    $router.push(`/${idGroup.value}/login`);
  }
  try {

    await checkIsAdmin()

    if (!appStore.currentGroup || !appStore.currentGroup.id) {
      await getGroupData();
    }


    if (!isAdmin.value) {
      $router.push(`notAllowed`);
    }


  } catch (error) {
    console.error(error);
  } finally {
    loadingStore.setLoading();
  }
});


const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const createNewUser = async () => {
  estadoFormulario.value = await formNewUser.value.validate();
  if (estadoFormulario.value.valid) {
    try {
      const { file } = await subirArchivo();
      const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

      if (userStore.createdUser.birth) userStore.createdUser.birth = userStore.createdUser.birth.toISOString().split('T')[0];
      userStore.createdUser['createdBy'] = appStore.currentUser.id;
      userStore.createdUser['status'] = 1;
      userStore.createdUser['path'] = `${file.destination}/${file.filename}`;

      const res = await axios.post(`${url}/users/create`, userStore.createdUser)
      snackbarStore.activateMessage('Usuario creado correctamente', 'success', 2500)
      $router.push(`/${idGroup.value}/groups`);

    } catch (error) {
      const mensajeError = handleError.getErrorNormalizado(error);
      snackbarStore.activateMessage(mensajeError, 'error', 2500)
    }
  }
  else {
    snackbarStore.activateMessage('Tiene que rellenar todos los campos obligatorios', 'error', 2500)
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

const checkIsAdmin = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'
  try {
    const res = await axios.get(`${url}/user/admin/${idGroup.value}/${appStore.getCurrentUser.id}`)
    appStore.setIsAdmin(res.data.admin)
  } catch (error) {
    console.error(error);
    throw error;
  }
}


</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}
</style>

