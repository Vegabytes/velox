<template>
  <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
    <v-card elevation="8" rounded="lg" color="secondary">
      <veloxHeader :path="appStore.currentGroup.path" :name="appStore.currentGroup.name"
        :description="appStore.currentGroup.description" />

      <v-card-text :class="mobile ? 'pa-4' : 'pa-12'">
        <v-row class="mt-4 my-8 justify-space-between">
          <v-col ols="12" lg="6">
            <h2 class="text-primary text-h5 text-lg-h3 text-md-h4">Infracciones</h2>
            <h2 v-if="!loadingStore.isLoading && infraccionesList.length === 0" class="text-primary text-h5">No hay
              infracciones asociadas al
              grupo</h2>
          </v-col>
          <v-breadcrumbs :items="breadcrumbsItems" class="px-0">
            <template v-slot:prepend>
              <v-icon size="small" icon="mdi-home"></v-icon>
            </template>
          </v-breadcrumbs>
        </v-row>
        <v-row>
          <v-col cols="12">

            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details />


          </v-col>
        </v-row>

        <v-row>
          <v-row v-if="infraccionesList.length > 0" class="overflow-auto">
            <v-col cols="12">
              <v-data-table v-model:page="page" :headers="headers" :items="infraccionesList" hover :search="search"
                :items-per-page="itemsPerPage" hide-default-footer class="elevation-1 mt-6">
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.dateLog }}</td>
                    <td>{{ item.eventType }}</td>
                    <td>{{ item.plate }}</td>
                    <td>{{ item.emissions }}</td>
                    <td v-if="item.metadata">{{ item.metadata.RealVel }}</td>
                    <td v-if="item.metadata">{{ item.metadata.idUser }}</td>
                    <td v-if="item.metadata">{{ item.metadata.idDevice }}</td>
                    <td>{{ item.status }}</td>
                    <td>
                      <v-row>
                        <v-btn class="justify-end mr-2" color="primary" @click="toDenuciaDetail(item)" variant="plain"
                          prepend-icon="mdi-eye-arrow-right-outline" />
                      </v-row>
                    </td>
                  </tr>
                </template>
                <template v-slot:bottom>
                  <div class="text-center pt-2">
                    <v-pagination v-model="page" :length="pageCount"></v-pagination>
                  </div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-row>

      </v-card-text>
    </v-card>
  </v-container>
</template>



<script setup>

import { ref, computed, onBeforeMount } from 'vue'
import { useAppStore, useLoadingStore } from '@/store/index';
import axios from "axios";
import { VDataTable } from 'vuetify/labs/VDataTable'
import veloxHeader from '@/components/veloxHeader.vue'
import { useDisplay } from 'vuetify';
import { useRoute, useRouter } from "vue-router";
import { formatDateShort } from '@/support/helpers/general'

const { mobile } = useDisplay()
const appStore = useAppStore()
const $router = useRouter();
const $route = useRoute();
const loadingStore = useLoadingStore();
const currentUser = computed(() => appStore.getCurrentUser);

let infraccionesList = ref([])
const idGroup = computed(() => $route.params.idGroup)
const isAdmin = computed(() => appStore.getIsAdmin);

const search = ref('')

const headers = [
  { title: 'Fecha de la denuncia', align: 'start', key: 'dateLog', },
  { title: 'Tipo de infracción', align: 'start', key: 'eventType', },
  { title: 'Matrícula', align: 'start', key: 'plate', },
  { title: 'Emisiones', align: 'start', key: 'emissions', },
  { title: 'Velocidad detectada', align: 'start', key: 'metadata1', },
  { title: 'Id Usuario', align: 'start', key: 'metadata2', },
  { title: 'Id Dispositivo', align: 'start', key: 'metadata', },
  { title: 'Status', align: 'start', key: 'status', },
  { title: 'Ver', align: 'start', key: '' },
]
const page = ref(1);
const itemsPerPage = ref(10
);
const pageCount = computed(() => {
  return Math.ceil(infraccionesList.value.length / itemsPerPage.value)
});

const breadcrumbsItems = [
  {
    title: 'Inicio',
    disabled: false,
    to: { name: 'Groups' },
  },
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
      await getInfracciones()
    } else {
      $router.push(`notAllowed`);
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

const getInfracciones = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/infracciones/${idGroup.value}`)

    let dataFormatted = []

    res.data.forEach((e) => {
      e.dateLog = formatDateShort(e.dateLog)
      dataFormatted.push(e)
    });

    infraccionesList.value = dataFormatted;

  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

const toDenuciaDetail = async data => {
  $router.push(`/${idGroup.value}/infraccion/${data.idLog}`);
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
</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}

.v-table {
  border-radius: 6px;
}
</style>

