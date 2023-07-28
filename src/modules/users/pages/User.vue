<template>
    <v-container>
        <v-card color="onPrimary" variant="flat">
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-card class="pa-8" color="surface">
                            <div class="mb-8">
                                <v-row class="d-flex justify-center mb-2">
                                    <v-avatar color="primary" size="large">
                                        <span class="text-h5" v-if="!appStore.currentUser.path">JD</span>
                                        <v-img v-if="appStore.currentUser.path" :src="appStore.currentUser.path"
                                            alt="John"></v-img>
                                    </v-avatar>
                                </v-row>
                                <v-row class="d-flex justify-center">
                                    <h2 class="mr-2 text-primary">{{ appStore.currentUser.name }}</h2>
                                    <h2 class="text-primary">{{ appStore.currentUser.lastName }}</h2>
                                </v-row>
                                <v-row class="d-flex justify-center">
                                    <span class="text-subtitle-3 text-medium-emphasis capitalize-text">{{
                                        appStore.currentUser.status }}</span>
                                </v-row>
                            </div>

                            <div class="d-flex justify-center">
                                <v-btn variant="tonal" color="primary" rounded="xl" size="small"
                                    :prepend-icon="(mostrarInfo) ? 'mdi-minus' : 'mdi-plus'"
                                    @click="mostrarInfo = !mostrarInfo">
                                    {{ (mostrarInfo) ? 'Ocultar información' : 'Mostrar más información' }}
                                </v-btn>
                            </div>

                            <div v-if="mostrarInfo" class="py-6 mt-6">
                                <v-row class="mb-2">
                                    <v-text-field v-model="appStore.currentUser.email" flat="true"
                                        label="Correo electrónico" :readonly="true"></v-text-field>
                                </v-row>
                                <v-row class="mb-2">
                                    <v-text-field v-model="appStore.currentUser.phone" flat="true" label="Teléfono"
                                        :readonly="true"></v-text-field>
                                </v-row>
                                <v-row class="mb-2">
                                    <v-text-field v-model="appStore.currentUser.address" flat="true" label="Dirección"
                                        :readonly="true"></v-text-field>
                                </v-row>
                                <v-row class="mb-2">
                                    <v-textarea v-model="appStore.currentUser.description" label="Descripción" flat="true"
                                        :readonly="true" rows="10"></v-textarea>
                                </v-row>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="8">
                        <v-card class="mb-8" variant="flat" color="onPrimary">
                            <v-card-title>
                                <v-row class="py-2">
                                    <v-col cols="12">
                                        <h3 class="text-h4 text-primary">Grupos a los que pertenece</h3>
                                    </v-col>
                                </v-row>
                            </v-card-title>
                            <v-card-text>

                                <v-expansion-panels color="onPrimary">

                                    <v-expansion-panel v-for="item in appStore.currentUserGroups" color="onPrimary">
                                        <v-expansion-panel-title v-slot="{ open }" color="onSecondary">
                                            <v-row no-gutters class="d-flex align-center">
                                                <v-avatar color="primary" class="mr-6">
                                                    <v-img v-if="item.path" :src="item.path" alt="GroupAvatar"></v-img>
                                                </v-avatar>
                                                <h5 class="text-h6">{{ item.name }}</h5>
                                            </v-row>
                                        </v-expansion-panel-title>
                                        <v-expansion-panel-text bg-color="white" color="white">

                                            <v-row bg-color="white">
                                                <v-col cols="12">
                                                    <h4>Dispositivos</h4>
                                                </v-col>
                                            </v-row>

                                            <v-table density="compact">
                                                <thead>
                                                    <tr>
                                                        <th class="text-left">
                                                            Id
                                                        </th>
                                                        <th class="text-left">
                                                            Nombre
                                                        </th>
                                                        <th class="text-left">
                                                            Descripción
                                                        </th>
                                                        <th>
                                                            Ubicación
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="d in item.devices" :key="d.id">
                                                        <td>{{ d.id }}</td>
                                                        <td>{{ d.name }}</td>
                                                        <td>{{ d.description }}</td>
                                                        <td>
                                                            <v-btn variant="tonal" color="primary" rounded="xl" size="small"
                                                                prepend-icon="mdi-google-maps" @click="openDialog(d.path)">
                                                                Mostrar ubicación
                                                            </v-btn>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </v-table>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-card-text>
                        </v-card>
                        <v-card class="mb-8" variant="flat" color="onPrimary">
                            <v-card-title>
                                <v-row class="py-1">
                                    <v-col cols="12">
                                        <h3 class="text-primary text-h4">Logs</h3>
                                    </v-col>
                                </v-row>
                            </v-card-title>
                            <v-card-text>

                                <v-alert v-if="!dispositivoSelected" color="info" class="text-center"
                                    text="Para visualizar los Logs correspondientes a un dispositivo, seleccione un elemento en el campo 'Seleccionar Dispositivo'"
                                    variant="tonal"></v-alert>

                                <v-row class="mt-2">
                                    <v-col cols="12">
                                        <v-select label="Seleccionar un grupo de dispositivos" :items="devicesList"
                                            item-title="name" item-value="id" v-model="dispositivoSelected"
                                            @update:modelValue="getLogs()"></v-select>
                                    </v-col>
                                </v-row>

                                <v-table v-if="dispositivoSelected && logsList">
                                    <thead>
                                        <tr>
                                            <th class="text-left">
                                                Dispositivo
                                            </th>
                                            <th class="text-left">
                                                Descripción
                                            </th>
                                            <th class="text-left">
                                                Ubicación
                                            </th>
                                            <th class="text-left">
                                                Tipo
                                            </th>
                                            <th class="text-left">
                                                eventTimeStamp
                                            </th>
                                            <th class="text-left">
                                                Fecha
                                            </th>
                                            <th class="text-left">
                                                Usuario
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in logsList">
                                            <td>{{ item.deviceId }}</td>
                                            <td>{{ item.data }}</td>
                                            <td>
                                                <v-btn variant="tonal" color="primary" rounded="xl" size="small"
                                                    prepend-icon="mdi-google-maps" @click="openDialog(item.position)">
                                                    Mostrar ubicación
                                                </v-btn>
                                            </td>
                                            <td>{{ item.eventType }}</td>
                                            <td>{{ item.eventTimeStamp }}</td>
                                            <td>{{ item.createdAt }}</td>
                                            <td>{{ item.createdBy }}</td>
                                        </tr>
                                    </tbody>
                                </v-table>

                                <v-dialog v-model="dialog" width="auto">
                                    <v-card>
                                        <mapa :position="appStore.devicePosition"></mapa>
                                    </v-card>
                                </v-dialog>

                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>


