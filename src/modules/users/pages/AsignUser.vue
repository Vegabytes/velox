<template>
  <v-container>

    <v-card elevation="8" rounded="lg" color="secondary" min-width="70%">

      <veloxHeader :path="appStore.currentGroup.path" :name="appStore.currentGroup.name"
        :description="appStore.currentGroup.description" />

      <v-card-text class="pa-12">
        <v-row class="d-flex justify-center align-center mb-6">
          <v-col cols="8">
            <h2 class="text-primary text-h2">Asignar usuario a grupo</h2>
          </v-col>
          <v-col cols="4" class="d-flex justify-end">
            <veloxBtnReturn />
          </v-col>
        </v-row>

        <v-row>
          <v-autocomplete density="comfortable" item-title="name" item-value="id" variant="outlined"
            v-model="groupSelected" label="Seleccione un grupo" :items="appStore.userGroups"></v-autocomplete>
        </v-row>


        <v-row v-if="groupSelected">
          <!-- Usuarios pertenecientes al grupo -->
          <v-col cols="12" lg="6">
            <v-row>
              <h4 class="text-primary text-h5 ma-4">Usuarios pertenecientes al grupo</h4>
            </v-row>
            <v-data-table v-model:page="pageUsersGroup" :headers="headersUsersGroup" :items="userGroupList" hover="true"
              :items-per-page="10" hide-default-footer class="elevation-1">
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.columns.name }}</td>
                  <td>{{ item.columns.lastName }}</td>
                  <td>{{ item.columns.email }}</td>
                  <td>
                    <v-row class="d-flex justify-center">
                      <v-btn class="justify-end mr-2" color="primary" variant="" @click="" :disabled="item.raw.id === appStore.currentUser.id"
                        prepend-icon="mdi-arrow-right-thin">
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

          <v-col cols="12" lg="6">
            <v-row>
              <h4 class="text-primary text-h5 ma-4">Asignar usuario a grupo</h4>
            </v-row>
            <v-row>
              <v-data-table color="white" v-model="selected" v-model:items-per-page="itemsPerPage" :headers="headers"
                show-select :items="userList" return-object item-value="name" class="elevation-1"></v-data-table>
            </v-row>
            <v-row v-if="groupSelected">
              <v-col cols="12">
                <v-btn block class="mb-8" color="primary" size="large" type="submit" @click="asignUsers">
                  Asignar usuarios
                </v-btn>
              </v-col>
            </v-row>
          </v-col>

        </v-row>



      </v-card-text>
    </v-card>


  </v-container>
</template>



<script setup>

import { ref, onBeforeMount, watch } from 'vue'
import { useAppStore, useUsersStore, useLoginStore } from '@/store/index';
import axios from "axios";
import { VDataTable } from 'vuetify/labs/VDataTable'
import veloxHeader from '@/components/veloxHeader.vue'
import veloxBtnReturn from '@/components/veloxBtnReturn.vue'

const appStore = useAppStore()
const userStore = useUsersStore()
const loginStore = useLoginStore()

import { useRouter } from "vue-router";
const $router = useRouter();

const valid = ref(false)
let visible = ref(false)
let groupSelected = ref(null)
let userList = ref([])
let userGroupList = ref([])
const selected = ref([])

//Variables tabal usuarios pertenecientes a grupo
let itemsPerPageUsersGroup = ref(10)
const headersUsersGroup = [
  { title: 'Nombre', align: 'start', key: 'name', },
  { title: 'Apellidos', align: 'start', key: 'lastName' },
  { title: 'Correo Electrónico', align: 'start', key: 'email' },
  { title: 'Eliminar', align: 'start', key: '' },
]
const pageUsersGroup = ref(1)


//Variables tabla usuarios asignables
let itemsPerPage = ref(10)
const headers = [
  { title: 'Nombre', align: 'start', key: 'name', },
  { title: 'Apellidos', align: 'start', key: 'lastName' },
  { title: 'Correo Electrónico', align: 'start', key: 'email' },
  { title: 'Dirección', align: 'start', key: 'address' },
  { title: 'Teléfono', align: 'start', key: 'phone' },
]
const page = ref(1)





const getAllUsers = async () => {
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/users`)
    userList.value = res.data;
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

const asignUsers = async () => {

  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/users/notAssignedUser/${2}`)
    userList.value = res.data;
  }
  catch (err) {
    console.error(err);
    throw err;
  }

}

const getNotAssignedUsers = async (idGroup) => {

  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/users/notAssignedUser/${idGroup}`)
    userList.value = res.data;
  }
  catch (err) {
    console.error(err);
    throw err;
  }

}

//Devuelve listado de usuarios pertenecientes al grupo seleccionado
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

onBeforeMount(() => {
  if (!loginStore.loggedUser.groupId) {
    $router.push("error");
  }
});

watch(groupSelected, (v) => {
  if (!loginStore.loggedUser.groupId) {
    $router.push("error");
  } else {
    getUsersGroup(v)
  }
})


</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}
</style>

