<template>
  <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
    <v-card elevation="8" rounded="lg" color="secondary" v-if="!loadingStore.isLoading">
      <veloxHeader :path="currentGroup.path" :name="currentGroup.name" :description="currentGroup.description" />
      <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
        <v-card-text>
          <v-row class="mt-4 my-8 justify-space-between">
            <v-col>
              <v-row>
                <h2 class="text-primary text-h5 text-lg-h3 text-md-h4">Detalles de la denuncia</h2>
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
                <v-col cols="12" lg="5" class=" pa-4">

                  <v-card variant="outlined">
                    <v-card-item>
                      <v-card-title>
                        <p class="text-primary">Ordenanza municipal de circulación Infringida</p>
                      </v-card-title>
                    </v-card-item>
                    <v-divider/>
                    <v-card-item>
                      <p class="text-primary">Selección de la infracción cometida</p>
                      <v-text-field variant="underlined" density="compact"></v-text-field>
                      <p class="text-primary">Artículo inflingido</p>
                      <v-text-field variant="underlined" density="compact"></v-text-field>
                    </v-card-item>
                  </v-card>

                  <v-card variant="outlined" class="mt-2">
                    <v-card-item>
                      <v-card-title>
                        <p class="text-primary">Datos de la denuncia</p>
                      </v-card-title>
                    </v-card-item>
                    <v-divider/>
                    <v-card-item>

                      <p class="text-primary font-weight-bold mb-4">Ubicación: <span class="font-weight-regular">Posición GPS</span></p>

                      <p class="text-primary">Latitud / Longitud</p>
                      <v-text-field variant="underlined" density="compact"></v-text-field>


                      <p class="text-primary font-weight-bold mb-4">Fecha de la denuncia</p>
                      <p class="text-primary">Dia / Hora</p>
                      <v-text-field variant="underlined" density="compact"></v-text-field>

                      <p class="text-primary font-weight-bold mb-4">Agente denunciante</p>
                      <p class="text-primary">Num</p>
                      <v-text-field variant="underlined" density="compact"></v-text-field>
                    </v-card-item>
                  </v-card>

                  <v-card variant="outlined" class="mt-2">
                    <v-card-item>
                      <p class="text-primary">Velocidad detectada</p>
                      <v-text-field variant="underlined" density="compact"></v-text-field>
                    </v-card-item>
                  </v-card>

                  <v-card variant="outlined" class="mt-2">
                    <v-card-item>
                      <p class="text-primary">Etiqueta medioambiental detectada</p>
                      <v-text-field variant="underlined" density="compact"></v-text-field>
                    </v-card-item>
                  </v-card>
                </v-col>
                <v-col cols="12" lg="4" class=" pa-4">
                  <v-card variant="outlined">
                    <v-card-item>
                      <v-card-title>
                        <p class="text-primary">Datos del vehículo</p>
                      </v-card-title>
                    </v-card-item>
                    <v-divider/>
                    <v-card-item>

                      <p class="text-primary">Matrícula</p>
                      <v-text-field variant="underlined" density="compact"></v-text-field>
                      <p class="text-primary">Marca</p>
                      <v-text-field variant="underlined" density="compact"></v-text-field>
                      <p class="text-primary">Modelo</p>
                      <v-text-field variant="underlined" density="compact"></v-text-field>
                      <p class="text-primary">Color</p>
                      <v-text-field variant="underlined" density="compact"></v-text-field>

                    </v-card-item>
                  </v-card>

                  <v-card variant="outlined" class="mt-2">
                    <v-card-item>
                      <v-card-title>
                        <p class="text-primary">Datos del conductor</p>
                      </v-card-title>
                    </v-card-item>
                    <v-divider/>
                    <v-card-item>
                      <p class="text-primary">Nombre</p>
                      <v-text-field variant="underlined" density="compact"/>
                      <p class="text-primary">Apellidos</p>
                      <v-text-field variant="underlined" density="compact"/>
                      <p class="text-primary">DNI</p>
                      <v-text-field variant="underlined" density="compact"/>
                      <p class="text-primary">Dirección</p>
                      <v-textarea variant="underlined"/>
                    </v-card-item>

                  </v-card>

                </v-col>
                <v-col cols="12" lg="3" class=" pa-4">
                  <v-card variant="outlined">
                    <v-card-item>
                      <v-card-title>
                        <p class="text-primary">Imágenes del vehículo</p>
                      </v-card-title>
                    </v-card-item>
                    <v-divider></v-divider>
                  </v-card>
                </v-col>
              </v-row>


          </v-card>
        </v-card-text>
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
    title: 'Denuncias',
    disabled: false,
    exact: true,
    to: { name: 'Denuncias' },
  },
]

const isAdmin = computed(() => appStore.getIsAdmin);
const idDenuncia= computed(() => $route.params.idDenuncia)
const currentUser = computed(() => appStore.getCurrentUser);
const denuncia = ref()



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
  3: ['back_left.jpg', 'back_left.jpg'],
}
onBeforeMount(async () => {
  
  loadingStore.setLoading(true);

  if (!currentUser.value || !currentUser.value.id) {
    $router.push(`/${idGroup.value}/login`);
  }
  try {

    await checkIsAdmin()

    if (isAdmin.value) {
      await getDenunciaData()
    } else {
      $router.push(`/${idGroup.value}/login`);
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
    console.error(error);
    throw error;
  }
}


const getDenunciaData = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/denuncia/${idDenuncia.value}`)
    denuncia.value = res.data;
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

</script>


<style scoped>

.seccion{
  border-radius: 3px;
  border: solid 1px black;
}

</style>

