<template>
  <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
    <v-card elevation="8" rounded="lg" color="secondary" v-if="!loadingStore.isLoading">
      <veloxHeader :path="currentGroup.path" :name="currentGroup.name" :description="currentGroup.description" />
      <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
        <v-card-text>
          <v-row class="mt-2">
            <v-col>

              <v-row>
                <v-avatar class="ma-3" size="x-large">
                  <v-img cover :src="currentDevice.path"></v-img>
                </v-avatar>
                <v-card-item>
                  <v-card-title class="text-h5 text-md-h4 font-weight-bold">{{
                    currentDevice.name }}</v-card-title>
                  <v-card-subtitle class="">{{ currentDevice.description }}</v-card-subtitle>
                </v-card-item>
              </v-row>
            </v-col>
            <v-breadcrumbs :items="breadcrumbsItems">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-home"></v-icon>
              </template>
            </v-breadcrumbs>
          </v-row>

          <v-divider thickness="3" class="mb-4"></v-divider>

          <v-row class="mt-3" v-if="currentDeviceLogs.length > 0">
            <v-col cols="12" md="6">
              <v-data-table v-model:page="page" :headers="headers" height="340" :items="currentDeviceLogs" hover
                :items-per-page="itemsPerPage" hide-default-footer class="elevation-1">
                <template v-slot:item="{ item }">
                  <tr @click="toLogDetail(item.id)" style="cursor:pointer">
                    <td>{{ item.id }}</td>
                    <td>{{ item.timestamp }}</td>
                  </tr>
                </template>
                <template v-slot:bottom>
                  <div class="text-center">
                    <v-pagination v-model="page" :length="pageCount"></v-pagination>
                  </div>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12" md="6">
              <ol-map style="height: 400px;" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true">
                <ol-view ref="view" v-if="currentDeviceLogs.length > 0"
                  :center="currentDeviceLogs[0].position.split(',').reverse()" :rotation="rotation" :zoom="zoom"
                  :projection="projection" />

                <ol-tile-layer>
                  <ol-source-osm />
                </ol-tile-layer>

                <ol-vector-layer>
                  <ol-source-vector>
                    <ol-feature v-if="currentDeviceLogs.length > 0" v-for="item in currentDeviceLogs">
                      <ol-geom-point :coordinates="item.position.split(',').reverse()"></ol-geom-point>
                      <ol-style>
                        <ol-style-circle :radius="radius">
                          <ol-style-fill :color="fillColor"></ol-style-fill>
                          <ol-style-stroke :color="strokeColor" :width="strokeWidth"></ol-style-stroke>
                        </ol-style-circle>
                        <ol-style-text :text="item.eventType">
                          <ol-style-fill color="white"></ol-style-fill>
                        </ol-style-text>
                      </ol-style>
                    </ol-feature>


                    <ol-feature v-for="item in currentDeviceLogs">
                      <ol-geom-point :coordinates="[item.position]"></ol-geom-point>
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


            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { computed, ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { VDataTable } from 'vuetify/labs/VDataTable'
import { useAppStore, useLoadingStore } from '@/store/index';
import veloxHeader from '@/components/veloxHeader.vue'
import { formatDate } from '@/support/helpers/general'
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay()
const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loadingStore = useLoadingStore();
const idGroup = computed(() => $route.params.idGroup)
const idViewGroup = computed(() => $route.params.id)
const idCurrentDevice = computed(() => $route.params.idDevice)
const currentGroup = computed(() => appStore.currentGroup);
const currentDevice = ref()
const currentDeviceLogs = ref([]);

const page = ref(1);
const itemsPerPage = ref(5);
const pageCount = computed(() => {
  return Math.ceil(currentDeviceLogs.value.length / itemsPerPage.value)
});

const headers = [
  { title: 'Id', align: 'start', key: 'id', },
  { title: 'Log', align: 'start', key: 'timestamp' }
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
    await getDeviceData()
    await getLogsByDevice()

    if (!appStore.currentGroup || !appStore.currentGroup.id) {
      await getGroupData();
    }
  } catch (error) {
    console.error(error);
  } finally {
    loadingStore.setLoading(false);
  }
});

const breadcrumbsItems = [
  {
    title: 'Inicio',
    disabled: false,
    to: { name: 'Groups' },
  },
  {
    title: 'Listado de dispositivos',
    disabled: false,
    exact: true,
    to: { name: 'GroupDetail' },
  },
  {
    title: 'Detalles del dispositivo',
    disabled: true,
    href: 'breadcrumbs_link_1',
  },
]

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

const getLogsByDevice = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/logs/device/${idCurrentDevice.value}`)
    let a = res.data
    currentDeviceLogs.value = a
    let dataFormatted = []
    res.data.forEach((e) => {
      console.log("e", e);
      //e.timestamp = formatDate(Number(JSON.parse(e.data).timestamp))
      e.timestamp = formatDate(e.eventTimeStamp)
      dataFormatted.push(e)
    });
    currentDeviceLogs.value = dataFormatted;


  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

const getDeviceData = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'
  try {
    const res = await axios.get(`${url}/device/${idCurrentDevice.value}`)
    appStore.currentDevice = res.data[0];
    currentDevice.value = res.data[0]
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

const toLogDetail = (id) => {
  $router.push(`/${idGroup.value}/groups/groupDetail/${idViewGroup.value}/logs/${currentDevice.value.id}/log/${id}`);
}

</script>


<style>
.v-table {
  border-radius: 6px;
}

.ol-viewport {
  border-radius: 6px;
  border: 1px solid transparent;

}
</style>
