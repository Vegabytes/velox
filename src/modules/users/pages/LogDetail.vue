<template>
    <v-container>
        <v-card variant="flat" v-if="!loadingStore.isLoading">
            <v-img :src="currentGroup.path" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="150px" cover>
                <v-card-title class="text-white text-h2" v-text="currentGroup.name"></v-card-title>
                <v-card-subtitle class="text-white text-h5 mb-4" v-text="currentGroup.description"></v-card-subtitle>
            </v-img>
            <v-card-text>



                <v-row class="pa-5 d-flex justify-center align-center">
                    <v-row class="py-6">
                        <v-avatar class="ma-3" size="x-large">
                            <v-img cover :src="appStore.currentDevice.path"></v-img>
                        </v-avatar>

                        <v-card-item>
                            <v-card-title>{{ appStore.currentDevice.name }}</v-card-title>
                            <v-card-subtitle>{{ appStore.currentDevice.description }}</v-card-subtitle>
                        </v-card-item>
                    </v-row>
                    <v-btn class="justify-end mr-2" color="primary" variant="" prepend-icon="mdi-arrow-left-thin"
                        @click="toUserPage()">
                        Volver a vista principal</v-btn>
                </v-row>

                <v-divider></v-divider>

                <v-card class="mt-2" variant="flat">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-card-item class="mb-2">
                                <v-card-title>
                                    <span class="text-h5 font-weight-bold">{{ appStore.currentLog.data }}</span></v-card-title>
                                <v-card-subtitle>{{ 'Loren ipsum' }}</v-card-subtitle>
                            </v-card-item>


                            <v-card variant="tonal" class="pa-8">
                                <v-row class="mb-2">
                                    <strong>
                                        Fecha hora infracción:</strong> {{ }}</v-row>
                                <v-row class="mb-2">
                                    <strong>Pos GPS: </strong>
                                    {{ }}</v-row>
                                <v-row class="mb-2">
                                    <strong>Velocidad de la vía: </strong>
                                    {{ }}</v-row>
                                <v-row class="mb-2">
                                    <strong>Velocidad detectada:</strong>
                                    {{ }}</v-row>
                                <v-row class="mb-2">
                                    <strong>Matrícula infracción: </strong>
                                    {{ }}</v-row>
                                <v-row>
                                    <strong>ID Agente: </strong>
                                    {{ }}
                                </v-row>
                            </v-card>

                            <v-card class="pa-8">
                                <v-carousel :continuous="false" hide-delimiters
                                        delimiter-icon="mdi-square" height="300">
                                        <v-carousel-item v-for="(slide, i) in [1, 2, 3, 4, 5]" :key="i">
                                            <v-img src="../../../../images/1/1.jpg" />
                                        </v-carousel-item>
                                    </v-carousel>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="6">
                            <ol-map style="height: 500px;" :loadTilesWhileAnimating="true"
                                :loadTilesWhileInteracting="true">
                                <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom"
                                    :projection="projection" />

                                <ol-tile-layer>
                                    <ol-source-osm />
                                </ol-tile-layer>

                                <ol-vector-layer>
                                    <ol-source-vector>

                                        <ol-feature>
                                            <ol-geom-point
                                                :coordinates="appStore.currentLog.position.split(',')"></ol-geom-point>
                                            <ol-style>
                                                <ol-style-circle :radius="radius">
                                                    <ol-style-fill :color="fillColor"></ol-style-fill>
                                                    <ol-style-stroke :color="strokeColor"
                                                        :width="strokeWidth"></ol-style-stroke>
                                                </ol-style-circle>
                                                <ol-style-text :text="appStore.currentLog.data">
                                                    <ol-style-fill color="white"></ol-style-fill>
                                                </ol-style-text>
                                            </ol-style>
                                        </ol-feature>

                                        <ol-feature>
                                            <ol-geom-point
                                                :coordinates="appStore.currentLog.position.split(',')"></ol-geom-point>
                                            <ol-style>
                                                <ol-style-circle :radius="radius">
                                                    <ol-style-fill :color="fillColor"></ol-style-fill>
                                                    <ol-style-stroke :color="strokeColor"
                                                        :width="strokeWidth"></ol-style-stroke>
                                                </ol-style-circle>
                                            </ol-style>

                                        </ol-feature>
                                    </ol-source-vector>

                                </ol-vector-layer>
                            </ol-map>
                        </v-col>
                    </v-row>


                </v-card>


            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import axios from "axios";
import { computed, ref } from 'vue';
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from "vue-router";

import { useAppStore, useLoadingStore } from '@/store/index';

const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loadingStore = useLoadingStore();

const idGroup = computed(() => $route.params.idGroup)
const idCurrentDevice = computed(() => $route.params.idDevice)
const idLog = computed(() => $route.params.idLog)

const currentGroup = computed(() => appStore.currentGroup);
const userGroups = computed(() => appStore.userGroups);

const center = ref([-3.7025600, 40.4165000]);
const projection = ref("EPSG:4326");
const zoom = ref(10);
const rotation = ref(0);
const radius = ref(10);
const strokeWidth = ref(4);
const strokeColor = ref("blue");
const fillColor = ref("blue");

onBeforeMount(async () => {
    loadingStore.setLoading(true);
    if (!appStore.getCurrentUser || !appStore.getCurrentUser.name) {
        $router.push(`/${idGroup.value}/login`);
    }
    try {

        if (!appStore.currentGroup || !appStore.currentGroup.id) {
            await getGroupData();
        }

        await getLogData();
        await getDeviceData();

    } catch (error) {
        console.error(error);
    } finally {
        loadingStore.setLoading();
    }
});


const getLogData = async () => {
    const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

    try {
        const res = await axios.get(`${url}/log/${idLog.value}`)
        appStore.currentLog = res.data[0];
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

const getDeviceData = async () => {
    const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

    try {
        const res = await axios.get(`${url}/device/${idLog.value}`)
        appStore.currentDevice = res.data[0];
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

const toUserPage = () => {
    $router.go(-1)
}

</script>