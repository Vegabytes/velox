<template>
    <v-container>
        <v-card color="white">
            <v-card-title class="pa-6">
                <h2>John Doe Junior</h2>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>

                <v-row>
                    <v-col cols="12" md="4"> 
                        <v-card variant="tonal" color="primary" class="pa-8"> 
                            <v-row class="mb-2">

                                <v-text-field density="compact" placeholder="Nombre" label="Nombre"
                                variant="regular"></v-text-field>

                            </v-row>
                            <v-row class="mb-2">
                                <b>Apellidos : </b> <span>{{ 'Doe Junior' }}</span>
                            </v-row>
                            <v-row class="mb-2">
                                <b>Email  </b> <span>{{ 'pruebas@pruebas.es' }}</span>
                            </v-row>
                            <v-row class="mb-2">
                                <b>Teléfono : </b> <span>{{ '666-666-666' }}</span>
                            </v-row>
                            <v-row class="mb-2">
                                <b>Dirección : </b> <span>{{ 'C/Prueba 66, Piso 6º, Puerta A, Madrid' }}</span>
                            </v-row>
                            <v-row class="mb-2">
                                <b>Descripción : </b> <span>{{ 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur' }}</span>
                            </v-row>
                            <v-row class="mb-2">
                                <b>Estatus :</b> 
                                <span>{{ 'Administrador' }}</span>
                            </v-row>
                            
                            
                        </v-card>     
                    </v-col>
                    <v-col cols="12" md="8"> 
                        <v-card class="mb-8" variant="outlined">
                            <v-card-title>
                                <h2>Grupos a los que pertenece</h2>
                            </v-card-title>
                            <v-card-text>
                                <v-table  theme="light">
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
                                    <tr
                                        v-for="item in items"
                                        :key="item.name"
                                    >
                                        <td>{{ item.id }}</td>
                                        <td>{{ item.name }}</td>
                                    </tr>
                                    </tbody>
                                </v-table>
                            </v-card-text>
                        </v-card>
                        <v-card class="mb-8" variant="outlined">
                            <v-card-title>
                                <h2>Dispositivos asignados</h2>
                            </v-card-title>
                            <v-card-text>
                                <v-table  theme="light">
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
                                    <tr
                                        v-for="item in items"
                                        :key="item.name"
                                    >
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
const appStore = useAppStore()
appStore.showMenu = true

const items = [
    {id:1,name:'prueba'},
    {id:2,name:'prueba2'},
    {id:3,name:'prueba3'},
    {id:4,name:'prueba4'}
]



</script>
