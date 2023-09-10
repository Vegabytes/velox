<template>
  <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
    <v-card elevation="8" rounded="lg" color="secondary">
      <veloxHeader :path="appStore.currentGroup.path" :name="appStore.currentGroup.name"
        :description="appStore.currentGroup.description" />
      <v-card-text :class="mobile ? 'pa-4' : 'pa-12'">
        <v-row class="mt-4 my-8 justify-space-between">
          <v-col ols="12" lg="6" class="d-flex">
            <h2 class="text-primary text-h5 text-lg-h3 text-md-h4">Asignar usuario a grupo</h2>
          </v-col>
          <v-breadcrumbs :items="breadcrumbsItems">
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

        <v-row v-if="groupSelected">
          <!-- Usuarios asignables -->
          <v-col cols="12">
            <v-text-field v-model="searchText" density="comfortable" variant="outlined"
              append-inner-icon="mdi-account-search" label="Buscar usuario por nombre o apellido"></v-text-field>

          </v-col>
          <v-row v-if="groupSelected && searchText" class="overflow-auto">
            <v-col cols="12">
              <v-data-table v-model:page="pageUsers" :headers="headers" :items="userListNotAsign" hover="true"
                :items-per-page="10" hide-default-footer class="elevation-1 mt-6">
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.columns.name }}</td>
                    <td>{{ item.columns.lastName }}</td>
                    <td>{{ item.columns.email }}</td>
                    <td>
                      <v-row>
                        <v-btn class="justify-end mr-2" color="primary" variant=""
                          @click="openDialogAsignUser(item.raw.id)" :disabled="item.raw.id === appStore.currentUser.id"
                          prepend-icon="mdi-account-plus">
                        </v-btn>
                      </v-row>
                    </td>
                  </tr>
                </template>
                <template v-slot:bottom>
                  <div class="text-center pt-2">
                    <v-pagination v-model="page2"></v-pagination>
                  </div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Diálogo asignar usuario-->
    <v-dialog v-model="dialogAsignUser" width="auto">
      <v-card>
        <v-card-text class="pa-4">
          ¿Quiere añadir el usuario al grupo seleccionado?
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="tonal" @click="asignUser()">Aceptar</v-btn>
          <v-btn color="primary" @click="dialogAsignUser = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <v-snackbar v-model="snackbarActivate" :color="snackbarColor" location="top right" timeout="2500">
    <div class="text-subtitle-1 pb-2"> {{ snackbarText }}</div>
  </v-snackbar>
</template>



<script setup>

import { ref, onBeforeMount, watch } from 'vue'
import { useAppStore, useLoginStore } from '@/store/index';
import axios from "axios";
import { VDataTable } from 'vuetify/labs/VDataTable'
import veloxHeader from '@/components/veloxHeader.vue'
import { useDisplay } from 'vuetify';
import { useRouter } from "vue-router";

const { mobile } = useDisplay()
const appStore = useAppStore()
const loginStore = useLoginStore()
const $router = useRouter();

let groupSelected = ref(null)
let userListNotAsign = ref([])
let userGroupList = ref([])
let searchText = ref(null)
let userSelectedId = ref(null)

const pageUsers = ref(1)

const headers = [
  { title: 'Nombre', align: 'start', key: 'name', },
  { title: 'Apellidos', align: 'start', key: 'lastName' },
  { title: 'Correo Electrónico', align: 'start', key: 'email' },
  { title: 'Asignar', align: 'start', key: '' },
]
const page2 = ref(1)
const dialogAsignUser = ref(false);

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

const getNotAssignedUsersByEmail = async (idGroup) => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'
  try {
    const res = await axios.post(`${url}/users/notAssignedUserByEmail/${idGroup}`, { email: searchText.value })
    userListNotAsign.value = res.data;
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

const getUsersGroup = async (idGroup) => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/users/groupUsers/${idGroup}`)
    userGroupList.value = res.data;
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

const asignUser = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'
  const idGroup = groupSelected.value
  const user = userSelectedId.value
  try {
    const res = await axios.post(`${url}/user/assign`, { userId: user, groupId: idGroup })
    snackbarText.value = 'Usuario asignado correctamente';
    snackbarActivate.value = true;
    snackbarColor.value = 'primary'
    return res;
  } catch (error) {
    console.error(error)
    snackbarText.value = 'Error al asignar usuario a grupo'
    snackbarActivate.value = true;
    snackbarColor.value = 'error'
  } finally {
    userListNotAsign.value = [];
    groupSelected.value = null;
    dialogAsignUser.value = false;
    searchText.value = '';
  }

}

const openDialogAsignUser = (id) => {
  userSelectedId.value = id;
  dialogAsignUser.value = true;
}

onBeforeMount(() => {
  if (!loginStore.loggedUser.groupId) {
    $router.push("error");
  }
});

watch(groupSelected, (v) => {
  if (!loginStore.loggedUser.groupId) {
    $router.push("error");
  } else {
    if (groupSelected.value) {
      getUsersGroup(v)
      userListNotAsign.value = []
    }
  }
})

watch(searchText, (v) => {

  if (v.length > 3) {

    try {
      getNotAssignedUsersByEmail(groupSelected.value)
    } catch (err) {
      console.error(err)
    }

  }
})


</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}
</style>

