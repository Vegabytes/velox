<template>
  <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
    <v-card elevation="8" rounded="lg" color="secondary">
      <veloxHeader :path="appStore.currentGroup.path" :name="appStore.currentGroup.name"
        :description="appStore.currentGroup.description" />
      <v-card-text :class="mobile ? 'pa-4' : 'pa-12'">
        <v-row class="mt-4 my-8 justify-space-between">
          <v-col ols="12" lg="6" class="d-flex">
            <h2 class="text-primary text-h5 text-lg-h3 text-md-h4">Nuevo Grupo</h2>
          </v-col>
          <v-breadcrumbs :items="breadcrumbsItems" class="px-0">
            <template v-slot:prepend>
              <v-icon size="small" icon="mdi-home"></v-icon>
            </template>
          </v-breadcrumbs>
        </v-row>

        <v-form @submit.prevent ref="formNewGroup">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="userStore.newGroup.name" density="compact" placeholder="Nombre"
                label="Nombre del nuevo grupo *" variant="outlined" :rules="[rules.required]"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea label="Descripción (Opcional)" v-model="userStore.newGroup.description" density="compact"
                variant="outlined"></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-file-input accept="image/*" label="Elija una imagen para el nuevo grupo *" v-model="files"
                :rules="[rules.requiredFile]"></v-file-input>
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
              <v-btn block class="mb-8" color="primary" size="large" type="submit" @click="createNewGroup">
                Crear nuevo grupo
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
  <v-snackbar v-model="snackbarStore.activate" :color="snackbarStore.color" :location="snackbarStore.location"
    :timeout="snackbarStore.timeout">
    <div class="text-subtitle-1 pb-2"> {{ snackbarStore.text }}</div>
  </v-snackbar>
</template>



<script setup>

import { ref, computed, onBeforeMount } from 'vue'
import { useAppStore, useUsersStore, useSnackbarStore, useLoadingStore } from '@/store/index';
import rules from '../../../support/rules/fieldRules'
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import veloxHeader from '@/components/veloxHeader.vue'
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay()
const appStore = useAppStore()
const userStore = useUsersStore()
const snackbarStore = useSnackbarStore();
const loadingStore = useLoadingStore();
const currentUser = computed(() => appStore.getCurrentUser);
const $router = useRouter();
const $route = useRoute();

const formNewGroup = ref(null);
const estadoFormulario = ref(false);
const idGroup = computed(() => $route.params.idGroup)
const files = ref([]);
const isAdmin = computed(() => appStore.getIsAdmin);

const breadcrumbsItems = [
  {
    title: 'Inicio',
    disabled: false,
    to: { name: 'Groups' },
  },
]


onBeforeMount(async () => {
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


const createNewGroup = async () => {
  estadoFormulario.value = await formNewGroup.value.validate();
  if (estadoFormulario.value.valid) {
    try {
      const { file } = await subirArchivo();
      const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

      loading.value = true;
      userStore.newGroup['createdBy'] = appStore.currentUser.id;
      userStore.newGroup['parentGroupId'] = appStore.currentGroup.id;
      userStore.newGroup['status'] = 1;
      userStore.newGroup['path'] = `${file.destination}/${file.filename}`;

      const res = await axios.post(`${url}/groups/create`, userStore.newGroup)
      snackbarStore.activateMessage('Grupo creado correctamente', 'success', 2500)
      $router.push(`/${idGroup.value}/groups`);

    }
    catch (error) {
      snackbarStore.activateMessage(error, 'error', 2500)
      console.error(error);
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

