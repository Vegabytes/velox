<template>

  <v-container class="d-flex justify-center">

    <v-card elevation="8" rounded="lg" color="secondary" min-width="70%">

      <v-img
        :src="appStore.currentGroup.path"
        class="align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="150px"
        cover>
        <v-card-title class="text-white text-h2" v-text="appStore.currentGroup.name"></v-card-title>
        <v-card-subtitle class="text-white text-h5 mb-4" v-text="appStore.currentGroup.description"></v-card-subtitle>        
      </v-img>

      <v-card-text class="pa-12">
          <v-row class="d-flex justify-center align-center mb-6">
            <v-col cols="8">
              <h2 class="text-primary text-h2">Usuarios</h2>
            </v-col>
            <v-col cols="4" class="d-flex justify-end">
              <v-btn class="justify-end mr-2" color="primary" variant="" prepend-icon="mdi-arrow-left-thin" @click="toUserPage()">
                Volver</v-btn>
                <v-btn class="justify-end mr-2" color="primary" variant="tonal" prepend-icon="mdi-account-arrow-up" @click="toAsignUser()">
                Asignar Usuario</v-btn>
                <v-btn class="justify-end" color="primary" variant="tonal" prepend-icon="mdi-account-plus" @click="toCreateUser()">
                Nuevo Usuario</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-data-table
              color="white"
              v-model="selected"
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="userList"
              item-value="name"
              class="elevation-1"
            >
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <v-avatar color="primary" size="small">
                    <v-img
                      :src="item.columns.path"
                      alt="John"></v-img>
                  </v-avatar>
                </td>
                <td>{{ item.columns.name }}</td>
                <td>{{ item.columns.lastName }}</td>
                <td>{{ item.columns.email }}</td>
                <td>{{ item.columns.address }}</td>
                <td>{{ item.columns.phone }}</td>
                <td>
                  <v-row class="d-flex justify-center">
                    <v-btn density="comfortable" class="justify-center" variant="text" disabled icon="mdi-pencil"></v-btn>
                  </v-row>
                </td>
              </tr>
            </template>
          </v-data-table>
          </v-row>
      </v-card-text>
</v-card>


  </v-container>
</template>



<script setup>

import { ref,onBeforeMount } from 'vue'
import { useAppStore, useUsersStore,useLoginStore } from '@/store/index';
import axios from "axios";
import { VDataTable } from 'vuetify/labs/VDataTable'

const appStore = useAppStore()
const userStore = useUsersStore()
const loginStore = useLoginStore()

appStore.showMenu = true

import {useRouter } from "vue-router";
const $router = useRouter();

const valid = ref(false)
let visible = ref(false)
let userList = ref([])
let itemsPerPage =  ref(10)
const headers = [
          { title: '',align: 'start',sortable: false,key: 'path',},
          { title: 'Nombre',align: 'start',key: 'name',},
          { title: 'Apellidos', align: 'start', key: 'lastName' },
          { title: 'Correo Electrónico', align: 'start', key: 'email' },
          { title: 'Dirección', align: 'start', key: 'address' },
          { title: 'Teléfono', align: 'start', key: 'phone' },
          { title: 'Editar', align: 'center', sortable: false,},
        ]
const selected = ref([])        

const toUserPage = ()=>{
  $router.go(-1)
}

const getAllUsers = async ()=>{
  const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://localhost:5000'

  try {
    const res = await axios.get(`${url}/users/groupUsers/${loginStore.loggedUser.groupId}`)
    userList.value = res.data;
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

const toCreateUser = async () => {
  if(loginStore.loggedUser.groupId){
    $router.push("CreateUser");
  }else{
    $router.push("login")
  }
}

const toAsignUser = async () => {
  if(loginStore.loggedUser.groupId){
    $router.push("AsignUser");
  }else{
    $router.push("login")
  }
}

onBeforeMount(() => {
  if(!loginStore.loggedUser.groupId){
    $router.push("login");
  }else{
    getAllUsers()
  }
});


</script>

<style scoped>
.color-transparent {
  background-color: transparent !important;
}
</style>

