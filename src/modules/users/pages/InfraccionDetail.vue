<template>
  <br>
  <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'" class="printable-padding d-print-table-cell">
    <v-form @submit.prevent ref="formInfraction">
      <v-card id="printable" elevation="8" rounded="lg" color="secondary" v-if="!loadingStore.isLoading">
        <veloxHeader class="no-printable" :path="currentGroup.path" :name="currentGroup.name"
          :description="currentGroup.description" />
        <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'" class="printable-padding-horizontal">


          <v-row class="mt-4 my-8 justify-space-between no-printable">
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

          <v-divider thickness="3" class="mb-4 no-printable"></v-divider>

          <v-card variant="flat" v-if="!loadingStore.isLoading && infraccion && infraccion.length > 0">
            <v-row class="no-printable">
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
              <v-col cols="12" class="printable-padding pa-4">
                <v-card variant="outlined">
                  <v-card-item>
                    <p class="printable-title text-primary text-uppercase text-h5">Seguridad vial. Seguridad del
                      control del
                      tráfico.</p>
                    <v-row class="justify-space-between">
                      <v-col cols="12" sm="6" class="items-center d-flex">
                        <p class="printable-subtitle text-primary text-h6">Identificación del dispositivo de adquisición
                          de datos:</p>
                      </v-col>
                      <v-col cols="12" sm="5" class="justify-sm-center d-flex">
                        <p class="printable-subtitle text-primary text-h6">{{ deviceName }}</p>
                      </v-col>
                      <v-col cols="12" sm="1" class="justify-center items-center d-flex printable-image">
                        <v-img height="100px" width="100" cover class="rounded" :src="devicePath"></v-img>
                      </v-col>
                    </v-row>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="5" class="pa-4 printable-column">

                <v-card variant="outlined">
                  <v-card-item>
                    <v-card-title>
                      <p class="text-primary">Ordenanza municipal de circulación Infringida</p>
                    </v-card-title>
                  </v-card-item>
                  <v-divider class="mb-4 no-printable" />
                  <v-card-title>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.infractionDesc"
                      label="Selección de la infracción cometida"></v-text-field>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.infractionArticle"
                      label="Artículo inflingido"></v-text-field>
                    <v-select variant="underlined" label="Estado" v-model="infractionToEdit.status"
                      :items="['Pendiente', 'Tramitándose', 'Enviada', 'Finalizada', 'Errónea']"></v-select>
                  </v-card-title>
                </v-card>
                <v-card variant="outlined" class="mt-2">
                  <v-card-item>
                    <v-card-title>
                      <p class="text-primary ">Datos de la infracción</p>
                    </v-card-title>
                  </v-card-item>
                  <v-divider class="mb-4 no-printable" />
                  <v-card-title>
                    <v-text-field variant="underlined" density="compact" disabled v-model="infractionToEdit.position"
                      label="Posición
                     GPS: Latitud / Longitud"></v-text-field>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.address"
                      label="Dirección infracción"></v-text-field>


                    <p class="text-primary font-weight-bold mb-4 text-subtitle-1">Fecha de la infracción</p>

                    <div class="mt-2 mb-8">
                      <Datepicker v-model="infractionToEdit.dateLog" locale="es" :format="format" :format-locale="es"
                        :teleport="true" cancelText="Cancelar" selectText="Aceptar" required placeholder="Día / Hora" />
                    </div>

                    <v-text-field v-if="infractionToEdit.metadata" variant="underlined" density="compact"
                      v-model="infractionToEdit.metadata.idUser" disabled label="Agente denunciante"></v-text-field>
                  </v-card-title>
                </v-card>

                <v-card variant="outlined" class="mt-2 py-4">
                  <v-card-title>
                    <v-text-field v-if="infractionToEdit.metadata" variant="underlined" density="compact"
                      v-model="infractionToEdit.metadata.MaxVel" label="Velocidad permitida"></v-text-field>
                    <v-text-field v-if="infractionToEdit.metadata" variant="underlined" density="compact"
                      v-model="infractionToEdit.metadata.RealVel" label="Velocidad detectada"></v-text-field>
                  </v-card-title>
                </v-card>

                <v-card variant="outlined" class="py-4">
                  <v-card-title>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.emissionsZone"
                      label="Etiqueta medioambiental permitida"></v-text-field>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.emissions"
                      label="Etiqueta medioambiental detectada"></v-text-field>
                  </v-card-title>
                </v-card>
              </v-col>
              <v-col cols="12" lg="4" class="pa-4 printable-column">
                <v-card variant="outlined">
                  <v-card-item>
                    <v-card-title>
                      <p class="text-primary ">Datos del vehículo</p>
                    </v-card-title>
                  </v-card-item>
                  <v-divider class="mb-4 no-printable" />
                  <v-card-title>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.vehicle"
                      label="Vehículo"></v-text-field>
                    <v-text-field variant="underlined" density="compact" label="Matrícula">
                      {{ infractionToEdit.plate }} </v-text-field>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.maker"
                      label="Marca"></v-text-field>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.model"
                      label="Modelo"></v-text-field>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.color"
                      label="Color"></v-text-field>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.vehicleType"
                      label="Tipo de vehículo"></v-text-field>

                  </v-card-title>
                </v-card>

                <v-card variant="outlined" class="mt-2">
                  <v-card-item>
                    <v-card-title>
                      <p class="text-primary ">Datos del conductor</p>
                    </v-card-title>
                  </v-card-item>
                  <v-divider class="mb-4 no-printable" />
                  <v-card-title>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.driverName"
                      label="Nombre"></v-text-field>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.driverSurname"
                      label="Apellidos"></v-text-field>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.driverId"
                      label="DNI"></v-text-field>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.driverAddress"
                      label="Dirección">
                    </v-text-field>
                    <v-text-field variant="underlined" density="compact" v-model="infractionToEdit.driverCP"
                      label="Código postal"></v-text-field>
                  </v-card-title>

                </v-card>

              </v-col>
              <v-col cols="12" lg="3" class=" pa-4 printable-column">
                <v-card variant="outlined">
                  <v-card-title>
                    <p class="text-primary ">Imágenes del vehículo</p>
                  </v-card-title>
                  <v-divider class="mb-4 no-printable" />
                  <v-card-item class="justify-center">

                    <v-img :width="300" aspect-ratio="16/9" cover class="rounded printable-images-infraction"
                      :src="`${url}/${infractionToEdit.imagePath}/${imagenes[0]}`"></v-img>
                  </v-card-item>
                  <v-card-item class="justify-center">

                    <v-img :width="300" aspect-ratio="16/9" cover class="rounded printable-images-infraction"
                      :src="`${url}/${infractionToEdit.imagePath}/${imagenes[1]}`"></v-img>
                  </v-card-item>
                  <v-card-item class="justify-center">

                    <v-img :width="300" aspect-ratio="16/9" cover class="rounded printable-images-infraction"
                      v-if="imagenExiste(`${url}/${infractionToEdit.imagePath}/${imagenes[2]}`)"
                      :src="`${url}/${infractionToEdit.imagePath}/${imagenes[2]}`"></v-img>

                    <v-img :width="300" aspect-ratio="16/9" cover class="rounded printable-images-infraction"
                      v-if="!imagenExiste(`${url}/${infractionToEdit.imagePath}/${imagenes[2]}`)"
                      :src="`${url}/${infractionToEdit.imagePath}/${imagenes[3]}`"></v-img>

                  </v-card-item>
                  <v-divider class="mb-4 no-printable" />
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
  'front_right.jpg', 'v1_right.jpg', 'back_right.jpg.crop.jpg', 'back_right.jpg'
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

