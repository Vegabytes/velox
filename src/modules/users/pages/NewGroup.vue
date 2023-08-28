<template>
  <v-container>

    <v-form @submit.prevent ref="form">
      <v-card elevation="8" rounded="lg" color="secondary">

        <veloxHeader :path="appStore.currentGroup.path" :name="appStore.currentGroup.name" :description="appStore.currentGroup.description"/>

        <v-card-text class="pa-12">
          <v-form v-model="valid" @submit.prevent>

            <v-row class="d-flex justify-center align-center mb-6">
              <v-col cols="8">
                <h2 class="text-primary text-h2">Nuevo Grupo</h2>
              </v-col>
              <v-col cols="4" class="d-flex justify-end">
                <veloxBtnReturn/>
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
                <v-file-input accept="image/*" label="Elige una imagen para el grupo" v-model="userStore.newGroup.path"
                  @update:modelValue="(file) => adjuntarArchivo(file)"></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn block class="mb-8" color="primary" size="large" type="submit" @click="createNewGroup">
                  Crear nuevo grupo
                </v-btn>
              </v-col>
            </v-row>

            <!--       <UploadImage /> -->
          </v-form>
        </v-card-text>
      </v-card>
    </v-form>

  </v-container>
</template>



<script setup>

import { ref, onBeforeMount, computed } from 'vue'
import { useAppStore, useUsersStore, useLoginStore, useSnackbarStore } from '@/store/index';
import rules from '../../../support/rules/fieldRules'
import axios from "axios";
import UploadImage from '@/modules/common/components/UploadImage'
import { useRoute, useRouter } from "vue-router";
import veloxBtnReturn from '@/components/veloxBtnReturn.vue'
import veloxHeader from '@/components/veloxHeader.vue'

const appStore = useAppStore()
const userStore = useUsersStore()
const loginStore = useLoginStore()
const snackbarStore = useSnackbarStore();
const $router = useRouter();

const valid = ref(false)
let visible = ref(false)
const idGroup = computed(() => {
  loginStore.loggedUser.groupId = ($route.params.idGroup)
  return $route.params.idGroup
})

const file = ref();

const toUserPage = () => {
  $router.go(-1)
}

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
        //const { data } = res;
        snackbarStore.activateMessage('Grupo creado correctamente', 'primary', 2500)
        userStore.newGroup = {};
        toUserPage();
        //return data;

      } catch (error) {
        snackbarStore.activateMessage(Error, 'error', 2500)
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
const adjuntarArchivo = files => {
  if (!!files.length) file.value = files[0];
}


const subirArchivo = async (files) => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000';
  const config = {
    headers: {
      'X-Multipart-Size': file.value.size,
    },
  }
  let formData = new FormData();
  formData.append("file", file.value);


  try {
    const res = await axios.post(`${url}/groups/upload`, formData, config)
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

