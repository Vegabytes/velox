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
                  <v-img v-if="appStore.currentDevice" cover :src="appStore.currentDevice.path"></v-img>
                </v-avatar>
                <v-card-item>
                  <v-card-title class="text-h5 text-md-h4 font-weight-bold">{{ appStore.currentDevice.name
                  }}</v-card-title>
                  <v-card-subtitle>{{ appStore.currentDevice.description }}</v-card-subtitle>
                </v-card-item>
              </v-row>
            </v-col>
            <v-breadcrumbs :items="breadcrumbsItems" class="px-0">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-home"></v-icon>
              </template>
            </v-breadcrumbs>
          </v-row>

          <v-divider thickness="3" class="mb-4"></v-divider>

          <v-card class="mt-2" variant="flat">

            <v-row>

              <!--IMÁGENES-->
              <v-col cols="12" md="6" class="py-0">
                <v-row class="mt-2">
                  <v-col cols="1" class="d-flex justify-center align-center py-0">
                    <v-btn variant="text" icon="mdi-chevron-left"
                      @click="(contadorImg !== 0) ? contadorImg-- : null, handleZoom(contadorImg)"
                      :disabled="contadorImg === 0"></v-btn>
                  </v-col>
                  <v-col cols="9" class="d-flex flex-column justify-center align-center py-0">
                    <v-col class="px-0">
                      <v-col cols="12" class="d-flex justify-center align-center">
                        <br>
                        <v-img :src="`${url}/${appStore.currentLog.imagePath}/${imagenes[contadorImg][0]}`"
                          :id="`image-left-${contadorImg}`">
                          <template v-slot:placeholder>
                            <div class="d-flex align-center justify-center fill-height">
                              <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                            </div>
                          </template>
                        </v-img>
                      </v-col>
                      <v-col cols="12" class="d-flex justify-center align-center">
                        <v-img :src="`${url}/${appStore.currentLog.imagePath}/${imagenes[contadorImg][1]}`"
                          :id="`image-right-${contadorImg}`">
                          <template v-slot:placeholder>
                            <div class="d-flex align-center justify-center fill-height">
                              <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                            </div>
                          </template>
                        </v-img>
                      </v-col>
                    </v-col>
                  </v-col>
                  <v-col cols="1" class="d-flex justify-center align-center px-0">
                    <v-btn variant="text" icon="mdi-chevron-right"
                      @click="(contadorImg < 3) ? contadorImg++ : null, handleZoom(contadorImg)"
                      :disabled="contadorImg === 3"></v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <!--MAPA-->
              <v-col class="mt-5" cols="12" md="6">
                <ol-map :class="mobile ? 'height-mobile' : 'h-100'" class="mb-2" :loadTilesWhileAnimating="true"
                  :loadTilesWhileInteracting="true">
                  <ol-view ref="view" :center="appStore.currentLog.position.split(',').reverse()" :rotation="rotation"
                    :zoom="_zoom" :projection="projection" />
                  <ol-tile-layer>
                    <ol-source-osm />
                  </ol-tile-layer>
                  <ol-vector-layer>
                    <ol-source-vector>
                      <ol-feature>
                        <ol-geom-point :coordinates="appStore.currentLog.position.split(',').reverse()"></ol-geom-point>
                        <ol-style>
                          <ol-style-circle :radius="radius">
                            <ol-style-fill :color="fillColor"></ol-style-fill>
                            <ol-style-stroke :color="strokeColor" :width="strokeWidth"></ol-style-stroke>
                          </ol-style-circle>
                          <ol-style-text :text="appStore.currentLog.eventType">
                            <ol-style-fill color="white"></ol-style-fill>
                          </ol-style-text>
                        </ol-style>
                      </ol-feature>
                      <ol-feature>
                        <ol-geom-point :coordinates="appStore.currentLog.position.split(',').reverse()"></ol-geom-point>
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
            <v-row>

              <!--JSON-->
              <v-col cols="12" md="6" class="mt-6">
                <v-card variant="tonal" color="primary">
                  <v-card-item>
                    <v-card-title>
                      Metadata
                    </v-card-title>
                  </v-card-item>
                  <v-divider></v-divider>
                  <v-card-text>
                    <pre class="overflow-x-auto">{{ appStore.currentLog.metadata }}</pre>
                  </v-card-text>
                </v-card>
              </v-col>

              <!--FORMULARIO-->
              <v-col cols="12" md="6" class="mt-6">
                <v-card variant="tonal" color="primary">
                  <v-card-item>
                    <v-card-title>
                      Datos
                    </v-card-title>
                  </v-card-item>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-col>
                      <v-row class="mb-2">
                        <strong class="mr-4">Fecha hora infracción:</strong>
                        {{ formatDate(
                          new Date(Number(JSON.parse(appStore.currentLog.data).timestamp))
                        )
                        }}
                      </v-row>
                      <v-row class="mb-2">
                        <strong class="mr-4">Pos GPS: </strong>
                        {{ JSON.parse(appStore.currentLog.data).gps }}</v-row>
                      <v-row class="mb-2">
                        <strong class="mr-4">Velocidad de la vía: </strong>
                        {{ JSON.parse(appStore.currentLog.data).MaxVel }}</v-row>
                      <v-row class="mb-2">
                        <strong class="mr-4">Velocidad detectada:</strong>
                        {{ JSON.parse(appStore.currentLog.data).RealVel }}</v-row>
                      <v-row class="mb-2">
                        <strong class="mr-4">Matrícula infracción: </strong>
                        {{ JSON.parse(appStore.currentLog.data).plate }}</v-row>
                      <v-row class="mb-2">
                        <strong class="mr-4">ID Agente: </strong>
                        {{ JSON.parse(appStore.currentLog.data).idUser }}
                      </v-row>
                      <v-row>
                        <strong class="mr-4">Observaciones: </strong>
                        {{ JSON.parse(appStore.currentLog.data).observation }}
                      </v-row>
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-col>

            </v-row>


          </v-card>
        </v-card-text>

        <!-- Diálogo visualizar foto-->
        <v-dialog v-model="dialogoAbierto">


          <v-card>
            <div class="close-button-container">
              <v-btn icon="mdi-close" color="secondary" @click="dialogoAbierto = false"></v-btn>
            </div>
            <v-img :src="`${imagenSelected}`" />
          </v-card>
        </v-dialog>

      </v-container>
    </v-card>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { computed, ref } from 'vue';
