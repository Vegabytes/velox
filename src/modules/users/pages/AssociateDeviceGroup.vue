<template>
  <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
    <v-card elevation="8" rounded="lg" color="secondary">
      <veloxHeader :path="appStore.currentGroup.path" :name="appStore.currentGroup.name"
        :description="appStore.currentGroup.description" />
      <v-card-text :class="mobile ? 'pa-4' : 'pa-12'">
        <v-row class="mt-4 my-8 justify-space-between">
          <v-col ols="12" lg="6" class="d-flex">
            <h2 class="text-primary text-h5 text-lg-h3 text-md-h4">Asignar grupos de dispositivos</h2>
          </v-col>
          <v-breadcrumbs :items="breadcrumbsItems" class="px-0">
            <template v-slot:prepend>
              <v-icon size="small" icon="mdi-home"></v-icon>
            </template>
          </v-breadcrumbs>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-autocomplete density="comfortable" variant="outlined" item-title="name" item-value="id"
              v-model="groupSelected" label="Seleccione un grupo" :items="appStore.userGroups"></v-autocomplete>
          </v-col>
        </v-row>
        <v-row v-if="groupSelected" class="overflow-auto">
          <v-col cols="12">
            <v-data-table v-model:page="page" :headers="headers" :items="devicesGroupsList" hover
              :items-per-page="itemsPerPage" hide-default-footer class="elevation-1 mt-6">
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.name }}</td>
                  <td>{{ item.description }}</td>
                  <td>
                    <v-row>
                      <v-btn class="justify-end mr-2" color="primary" variant=""
                        @click="opendialogAssignGroupDevice(item.id)" prepend-icon="mdi-plus">
                      </v-btn>
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
      </v-card-text>
    </v-card>



    <!-- Diálogo asignar usuario-->
    <v-dialog v-model="dialogAssignGroupDevice" width="auto">
      <v-card>
        <v-card-text class="pa-4">
          ¿Quiere añadir los dispositivos al grupo seleccionado?
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="tonal" @click="asignDevices()">Aceptar</v-btn>
          <v-btn color="primary" @click="dialogAssignGroupDevice = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <v-snackbar v-model="snackbarActivate" :color="snackbarColor" location="top right" timeout="2500">
    <div class="text-subtitle-1 pb-2"> {{ snackbarText }}</div>
  </v-snackbar>
</template>



<script setup>

import { ref, watch, computed, onBeforeMount } from 'vue'
import { useAppStore, useLoadingStore } from '@/store/index';
import axios from "axios";
import { VDataTable } from 'vuetify/labs/VDataTable'
import veloxHeader from '@/components/veloxHeader.vue'
import { useDisplay } from 'vuetify';
import { useRoute, useRouter } from "vue-router";

const { mobile } = useDisplay()
const appStore = useAppStore()
const $router = useRouter();
const $route = useRoute();
const loadingStore = useLoadingStore();
const currentUser = computed(() => appStore.getCurrentUser);

let groupSelected = ref(null)
let devicesGroupsList = ref([])
let deviceGroupSelectedId = ref(null)
const idGroup = computed(() => $route.params.idGroup)
const isAdmin = computed(() => appStore.getIsAdmin);
const page = ref(1);
const itemsPerPage = ref(5);
const pageCount = computed(() => {
  return Math.ceil(devicesGroupsList.value.length / itemsPerPage.value)
});

const headers = [
  { title: 'Nombre', align: 'start', key: 'name', },
  { title: 'Descripción', align: 'start', key: 'description' },
  { title: 'Asignar', align: 'start', key: '' },
]
const dialogAssignGroupDevice = ref(false);

const snackbarActivate = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('primary')

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
      await getUserGroups()
    } else {
      $router.push(`/${idGroup.value}/login`);
    }


  } catch (error) {
    console.error(error);
  } finally {
    loadingStore.setLoading();
  }
});

const goToGroupDetail = (item) => {
  $router.push(`/${idGroup.value}/groups/groupDetail/${item.id}`);
}

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

const getDevicesGroup = async (idGroup) => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/device/notAssignedDeviceGroup/${idGroup}`)
    devicesGroupsList.value = res.data;
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

const asignDevices = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'
  const idGroup = groupSelected.value
  const deviceGroup = deviceGroupSelectedId.value
  try {
    const res = await axios.post(`${url}/devices/assign`, { deviceGroupId: deviceGroup, groupId: idGroup })
    snackbarText.value = 'Dispositivos asignados correctamente';
    snackbarActivate.value = true;
    snackbarColor.value = 'primary'
    return res;
  } catch (err) {
    console.error(err)
    snackbarText.value = 'Esta asociación ya existe'
    snackbarActivate.value = true;
    snackbarColor.value = 'error'
  } finally {
    devicesGroupsList.value = [];
    groupSelected.value = null;
    dialogAssignGroupDevice.value = false;
  }

}

const opendialogAssignGroupDevice = (id) => {
  deviceGroupSelectedId.value = id;
  dialogAssignGroupDevice.value = true;
}


watch(groupSelected, (v) => {
  if (groupSelected.value) {
    getDevicesGroup(v)
  }
})

</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}

.v-table {
  border-radius: 6px;
}
</style>