import axios from "axios";
import { computed } from 'vue';
import { ref, onBeforeMount } from 'vue'
import mapa from '../mapa.vue'

import { useAppStore } from '@/store/index';
const appStore = useAppStore()
appStore.showMenu = true

let dispositivoSelected = ref(null)
let mostrarInfo = ref(false)
let devicesList = ref([])
const dialog = ref(false)

const logsList = computed(() => {
    return appStore.currentLogs
})

const openDialog = (position) => {
    appStore.devicePosition = position.split(',')
    dialog.value = true;
}

async function getLogs() {
    try {
        const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://localhost:5000'
        const res = await axios.get(`${url}/devices/logs/${dispositivoSelected.value}`)

        appStore.currentLogs = res.data;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

const getUserGroup = async () => {
    const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://localhost:5000'

    try {
        const res = await axios.get(`${url}/groups/user/${appStore.currentUser.id}`)
        appStore.currentUserGroups = res.data;

        let _devicesList = {}

        res.data.forEach(grupoUsuario => {
            grupoUsuario.devices.forEach(devices => {
                if (!_devicesList[devices.id]) {
                    _devicesList[devices.id] = devices
                }
            })
        });

        devicesList.value = Object.values(_devicesList)

    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

onBeforeMount(() => {
    getUserGroup()
});
</script>
