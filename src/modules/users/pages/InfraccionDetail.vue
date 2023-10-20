<template>
  <br>
  <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
    <v-form @submit.prevent ref="formInfraction">
      <v-card elevation="8" rounded="lg" color="secondary" v-if="!loadingStore.isLoading">
        <veloxHeader :path="currentGroup.path" :name="currentGroup.name" :description="currentGroup.description" />
        <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">


          <v-row class="mt-4 my-8 justify-space-between">
            <v-col>
              <h2 class="text-primary text-h5 text-lg-h3 text-md-h4">Detalles de la infracción</h2>
              <h2 v-if="!loadingStore.isLoading && (!infraccion || infraccion.length === 0)"
                class="text-primary text-h5 mt-4">Esta
                infracción no se encuentra disponible</h2>
            </v-col>
            <v-breadcrumbs :items="breadcrumbsItems" class="px-0">
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-home"></v-icon>
              </template>
            </v-breadcrumbs>
          </v-row>

          <v-divider thickness="3" class="mb-4"></v-divider>

          <v-card class="mt-2" variant="flat" v-if="!loadingStore.isLoading && infraccion && infraccion.length > 0">
            <v-row>
              <v-col cols="12" md="12" lg="6">
                <v-card-actions v-if="isAdmin">

                  <v-menu location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-btn variant="tonal" color="primary" prepend-icon="mdi-content-save" v-bind="props" type="submit"
                        @click="saveInfraction">
                        Guardar
                      </v-btn>
                      <v-btn variant="tonal" color="primary" prepend-icon="mdi-printer" @click="print">
                        Imprimir</v-btn>
                    </template>
                  </v-menu>
                </v-card-actions>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class=" pa-4">
                <v-card variant="outlined">
                  <v-card-item>
                    <p class="text-primary py-2 text-uppercase text-h5">Seguridad vial. Seguridad del control del
                      tráfico.</p>
                    <v-row class="justify-space-between">
                      <v-col cols="12" sm="5" class="items-center d-flex">
                        <p class="text-primary text-h6">Identificación del dispositivo de adquisición de datos:</p>
                      </v-col>
                      <v-col cols="12" sm="5" class="justify-sm-center d-flex">
                        <p class="text-primary text-h6">{{ deviceName }}</p>
                      </v-col>
                      <v-col cols="12" sm="2" class="justify-center items-center d-flex">
                        <v-img height="100px" width="100" cover class="rounded" :src="devicePath"></v-img>
                      </v-col>
                    </v-row>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="5" class=" pa-4">

                <v-card variant="outlined">
                  <v-card-item>
                    <v-card-title>
                      <p class="text-primary py-2">Ordenanza municipal de circulación Infringida</p>
                    </v-card-title>
                  </v-card-item>
                  <v-divider />
                  <v-card-item>
                    <p class="text-primary">Selección de la infracción cometida</p>
                    <v-text-field variant="underlined" density="compact"
                      v-model="infractionToEdit.infractionDesc"></v-text-field>
                    <p class="text-primary">Artículo inflingido</p>
                    <v-text-field variant="underlined" density="compact"
                      v-model="infractionToEdit.infractionArticle"></v-text-field>
                  </v-card-item>
                </v-card>
                <v-card variant="outlined" class="mt-2">
                  <v-card-item>
                    <v-card-title>
                      <p class="text-primary  py-2">Datos de la infracción</p>
                    </v-card-title>
                  </v-card-item>
                  <v-divider />
                  <v-card-item>

                    <p class="text-primary font-weight-bold mb-4">Ubicación:
                      <!--           <span class="font-weight-regular">Posición
                        GPS</span>-->
                    </p>

                    <p class="text-primary">Posición
                      GPS: Latitud / Longitud</p>
                    <v-text-field variant="underlined" density="compact" disabled
                      v-model="infractionToEdit.position"></v-text-field>

                    <p class="text-primary">Dirección</p>
                    <v-text-field variant="underlined" density="compact"
                      v-model="infractionToEdit.address"></v-text-field>


                    <p class="text-primary font-weight-bold mb-4">Fecha de la infracción</p>
                    <p class="text-primary font-weight-bold">Día / Hora</p>
                    <!--                       <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.dateLog">
                      </v-text-field> -->
                    <div class="mt-2 mb-8">
                      <Datepicker v-model="infractionToEdit.dateLog" locale="es" :format="format" :format-locale="es"
                        :teleport="true" cancelText="Cancelar" selectText="Aceptar" required />
                    </div>




                    <p class="text-primary font-weight-bold mb-4">Agente denunciante</p>
                    <p class="text-primary font-weight-bold">Num</p>
                    <v-text-field v-if="infractionToEdit.metadata" variant="underlined" density="compact"
                      v-model="infractionToEdit.metadata.idUser" disabled></v-text-field>
                  </v-card-item>
                </v-card>

                <v-card variant="outlined" class="mt-2">
                  <v-card-item>
                    <p class="text-primary font-weight-bold">Velocidad permitida</p>
                    <v-text-field v-if="infractionToEdit.metadata" variant="underlined" density="compact"
                      v-model="infractionToEdit.metadata.MaxVel"></v-text-field>
                    <v-row>
                      <v-col cols="6">
                        <p class="text-primary font-weight-bold">Velocidad detectada</p>
                      </v-col>
                      <v-col cols="6">
                        <p class="text-red text-uppercase font-weight-bold">Sancionable</p>
                      </v-col>
                    </v-row>
                    <v-text-field v-if="infractionToEdit.metadata" variant="underlined" density="compact"
                      v-model="infractionToEdit.metadata.RealVel"></v-text-field>
                  </v-card-item>
                </v-card>

                <v-card variant="outlined" class="mt-2">
                  <v-card-item>
                    <p class="text-primary font-weight-bold">Etiqueta medioambiental permitida</p>
                    <v-text-field variant="underlined" density="compact"
                      v-model="infractionToEdit.emissionsZone"></v-text-field>

                    <v-row>
                      <v-col cols="6">
                        <p class="text-primary font-weight-bold">Etiqueta medioambiental detectada</p>
                      </v-col>
                      <v-col cols="6">
                        <p class="text-green text-uppercase font-weight-bold">Permitida</p>
                      </v-col>
                    </v-row>
                    <v-text-field variant="underlined" density="compact"
                      v-model="infractionToEdit.emissions"></v-text-field>
                  </v-card-item>
                </v-card>
              </v-col>
              <v-col cols="12" lg="4" class=" pa-4">
                <v-card variant="outlined">
                  <v-card-item>
                    <v-card-title>
                      <p class="text-primary  py-2">Datos del vehículo</p>
                    </v-card-title>
                  </v-card-item>
                  <v-divider />
                  <v-card-item>
                    <p class="text-primary font-weight-bold ">Vehículo</p>
                    <v-text-field variant="underlined" density="compact"
                      v-model="infractionToEdit.vehicle"></v-text-field>
                    <p class="text-primary font-weight-bold">Matrícula</p>
                    <v-text-field variant="underlined" density="compact">
                      {{ infractionToEdit.plate }} </v-text-field>
                    <p class="text-primary font-weight-bold">Marca</p>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.maker"></v-text-field>
                    <p class="text-primary font-weight-bold">Modelo</p>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.model"></v-text-field>
                    <p class="text-primary font-weight-bold">Color</p>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.color"></v-text-field>
                    <p class="text-primary font-weight-bold">Tipo de vehículo</p>
                    <v-text-field variant="underlined" density="compact"
                      v-model="infractionToEdit.vehicleType"></v-text-field>

                  </v-card-item>
                </v-card>

                <v-card variant="outlined" class="mt-2">
                  <v-card-item>
                    <v-card-title>
                      <p class="text-primary  py-2">Datos del conductor</p>
                    </v-card-title>
                  </v-card-item>
                  <v-divider />
                  <v-card-item>
                    <p class="text-primary font-weight-bold">Nombre</p>
                    <v-text-field variant="underlined" density="compact"
                      v-model="infractionToEdit.driverName"></v-text-field>
                    <p class="text-primary font-weight-bold">Apellidos</p>
                    <v-text-field variant="underlined" density="compact"
                      v-model="infractionToEdit.driverSurname"></v-text-field>
                    <p class="text-primary font-weight-bold">DNI</p>
                    <v-text-field variant="underlined" density="compact"
                      v-model="infractionToEdit.driverId"></v-text-field>
                    <p class="text-primary font-weight-bold">Dirección</p>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.driverAddress">

                    </v-text-field>
                    <p class="text-primary font-weight-bold">Código postal</p>
                    <v-text-field variant="underlined" density="compact"
                      v-model="infractionToEdit.driverCP"></v-text-field>
                  </v-card-item>

                </v-card>

              </v-col>
              <v-col cols="12" lg="3" class=" pa-4">
                <v-card variant="outlined">
                  <v-card-title>
                    <p class="text-primary  py-2">Imágenes del vehículo</p>
                  </v-card-title>
                  <v-card-item class="justify-center">

                    <v-img :width="300" aspect-ratio="16/9" cover class="rounded"
                      :src="`${url}/${infractionToEdit.imagePath}/${imagenes[0]}`"></v-img>
                  </v-card-item>
                  <v-card-item class="justify-center">

                    <v-img :width="300" aspect-ratio="16/9" cover class="rounded"
                      :src="`${url}/${infractionToEdit.imagePath}/${imagenes[1]}`"></v-img>
                  </v-card-item>
                  <v-card-item class="justify-center">

                    <v-img :width="300" aspect-ratio="16/9" cover class="rounded"
                      :src="`${url}/${infractionToEdit.imagePath}/${imagenes[2]}`"></v-img>
                  </v-card-item>
                  <v-divider></v-divider>
                </v-card>
              </v-col>
            </v-row>

          </v-card>

        </v-container>

      </v-card>

    </v-form>
  </v-container>
  <v-snackbar v-model="snackbarStore.activate" :color="snackbarStore.color" :location="snackbarStore.location"
    :timeout="snackbarStore.timeout">
    <div class="text-subtitle-1 pb-2"> {{ snackbarStore.text }}</div>
  </v-snackbar>
