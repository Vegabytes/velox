<template>
    <v-container>
        <v-card variant="flat" v-if="!loadingStore.isLoading">
            <v-img :src="currentGroup.path" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="150px" cover>
                <v-card-title class="text-white text-h2" v-text="currentGroup.name"></v-card-title>
                <v-card-subtitle class="text-white text-h5 mb-4" v-text="currentGroup.description"></v-card-subtitle>
            </v-img>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-card class="mb-8" variant="flat">

                            <v-row class="pa-5 d-flex justify-center align-center">
                                <v-row class="py-6">
                                    <v-avatar class="ma-3" size="x-large">
                                        <v-img cover :src="currentDevice[0].path"></v-img>
                                    </v-avatar>

                                    <v-card-item>
                                        <v-card-title>{{ currentDevice[0].name }}</v-card-title>
                                        <v-card-subtitle>{{ currentDevice[0].description }}</v-card-subtitle>
                                    </v-card-item>
                                </v-row>
                                <v-btn class="justify-end mr-2" color="primary" variant=""
                                    prepend-icon="mdi-arrow-left-thin" @click="toUserPage()">
                                    Volver a vista principal</v-btn>
                            </v-row>


                            <v-divider></v-divider>

                            <v-row>
                                <v-col cols="6">
                                    <v-card-text>
                                        <v-card v-for="item in currentDeviceLogs"
                                            class="d-flex pa-2 mb-2 align-center" @click="goToLogsDevice(item)"
                                            style="cursor: pointer;" variant="flat">
                                            <v-row class="d-flex align-center">
                                                <v-avatar color="secondary" size="large">
                                                    <v-img v-if="item.imagePath" :src="item.imagePath" alt="user"></v-img>
                                                </v-avatar>
                                                <strong class="pr-6">{{ item.id }}</strong> {{ item.data }}
                                            </v-row>
                                            <div class="d-flex justify-end">
                                                <v-btn class="justify-end mr-2" color="primary" variant=""
                                                    prepend-icon="mdi-arrow-right-thin">
                                                </v-btn>
                                            </div>

                                        </v-card>
                                    </v-card-text>
                                </v-col>
                                <v-col cols="6">

                                    <v-card class="pa-6">
                                        <ol-map style="height: 500px;" :loadTilesWhileAnimating="true"
                                            :loadTilesWhileInteracting="true">
                                            <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom"
                                                :projection="projection" />

                                            <ol-tile-layer>
                                                <ol-source-osm />
                                            </ol-tile-layer>

                                            <ol-vector-layer>
                                                <ol-source-vector>

                                                    <ol-feature v-if="currentDeviceLogs.length > 0"
                                                        v-for="item in currentDeviceLogs">
                                                        <ol-geom-point
                                                            :coordinates="item.position.split(',')"></ol-geom-point>
                                                        <ol-style>
                                                            <ol-style-circle :radius="radius">
                                                                <ol-style-fill :color="fillColor"></ol-style-fill>
                                                                <ol-style-stroke :color="strokeColor"
                                                                    :width="strokeWidth"></ol-style-stroke>
                                                            </ol-style-circle>
                                                            <ol-style-text :text="item.data">
                                                                <ol-style-fill color="white"></ol-style-fill>
                                                            </ol-style-text>
                                                        </ol-style>
                                                    </ol-feature>


                                                    <ol-feature v-for="item in currentDeviceLogs">
                                                        <ol-geom-point :coordinates="[item.position]"></ol-geom-point>
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
                                    </v-card>
                                </v-col>
                            </v-row>


                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import axios from "axios";
import { computed, ref } from 'vue';
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from "vue-router";
import mapa from '../mapa.vue'

import { useAppStore, useLoadingStore } from '@/store/index';

const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loadingStore = useLoadingStore();

const currentGroup = computed(() => appStore.currentGroup);
const userGroups = computed(() => appStore.userGroups);
const userGroupsCurrent = computed(() => userGroups.value.filter(({ id }) => id == idViewGroup.value))
const listDevicesByUser = computed(() => !!userGroupsCurrent.value.length ? userGroupsCurrent.value[0].devices : []);
const currentDevice = computed(() => listDevicesByUser.value.filter(({ id }) => id == idCurrentDevice.value));


const idGroup = computed(() => $route.params.idGroup)
const idViewGroup = computed(() => $route.params.id)
const idCurrentDevice = computed(() => $route.params.idDevice)

const currentDeviceLogs = ref([]);













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
        await getUserGroups();
        await getLogsByDevice();
    } catch (error) {
        console.error(error);
    } finally {
        loadingStore.setLoading();
    }
});


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

const getLogsByDevice = async () => {
    const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

    try {
        const res = await axios.get(`${url}/logs/device/${idCurrentDevice.value}`)
        currentDeviceLogs.value = res.data;
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