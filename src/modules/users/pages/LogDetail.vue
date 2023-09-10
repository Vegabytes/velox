<template>
    <v-container fluid :class="mobile ? 'pa-1' : 'pa-10'">
        <v-card elevation="8" rounded="lg" color="secondary" v-if="!loadingStore.isLoading">
            <veloxHeader :path="currentGroup.path" :name="currentGroup.name" :description="currentGroup.description" />
            <v-container :class="mobile ? 'pa-1' : 'pa-10'">
                <v-card-text>
                    <v-row class="mt-2 pa-4">
                        <v-col>
                            <v-row class="py-6">
                                <v-avatar class="ma-3" size="x-large">
                                    <v-img v-if="appStore.currentDevice" cover :src="appStore.currentDevice.path"></v-img>
                                </v-avatar>
                                <v-card-item>
                                    <v-card-title class="text-h5 text-md-h4 font-weight-bold">{{ appStore.currentDevice.name
                                    }}</v-card-title>
                                    <v-card-subtitle>{{ appStore.currentDevice.description }}</v-card-subtitle>
                                </v-card-item>
                            </v-row>
                        </v-col>
                        <v-breadcrumbs :items="breadcrumbsItems">
                            <template v-slot:prepend>
                                <v-icon size="small" icon="mdi-home"></v-icon>
                            </template>
                        </v-breadcrumbs>
                    </v-row>

                    <v-divider></v-divider>

                    <v-card class="mt-2" variant="flat">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-card variant="tonal" class="pa-8">
                                    <v-row class="mb-2">
                                        <strong class="mr-4">Fecha hora infracción:</strong>
                                        {{ formatDate(
                                            new Date(Number(JSON.parse(appStore.currentLog.data).timestamp))
                                        )
                                        }}
                                    </v-row>
                                    <v-row class="mb-2">
                                        <strong class="mr-4">Pos GPS: </strong>
                                        {{ JSON.parse(appStore.currentLog.data).gps }}</v-row>
                                    <v-row class="mb-2">
                                        <strong class="mr-4">Velocidad de la vía: </strong>
                                        {{ JSON.parse(appStore.currentLog.data).MaxVel }}</v-row>
                                    <v-row class="mb-2">
                                        <strong class="mr-4">Velocidad detectada:</strong>
                                        {{ JSON.parse(appStore.currentLog.data).RealVel }}</v-row>
                                    <v-row class="mb-2">
                                        <strong class="mr-4">Matrícula infracción: </strong>
                                        {{ JSON.parse(appStore.currentLog.data).plate }}</v-row>
                                    <v-row>
                                        <strong class="mr-4">ID Agente: </strong>
                                        {{ JSON.parse(appStore.currentLog.data).idUser }}
                                    </v-row>
                                </v-card>
                                <v-card>
                                    <v-row class="my-4">
                                        <v-card class="imagenRadar rounded-l d-flex justify-center ma-4"
                                            v-for="(slide, i) in appStore.currentLog.images" :key="i">
                                            <v-img :src="`${url}/${appStore.currentLog.imagePath}/${slide}`" cover
                                                @click="selectPhoto(i)" />
                                        </v-card>
                                    </v-row>
                                </v-card>
                                <v-card class="pa-8">
                                    <v-carousel v-model="selectedPhoto" hide-delimiters>
                                        <v-carousel-item v-for="(slide, i) in appStore.currentLog.images" :key="i" cover>
                                            <v-img :src="`${url}/${appStore.currentLog.imagePath}/${slide}`" />
                                        </v-carousel-item>
                                    </v-carousel>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="6">
                                <ol-map style="height: 500px;" :loadTilesWhileAnimating="true"
                                    :loadTilesWhileInteracting="true">
                                    <ol-view ref="view" :center="appStore.currentLog.position.split(',').reverse()"
                                        :rotation="rotation" :zoom="zoom" :projection="projection" />
                                    <ol-tile-layer>
                                        <ol-source-osm />
                                    </ol-tile-layer>
                                    <ol-vector-layer>
                                        <ol-source-vector>
                                            <ol-feature>
                                                <ol-geom-point
                                                    :coordinates="appStore.currentLog.position.split(',').reverse()"></ol-geom-point>
                                                <ol-style>
                                                    <ol-style-circle :radius="radius">
                                                        <ol-style-fill :color="fillColor"></ol-style-fill>
                                                        <ol-style-stroke :color="strokeColor"
                                                            :width="strokeWidth"></ol-style-stroke>
                                                    </ol-style-circle>
                                                    <ol-style-text :text="appStore.currentLog.eventType">
                                                        <ol-style-fill color="white"></ol-style-fill>
                                                    </ol-style-text>
                                                </ol-style>
                                            </ol-feature>
                                            <ol-feature>
                                                <ol-geom-point
                                                    :coordinates="appStore.currentLog.position.split(',').reverse()"></ol-geom-point>
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
            </v-container>
        </v-card>
    </v-container>
</template>

<script setup>
import axios from "axios";
import { computed, ref } from 'vue';
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { useAppStore, useLoadingStore } from '@/store/index';
import veloxHeader from '@/components/veloxHeader.vue'
import { formatDate } from '@/support/helpers/general';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay()
const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loadingStore = useLoadingStore();
const idGroup = computed(() => $route.params.idGroup)
const idLog = computed(() => $route.params.idLog)
const idDevice = computed(() => $route.params.idDevice)
const currentGroup = computed(() => appStore.currentGroup);
const projection = ref("EPSG:4326");
const zoom = ref(10);
const rotation = ref(0);
const radius = ref(10);
const strokeWidth = ref(4);
const strokeColor = ref("blue");
const fillColor = ref("blue");
const selectedPhoto = ref(0);
const url = ref(import.meta.env['VITE_SERVER_BASE_URL']);

const breadcrumbsItems = [
    {
        title: 'Inicio',
        disabled: false,
        to: { name: 'Groups' },
    },
    {
        title: 'Listado de dispositivos',
        disabled: false,
        exact: true,
        to: { name: 'GroupDetail' },
    },
    {
        title: 'Detalles del dispositivo',
        disabled: false,
        to: { name: 'Logs' },
    },
    {
        title: 'Logs',
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
]


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
        const res = await axios.get(`${url}/device/${idDevice.value}`)
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

const selectPhoto = (index) => {
    selectedPhoto.value = index
}

</script>

<style scope>
.imagenRadar {
    width: 50px;
    height: 50px;
    cursor: pointer;
}
</style>