import { onBeforeMount, onMounted, onActivated } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { useAppStore, useLoadingStore } from '@/store/index';
import veloxHeader from '@/components/veloxHeader.vue'
import { formatDate } from '@/support/helpers/general';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay()
const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loadingStore = useLoadingStore();
const idGroup = computed(() => $route.params.idGroup)
const idLog = computed(() => $route.params.idLog)
const idDevice = computed(() => $route.params.idDevice)
const currentGroup = computed(() => appStore.currentGroup);
/* const url = ref(import.meta.env['VITE_SERVER_BASE_URL']); */
const url = ref('http://185.166.213.42/velocikaptor');
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
    disabled: false,
    to: { name: 'Logs' },
  },
  {
    title: 'Denuncias',
    disabled: true,
    href: 'breadcrumbs_link_1',
  },
]



// ********** mapa ***************
const projection = ref("EPSG:4326");
const _zoom = ref(18);
const rotation = ref(0);
const radius = ref(10);
const strokeWidth = ref(4);
const strokeColor = ref("blue");
const fillColor = ref("blue");
// ************************************************


// ********** Carrousel / visualizador de imágenes
let dialogoAbierto = ref(false)
let contadorImg = ref(0)
const imagenes = {
  0: ['front_left.jpg', 'front_right.jpg'],
  1: ['v1_left.jpg', 'v1_right.jpg'],
  2: ['v2_left.jpg', 'v2_right.jpg'],
  3: ['back_left.jpg', 'back_right.jpg'],
}
let imagenSelected = ref('')
// ************************************************
setTimeout(() => {
  $('#image-left-0').css('cursor', 'zoom-in').zoom();
  $('#image-right-0').css('cursor', 'zoom-in').zoom();

}, 1500);

const handleZoom = (img) => {
  setTimeout(() => {
    $(`#image-left-${img}`).css('cursor', 'zoom-in').zoom();
    $(`#image-right-${img}`).css('cursor', 'zoom-in').zoom();
  }, 500);
}

onBeforeMount(async () => {
  loadingStore.setLoading(true);
  if (!appStore.getCurrentUser || !appStore.getCurrentUser.name) {
    $router.push(`/${idGroup.value}/login`);
  }
  try {

    if (!appStore.currentGroup || !appStore.currentGroup.id) {
      await getGroupData();
    }

    await getLogData();
    await getDeviceData();

  } catch (error) {
    console.error(error);
  } finally {
    loadingStore.setLoading();
  }
});

const getLogData = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/log/${idLog.value}`)
    appStore.currentLog = res.data[0];
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

const getDeviceData = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/device/${idDevice.value}`)
    appStore.currentDevice = res.data[0];
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

/* const openDialog = (imgPath) => {
  imagenSelected.value = imgPath
  dialogoAbierto.value = true
} */

</script>


<style scoped>
.close-button-container {
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 1;
}

.zoom {
  display: inline-block;
  position: relative;
}

.zoom img {
  display: block;
  width: 500px;
  height: 500px;
}

.v-responsive.v-img {
  border-radius: 6px;
  border: 1px solid transparent;
}

.ol-viewport {
  border-radius: 6px;
  border: 1px solid transparent;
}

.height-mobile {
  height: 30rem;
}
</style>

