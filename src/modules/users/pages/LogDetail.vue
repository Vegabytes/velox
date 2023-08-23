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
                            
                        </v-avatar>

                        <v-card-item>
                            <v-card-title>cbvxcvbxcvb</v-card-title>
                            <v-card-subtitle>xcvbxcvbx</v-card-subtitle>
                        </v-card-item>
                    </v-row>
                    <v-btn class="justify-end mr-2" color="primary" variant="" prepend-icon="mdi-arrow-left-thin"
                        @click="toUserPage()">
                        Volver a vista principal</v-btn>
                </v-row>


                <v-card>
                    {{ appStore.currentLog  }}
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

const currentGroup = computed(() => appStore.currentGroup);

const idGroup = computed(() => $route.params.idGroup)
const idCurrentDevice = computed(() => $route.params.idDevice)

const idLog = computed(()=>$route.params.idLog)

onBeforeMount(async () => {
    loadingStore.setLoading(true);
    if (!appStore.getCurrentUser || !appStore.getCurrentUser.name) {
        $router.push(`/${idGroup.value}/login`);
    }
    try {

        if (!appStore.currentGroup || !appStore.currentGroup.id) {
            await getGroupData();
            await getLogData();
        }

    } catch (error) {
        console.error(error);
    } finally {
        loadingStore.setLoading();
    }
});


const getLogData =  async () => {
   const url = import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000'

    try {
        const res = await axios.get(`${url}/log/${idLog.value}`)
        appStore.currentLog = res.data;
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