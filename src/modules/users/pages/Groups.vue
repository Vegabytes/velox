<template>
  <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
    <v-card v-if="!loadingStore.isLoading" elevation="8" rounded="lg" color="secondary">
      <veloxHeader :path="currentGroup.path" :name="currentGroup.name" :description="currentGroup.description" />
      <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
        <v-card-text>

          <v-row class="mt-2">
            <v-col>
              <span class="text-h5 text-md-h4 font-weight-bold">Mis subgrupos de dispositivos</span>
            </v-col>
            <v-breadcrumbs :items="items" class="px-0">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-home"></v-icon>
              </template>
            </v-breadcrumbs>
          </v-row>

          <v-card variant="flat" color="secondary">
            <v-row>
              <v-col cols="12" md="12" lg="6">
                <v-card-actions v-if="isAdmin">

                  <v-menu location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        variant="tonal" color="primary"
                        prepend-icon="mdi-menu"
                        v-bind="props"
                      >
                        Opciones
                      </v-btn>
                    </template>

                    <v-list>

                      <v-list-item>
                        <v-btn variant="tonal" color="primary" size="x-small" prepend-icon="mdi-account-multiple-plus"
                          @click="newGroup()">Crear nuevo grupo
                        </v-btn>
                      </v-list-item>

                      <v-list-item>
                        <v-btn variant="tonal" color="primary" size="x-small" @click="toCreateUser()" prepend-icon="mdi-account-plus"
                        class="">Crear nuevo usuario</v-btn>
                      </v-list-item>

                      <v-list-item>
                        <v-btn variant="tonal" color="primary" size="x-small" @click="toAsignUser()"
                          prepend-icon="mdi-link-box-outline">Asignar usuario a grupo de usuarios</v-btn>
                      </v-list-item>

                      <v-list-item>
                        <v-btn variant="tonal" color="primary" size="x-small" @click="toAssociateDeviceGroup()"
                        prepend-icon="mdi-devices">Asociar Dispositivos a grupo de usuarios</v-btn>
                      </v-list-item>
                        
                    </v-list>
                  </v-menu>

                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>


          <v-divider thickness="3" class="mb-4"></v-divider>

          <v-row>
            <v-col cols="12">
              <v-badge class="pt-4" v-if="isAdmin" color="primary" content="Administrador" inline></v-badge>
              <v-card class="mb-8" variant="flat">
                <v-card-text class="pa-0 mt-4">
                  <h2 v-if="userGroups.length === 0" class="text-primary text-h5">El grupo actual no tiene subgrupos
                    asignados</h2>
                  <div v-for="item in userGroups">
                    <div class="d-flex flex-row align-center" style="cursor: pointer;" @click="goToGroupDetail(item)">
                      <div class="py-5">
                        <v-img v-if="item.path" :src="`${path}/${item.path}`" alt="GroupAvatar" height="100px"
                          width="100px" cover class="rounded-xl"></v-img>
                      </div>
                      <div class="ma-2 pa-2 d-flex flex-column">
                        <v-row class="flex-lg-row flex-column px-4">
                          <p class="text-h5 text-md-h4 font-weight-regular">
                            {{ item.name }}.
                            <span class="text-body-1 text-md-h5 ma-1 font-italic font-weight-bold text-primary">{{
                              item.devices.length }}
                              dispositivos
                            </span>
                          </p>
                        </v-row>
                        <v-row class="flex-lg-row flex-column px-4">
                          <div>
                            <p class="text-body-1 text-md-h5 mx-1 text-grey"> {{ item.description }}</p>
                          </div>
                        </v-row>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { useAppStore, useLoadingStore } from '@/store/index';
import veloxHeader from '@/components/veloxHeader.vue'
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay()
const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loadingStore = useLoadingStore();

const currentGroup = computed(() => appStore.currentGroup);
const userGroups = computed(() => appStore.userGroups);
const currentUser = computed(() => appStore.getCurrentUser);

const idGroup = computed(() => $route.params.idGroup)
const isAdmin = computed(() => appStore.getIsAdmin);

const path = ref(import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000');

const items = [
  {
    title: 'Inicio',
    disabled: true,
    href: 'breadcrumbs_dashboard',
  }
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
  if (currentUser.value.id) {
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

const toAssociateDeviceGroup= () => {
  $router.push(`/${idGroup.value}/associateDeviceGroup`);
}

</script>