const imagenExiste = (imagen) => {
  const img = new Image();
  img.src = imagen;
  return img.complete;
}

</script>


<style>
.seccion {
  border-radius: 3px;
  border: solid 1px black;
}

@media print {

  @page {

    /*     size: A4 landscape; */
    /*     page-break-before: avoid; */
    margin: 0 !important;
    /*     page-orientation: rotate-left; */

  }

  #printable {
    /*     max-width: 100vw;
    max-height: 100vh; */
    box-shadow: none !important;
  }

  .printable-title {
    font-size: 1.1rem !important;
  }

  .printable-subtitle {
    font-size: 0.9rem !important;
  }

  .no-printable {
    display: none !important;
  }

  .v-divider {
    display: none !important;
  }

  div.printable-padding {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    padding-left: 10px !important;
    padding-right: 9px !important;
  }

  div.printable-padding-horizontal {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    padding-left: 0px !important;
    padding-right: 0px !important;

  }

  .printable-image {
    display: none !important;
  }

  div.v-card-title {
    font-size: 0.7rem !important;
  }


  .v-input--has-state .v-text-field__details {
    border-bottom: none !important;
  }

  .v-label {
    font-size: 10px !important;
  }

  .printable-column {
    flex-basis: 33%;
  }

  .printable-images-infraction {
    height: 160px;
    width: 300px;
  }

  div.v-input__details {
    height: 5px;
  }

  div.v-text-field .v-field--active input {
    font-size: 10px !important;
  }

  div.v-text-field input.v-field__input {
    padding-top: 4px;
  }

  div.v-card-item,
  div.v-card-title,
  .v-field__input {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
  }

  .v-input__details {
    display: none !important;

  }

  div.v-card .v-card-title {
    line-height: 1rem !important;
  }

  .v-input {
    line-height: 1rem !important;
  }

  .v-select .v-select__selection-text {
    font-size: 10px !important;
  }

  div.v-card--variant-outlined {
    border: none !important;
    border-width: 0 !important;
  }

  .text-subtitle-1 {
    font-size: 0.7rem !important;
    margin-bottom: 0 !important;
  }

  .v-field__outline {
    --v-field-border-width: 0px !important;
  }

  .dp__input_icon_pad {
    font-size: 10px !important;
  }

}
</style>

