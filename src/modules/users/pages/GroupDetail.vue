<template>
  <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
    <v-card elevation="8" rounded="lg" color="secondary" v-if="!loadingStore.isLoading">
      <veloxHeader :path="currentGroup.path" :name="currentGroup.name" :description="currentGroup.description" />
      <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
        <v-card-text>
          <v-row class="mt-2">
            <v-col>
              <span class="text-h5 text-md-h4 font-weight-bold">{{ userGroupsCurrent[0].name }}</span>
            </v-col>
            <v-breadcrumbs :items="breadcrumbsItems" class="px-0">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-home"></v-icon>
              </template>
            </v-breadcrumbs>
          </v-row>
          <v-divider thickness="3" class="mb-4"></v-divider>

          <v-row>
            <v-col cols="12">
              <v-badge class="px-4 pt-4" v-if="isAdmin" color="primary" content="Administrador" inline></v-badge>

              <v-card class="mb-8" variant="flat">
                <v-card-text class="pa-0 mt-4">

                  <h2 v-if="listDevicesByUser.length === 0" class="text-primary text-h5">No hay dispositivos asignados al
                    grupo</h2>
                  <div v-if="listDevicesByUser.length > 0" v-for="item in listDevicesByUser">
                    <div class="d-flex flex-row align-center" style="cursor: pointer;" @click="goToLogsDevice(item)">
                      <div class="py-5">
                        <v-img v-if="item.path" :src="item.path" alt="GroupAvatar" height="100px" width="100px" cover
                          class="rounded-xl"></v-img>
                      </div>
                      <div class="ma-2 pa-2 d-flex flex-column">
                        <v-row class="flex-lg-row flex-column px-4">
                          <p class="text-h5 text-md-h4 font-weight-regular">
                            {{ item.name }}

                          </p>
                        </v-row>
                        <v-row class="flex-lg-row flex-column px-4">
                          <div>
                            <p class="text-body-1 text-md-h5 mx-1 text-grey"> {{ item.description }}</p>
                          </div>
                        </v-row>



                      </div>
                    </div>
                    <v-row class="flex-lg-row flex-column px-4 mb-4">
                      <div>
                        <v-btn class="justify-end pl-0 text-grey" variant="" append-icon="mdi-eye"
                          @click="getLastPositionDevice(item)">
                          Última posición</v-btn>
                      </div>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
    </v-card>

    <!-- Diálogo última posición-->
    <v-dialog v-model="dialogLastPosition">
      <v-card>
        <v-card-text class="pa-8">
          <ol-map style="height: 500px;" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true">
            <ol-view ref="view" :center="lastPosition.split(',').reverse()" :rotation="rotation" :zoom="zoom"
              :projection="projection" />

            <ol-tile-layer>
              <ol-source-osm />
            </ol-tile-layer>

            <ol-vector-layer>
              <ol-source-vector>

                <ol-feature>
                  <ol-geom-point :coordinates="lastPosition.split(',').reverse()"></ol-geom-point>
                  <ol-style>
                    <ol-style-circle :radius="radius">
                      <ol-style-fill :color="fillColor"></ol-style-fill>
                      <ol-style-stroke :color="strokeColor" :width="strokeWidth"></ol-style-stroke>
                    </ol-style-circle>
                    <ol-style-text :text="''">
                      <ol-style-fill color="white"></ol-style-fill>
                    </ol-style-text>
                  </ol-style>
                </ol-feature>

                <ol-feature>
                  <ol-geom-point :coordinates="[0, 0].reverse()"></ol-geom-point>
                  <ol-style>
                    <ol-style-circle :radius="radius">
                      <ol-style-fill :color="fillColor"></ol-style-fill>
                      <ol-style-stroke :color="strokeColor" :width="strokeWidth"></ol-style-stroke>
                    </ol-style-circle>
                  </ol-style>

                </ol-feature>
              </ol-source-vector>

            </ol-vector-layer>
          </ol-map>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="dialogLastPosition = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbarStore.activate" :color="snackbarStore.color" :location="snackbarStore.location"
      :timeout="snackbarStore.timeout">
      <div class="text-subtitle-1 pb-2"> {{ snackbarStore.text }}</div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { computed, ref } from 'vue';
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { useAppStore, useLoadingStore, useSnackbarStore } from '@/store/index';
import veloxHeader from '@/components/veloxHeader.vue'
import { useDisplay } from 'vuetify';
import { } from '@/store/index';


const { mobile } = useDisplay()
const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loadingStore = useLoadingStore();
const snackbarStore = useSnackbarStore();
const currentGroup = computed(() => appStore.currentGroup);
const userGroups = computed(() => appStore.userGroups);
const idGroup = computed(() => $route.params.idGroup)
const idViewGroup = computed(() => $route.params.id)
const isAdmin = computed(() => appStore.getIsAdmin);

const userGroupsCurrent = computed(() =>
  (userGroups.value.length > 1)
    ? userGroups.value.filter(({ id }) => id == idViewGroup.value)
    : [currentGroup.value]
)

const dialogLastPosition = ref(false)
const lastPosition = ref(null);

const listDevicesByUser = ref([])

const breadcrumbsItems = [
  {
    title: 'Inicio',
    disabled: false,
    to: { name: 'Groups' },
  },
  {
    title: 'Listado de dispositivos',
    disabled: true,
    href: 'breadcrumbs_link_1',
  },
]

const projection = ref("EPSG:4326");
const zoom = ref(10);
const rotation = ref(0);
const radius = ref(10);
const strokeWidth = ref(4);
const strokeColor = ref("blue");
const fillColor = ref("blue");


onBeforeMount(async () => {
  loadingStore.setLoading(true);
  if (!appStore.getCurrentUser || !appStore.getCurrentUser.name) {
    $router.push(`/${idGroup.value}/login`);
  }
  try {

    if (!appStore.currentGroup || !appStore.currentGroup.id) {
      await getGroupData();
    }
    await getDevicesGroups()
  } catch (error) {
    console.error(error);
  } finally {
    loadingStore.setLoading();
  }
});



const getLastPositionDevice = async ({ deviceId }) => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'
  try {
    const res = await axios.get(`${url}/device/${deviceId}/position`)
    lastPosition.value = res.data.position;
    if (lastPosition.value) {
      dialogLastPosition.value = true;
    } else {
      snackbarStore.activateMessage('Este dispositivo no tiene registrada su última posición', 'error', 2500)
    }
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}



const getDevicesGroups = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/devices/${userGroupsCurrent.value[0].id}`)
    listDevicesByUser.value = res.data;
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
