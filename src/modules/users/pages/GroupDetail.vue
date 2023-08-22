<template>
  <v-container>
    <v-card variant="flat" v-if="!loadingStore.isLoading">
      <v-img :src="currentGroup.path" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="150px" cover>
        <v-card-title class="text-white text-h2" v-text="currentGroup.name"></v-card-title>
        <v-card-subtitle class="text-white text-h5 mb-4" v-text="currentGroup.description"></v-card-subtitle>
      </v-img>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card class="mb-8" variant="flat">
              <v-card-title>
                <v-row class="py-2">
                  <v-col cols="12">
                    <p class="text-h5 font-weight-bold">{{ userGroupsCurrent[0].name }}</p>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div v-for="item in listDevicesByUser">
                  <div class="d-flex flex-row align-center" style="cursor: pointer;" @click="goToLogsDevice(item)">
                    <div class="ma-2 pa-2">
                      <v-img v-if="item.path" :src="item.path" alt="GroupAvatar" height="100px" width="100px" cover
                        class="rounded-xl"></v-img>
                    </div>
                    <div class="ma-2 pa-2 d-flex flex-column">
                      <div class="d-flex flex-row align-center">
                        <p class="text-h5 ma-1">{{ item.name }}.</p>
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
import { computed } from 'vue';
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from "vue-router";

import { useAppStore, useLoadingStore } from '@/store/index';

const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loadingStore = useLoadingStore();

const currentGroup = computed(() => appStore.currentGroup);
const userGroups = computed(() => appStore.userGroups);
const userGroupsCurrent = computed(() => userGroups.value.filter(({ id }) => id == idViewGroup.value))
const listDevicesByUser = computed(() => !!userGroupsCurrent.value.length ? userGroupsCurrent.value[0].devices : []);

const idGroup = computed(() => $route.params.idGroup)
const idViewGroup = computed(() => $route.params.id)


onBeforeMount(async () => {
  loadingStore.setLoading(true);
  if (!appStore.getCurrentUser || !appStore.getCurrentUser.name) {
    $router.push(`/${idGroup.value}/login`);
  }
  try {

    if (!appStore.currentGroup || !appStore.currentGroup.id) {
      await getGroupData();
    }
    await getUserGroups()
  } catch (error) {
    console.error(error);
  } finally {
    loadingStore.setLoading();
  }
});


const getUserGroups = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
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


const goToLogsDevice = (item) => {
  $router.push(`/${idGroup.value}/groups/groupDetail/${idViewGroup.value}/logs/${item.id}`);
}
</script>