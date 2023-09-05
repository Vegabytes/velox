<template>
  <v-container class="pa-0">
    <v-card variant="flat" v-if="!loadingStore.isLoading">
      <veloxHeader :path="currentGroup.path" :name="currentGroup.name" :description="currentGroup.description" />
      <v-card-text>
        <v-row class="pa-5 d-flex justify-center align-center">
          <v-row class="py-6">
            <v-card-item>
              <v-card-title>
                <span class="text-h5 font-weight-bold">Mis subgrupos de dispositivos</span>
              </v-card-title>
              <v-card variant="flat" color="secondary">
                <v-card-actions v-if="isAdmin">
                  <v-btn variant="tonal" prepend-icon="mdi-plus" color="primary" @click="newGroup()">Nuevo
                    grupo
                  </v-btn>
                  <v-btn variant="tonal" prepend-icon="mdi-plus" color="primary" @click="toCreateUser()">Crear
                    Usuario</v-btn>
                  <v-btn variant="tonal" prepend-icon="mdi-link" color="primary" @click="toAsignUser()">Añadir Usuario a
                    grupo</v-btn>
                </v-card-actions>
              </v-card>
            </v-card-item>
          </v-row>
        </v-row>

        <v-divider></v-divider>

        <v-row>
          <v-col cols="12">
            <v-badge class="px-4, pt-4" v-if="isAdmin" color="primary" content="Administrador" inline></v-badge>
            <v-card class="mb-8" variant="flat">
              <v-card-text>
                <div v-for="item in userGroups">
                  <div class="d-flex flex-row align-center" style="cursor: pointer;" @click="goToGroupDetail(item)">
                    <div class="ma-2 pa-2">
                      <v-img v-if="item.path" :src="`${path}/${item.path}`" alt="GroupAvatar" height="100px" width="100px"
                        cover class="rounded-xl"></v-img>
                    </div>
                    <div class="ma-2 pa-2 d-flex flex-column">
                      <div class="d-flex flex-row align-center">
                        <p class="text-h5 ma-1">{{ item.name }}.</p>
                        <p class="text-h7 ma-1 font-italic font-weight-bold text-primary">{{ item.devices.length }}
                          dispositivos
                        </p>
                      </div>
                      <div class="d-flex flex-row mb-6 ">
                        <div>
                          <p class="text-h7 mx-1"> {{ item.description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { useAppStore, useLoadingStore, useLoginStore } from '@/store/index';
import veloxHeader from '@/components/veloxHeader.vue'

const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loadingStore = useLoadingStore();
const loginStore = useLoginStore()

const currentGroup = computed(() => appStore.currentGroup);
const userGroups = computed(() => appStore.userGroups);
const currentUser = computed(() => appStore.getCurrentUser);

const idGroup = computed(() => $route.params.idGroup)
const isAdmin = computed(() => appStore.getIsAdmin);

const path = ref(import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000');

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


    if (isAdmin.value) {
      await getUserGroups()
    } else {
      await getGroupData()
      goToGroupDetail(appStore.currentGroup)
    }


  } catch (error) {
    console.error(error);
  } finally {
    loadingStore.setLoading();
  }
});

const checkIsAdmin = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'
  try {
    const res = await axios.get(`${url}/user/admin/${idGroup.value}/${appStore.getCurrentUser.id}`)
    appStore.setIsAdmin(res.data.admin)
  } catch (error) {
    console.error(err);
    throw err;
  }
}

const getUserGroups = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'
  try {
    //const res = await axios.get(`${url}/groups/prueba/${idGroup.value}/${appStore.getCurrentUser.id}`)
    const res = await axios.get(`${url}/groups/${idGroup.value}/user/${appStore.getCurrentUser.id}`)
    appStore.userGroups = res.data;
  }
  catch (err) {
    console.error(err);
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

const newGroup = async () => {
  if (currentUser.value.id) {
    $router.push("NewGroup");
  } else {
    $router.push(`/${idGroup.value}/login`);
  }
}

const toCreateUser = async () => {
  if (loginStore.loggedUser.groupId) {
    $router.push(`/${idGroup.value}/CreateUser`);
  } else {
    $router.push(`/${idGroup.value}/login`);
  }
}

const toAsignUser = () => {
  $router.push(`/${idGroup.value}/asignUser`);
}

const goToGroupDetail = (item) => {
  $router.push(`/${idGroup.value}/groups/groupDetail/${item.id}`);
}



</script>
