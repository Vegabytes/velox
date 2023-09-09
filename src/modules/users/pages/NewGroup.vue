<template>
  <v-container>
    <v-form @submit.prevent ref="form">
      <v-card elevation="8" rounded="lg" color="secondary">

        <veloxHeader :path="appStore.currentGroup.path" :name="appStore.currentGroup.name"
          :description="appStore.currentGroup.description" />

        <v-card-text class="pa-12">
          <v-form v-model="valid" @submit.prevent>


            <v-row class="my-4">
              <v-col ols="12" lg="6" class="d-flex align-center justify-lg-start justify-center">
                <h2 class="text-primary text-h5 text-lg-h2 text-md-h4">Nuevo Grupo</h2>
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
              <v-col cols="12">
                <v-text-field v-model="userStore.newGroup.name" density="compact" placeholder="Nombre" label="Nombre"
                  variant="outlined" :rules="[rules.required]"></v-text-field>
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
                <v-file-input accept="image/*" label="Elige una imagen para el nuevo grupo" v-model="files"
                  :rules="[rules.requiredFile]"></v-file-input>
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
    </v-form>

  </v-container>
</template>



<script setup>

import { ref, computed, onBeforeMount } from 'vue'
import { useAppStore, useUsersStore, useLoginStore, useSnackbarStore } from '@/store/index';
import rules from '../../../support/rules/fieldRules'
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import veloxBtnReturn from '@/components/veloxBtnReturn.vue'
import veloxHeader from '@/components/veloxHeader.vue'

const appStore = useAppStore()
const userStore = useUsersStore()
const snackbarStore = useSnackbarStore();
const $router = useRouter();
const $route = useRoute();

const valid = ref(false)
const idGroup = computed(() => $route.params.idGroup)
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


const createNewGroup = async () => {
  try {
    if (valid.value) {
      const { file } = await subirArchivo();

      const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

      try {
        userStore.newGroup['createdBy'] = appStore.currentUser.id;
        userStore.newGroup['parentGroupId'] = appStore.currentGroup.id;
        userStore.newGroup['status'] = 1;
        userStore.newGroup['path'] = `${file.destination}/${file.filename}`;

        const res = await axios.post(`${url}/groups/create`, userStore.newGroup)
        snackbarStore.activateMessage('Grupo creado correctamente', 'primary', 2500)
        $router.push(`/${idGroup.value}/groups`);

      } catch (error) {
        snackbarStore.activateMessage(Error, 'error', 2500)
        console.error(error);
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

