<template>
    <v-container>
        <v-card>
            <v-card-text>

                <v-row>
                    <v-col cols="12" md="4">
                        <v-card variant="tonal" color="primary" class="pa-8">

                            <div class="mb-8">
                                <v-row class="d-flex justify-center mb-2">
                                    <v-avatar color="secondary" size="large">
                                        <span class="text-h5">JD</span>
                                    </v-avatar>
                                </v-row>
                                <v-row class="d-flex justify-center">
                                    <h2 class="mr-2">{{ user.name }}</h2> <h2>{{ user.lastname }}</h2>
                                </v-row>
                                <v-row class="d-flex justify-center">
                                    <span class="text-subtitle-3 text-medium-emphasis">{{ user.status }}</span>
                                </v-row>
                            </div>

                            <div class="d-flex justify-center">
                                <v-btn 
                                    variant="tonal" 
                                    rounded="xl" 
                                    size="small"
                                    :prepend-icon="(mostrarInfo)?'mdi-minus':'mdi-plus'"
                                    @click="mostrarInfo = !mostrarInfo"> 
                                        {{(mostrarInfo)?'Ocultar información':'Mostrar más información'}}
                                </v-btn>
                            </div>

                            <div v-if="mostrarInfo" class="py-6 mt-6">
                                <v-row class="mb-2">
                                    <v-text-field v-model="user.email" flat="true" label="Correo electrónico"
                                        :readonly="true"></v-text-field>
                                </v-row>
                                <v-row class="mb-2">
                                    <v-text-field v-model="user.phone" flat="true" label="Teléfono"
                                        :readonly="true"></v-text-field>
                                </v-row>
                                <v-row class="mb-2">
                                    <v-text-field v-model="user.address" flat="true" label="Dirección"
                                        :readonly="true"></v-text-field>
                                </v-row>
                                <v-row class="mb-2">
                                    <v-textarea v-model="user.description" label="Descripción" flat="true"
                                        :readonly="true" rows="10"></v-textarea>
                                </v-row>
                            </div>    

                            


                        </v-card>
                    </v-col>
                    <v-col cols="12" md="8">
                        <v-card class="mb-8" variant="outlined">
                            <v-card-title>
                                <h2 class="text-primary">Grupos a los que pertenece</h2>
                            </v-card-title>
                            <v-card-text>

                                <v-expansion-panels>
                                    <v-expansion-panel v-for="item in groups">
                                    <v-expansion-panel-title v-slot="{ open }">
                                        <v-row no-gutters>
                                            <h3>{{ item.name.toUpperCase() }}</h3>
                                        </v-row>
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>

                                        <v-row>
                                            <v-col cols="12">
                                                <h4>Dispositivos</h4>
                                            </v-col>
                                        </v-row>

                                        <v-table density="compact">
                                            <thead>
                                            <tr>
                                                <th class="text-left">
                                                    id
                                                </th>
                                                <th class="text-left">
                                                    Nombre
                                                </th>
                                                <th class="text-left">
                                                    Activo
                                                </th>
                                                <th class="text-left">
                                                    Editar
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                <tr
                                                    v-for="d in item.dispositivos"
                                                    :key="d.id">
                                                    <td>{{ d.id }}</td>
                                                    <td>{{ d.name }}</td>
                                                    <td>
                                                        <v-icon v-if="d.active" aria-hidden="false">
                                                            mdi-check
                                                        </v-icon>
                                                        <v-icon v-if="!d.active" aria-hidden="false">
                                                            mdi-close
                                                        </v-icon>
                                                    </td>
                                                    <td> 
                                                        <v-icon aria-hidden="false">
                                                            mdi-pencil
                                                        </v-icon>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </v-table>
                                    </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-card-text>
                        </v-card>
                        <v-card class="mb-8">
                            <v-card-title>
                                <h2 class="text-primary">Logs</h2>
                            </v-card-title>
                            <v-card-text>
                                <v-table>
                                    <thead>
                                        <tr>
                                            <th class="text-left">
                                                Id
                                            </th>
                                            <th class="text-left">
                                                Nombre
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in items" :key="item.name">
                                            <td>{{ item.id }}</td>
                                            <td>{{ item.name }}</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>

import { useAppStore } from '@/store/index';
import { ref } from 'vue'
const appStore = useAppStore()

appStore.showMenu = true

let mostrarInfo = ref(false)

const user = ref({
    name: 'John',
    lastname: 'Doe Junior',
    email: 'pruebas@pruebas.es',
    phone: '666-666-666',
    address: 'C/Prueba 66, Piso 6º, Puerta A, Madrid',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
    status: 'Administrador'
})

const groups = [
    { id: 1, name: 'Grupo Uno Ejemplo', dispositivos:[{id:1,name:"Dispositivo 1",active:true},{id:2,name:"Dispositivo 2",active:false},{id:3,name:"Dispositivo 3",active:true}] },
    { id: 2, name: 'Segundo grupo',dispositivos:[{id:1,name:"Dispositivo 1",active:true},{id:2,name:"Dispositivo 2",active:true},{id:3,name:"Dispositivo 3",active:true}]  },
    { id: 3, name: 'tercer grupo',dispositivos:[{id:1,name:"Dispositivo 1",active:true},{id:2,name:"Dispositivo 2",active:true},{id:3,name:"Dispositivo 3",active:true}]  },
    { id: 4, name: 'Último grupo',dispositivos:[{id:1,name:"Dispositivo 1",active:true},{id:2,name:"Dispositivo 2",active:true},{id:3,name:"Dispositivo 3",active:true}]  }
]



</script>
