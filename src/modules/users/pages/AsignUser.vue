<template>
  <v-container class="d-flex justify-center">

    <v-card elevation="8" rounded="lg" color="secondary" min-width="70%">

      <v-img :src="appStore.currentGroup.path" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="150px" cover>
        <v-card-title class="text-white text-h2" v-text="appStore.currentGroup.name"></v-card-title>
        <v-card-subtitle class="text-white text-h5 mb-4" v-text="appStore.currentGroup.description"></v-card-subtitle>
      </v-img>

      <v-card-text class="pa-12">
        <v-row class="d-flex justify-center align-center mb-6">
          <v-col cols="8">
            <h2 class="text-primary text-h2">Asignar usuario a grupo</h2>
          </v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-btn class="justify-end mr-2" color="primary" variant="" prepend-icon="mdi-arrow-left-thin"
              @click="toUserPage()">
              Volver</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-data-table color="white" v-model="selected" v-model:items-per-page="itemsPerPage" :headers="headers"
            show-select :items="userList" return-object item-value="name" class="elevation-1"></v-data-table>
        </v-row>
      </v-card-text>
    </v-card>


  </v-container>
</template>



<script setup>

import { ref, onBeforeMount } from 'vue'
import { useAppStore, useUsersStore, useLoginStore } from '@/store/index';
import axios from "axios";
import { VDataTable } from 'vuetify/labs/VDataTable'

const appStore = useAppStore()
const userStore = useUsersStore()
const loginStore = useLoginStore()

import { useRouter } from "vue-router";
const $router = useRouter();

const valid = ref(false)
let visible = ref(false)
let userList = ref([])
let itemsPerPage = ref(10)
const headers = [
  { title: 'Nombre', align: 'start', key: 'name', },
  { title: 'Apellidos', align: 'start', key: 'lastName' },
  { title: 'Correo Electrónico', align: 'start', key: 'email' },
  { title: 'Dirección', align: 'start', key: 'address' },
  { title: 'Teléfono', align: 'start', key: 'phone' },
  { title: 'Activo', align: 'end', sortable: false, key: 'status' },
]
const selected = ref([])

const toUserPage = () => {
  $router.go(-1)
}

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

const getNotAssignedUsers = async () => {

  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

  try {
    const res = await axios.get(`${url}/users/notAssignedUser/${loginStore.loggedUser.groupId}`)
    userList.value = res.data;
  }
  catch (err) {
    console.error(err);
    throw err;
  }

}

onBeforeMount(() => {
  if (!loginStore.loggedUser.groupId) {
    $router.push("error");
  } else {
    getNotAssignedUsers()
  }
});


</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}
</style>