</template>

<script setup>
import axios from "axios";
import { computed, ref } from 'vue';
import { onBeforeMount, onMounted, onActivated } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { useAppStore, useLoadingStore, useSnackbarStore } from '@/store/index';
import veloxHeader from '@/components/veloxHeader.vue'
import { formatDate } from '@/support/helpers/general';
import { useDisplay } from 'vuetify';
import { es } from 'date-fns/locale';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const { mobile } = useDisplay()
const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loadingStore = useLoadingStore();
const snackbarStore = useSnackbarStore();
const idGroup = computed(() => $route.params.idGroup)
const currentGroup = computed(() => appStore.currentGroup);
const breadcrumbsItems = [
  {
    title: 'Inicio',
    disabled: false,
    to: { name: 'Groups' },
  },
  {
    title: 'Infracciones',
    disabled: false,
    exact: true,
    to: { name: 'Infracciones' },
  },
]

const isAdmin = computed(() => appStore.getIsAdmin);
const idInfraccion = computed(() => $route.params.idInfraccion)
const currentUser = computed(() => appStore.getCurrentUser);
const infraccion = ref([])
const url = ref('http://185.166.213.42/velocikaptor');


const infractionToEdit = ref({});
const deviceName = ref();
const devicePath = ref();

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


const imagenes = [
  'front_right.jpg', 'v1_right.jpg', 'back_right.jpg'
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
      await getInfraccionData()
    } else {
      $router.push(`/${idGroup.value}/login`);
    }


  } catch (error) {
    console.error(error);
  } finally {
    loadingStore.setLoading(false);
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


const getInfraccionData = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/infraccion/${idInfraccion.value}`)
    infraccion.value = res.data;
    infractionToEdit.value = { ...infraccion.value[0] };
    getDevice(infractionToEdit.value.metadata.idDevice);
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

const getDevice = async (id) => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/device/${id}`)
    deviceName.value = `${res.data[0].description} - ${res.data[0].name}`;
    devicePath.value = res.data[0].path;
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

const saveInfraction = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'
  try {
    const res = await axios.post(`${url}/infraccion/${idInfraccion.value}`, { payload: infractionToEdit.value })
    snackbarStore.activateMessage(res.data, 'success', 2500)
    await getInfraccionData();
  }
  catch (err) {
    console.error(err);
    snackbarStore.activateMessage(error, 'error', 2500)
    throw err;
  }
}

const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
const print = () => {
  window.print();
}

</script>


<style scoped>
.seccion {
  border-radius: 3px;
  border: solid 1px black;
}
</style>

