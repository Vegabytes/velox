<template>
    <v-container>
        <v-card class="d-flex justify-start">
            <v-card-title class="pa-6">
                <h2>Usuarios</h2>
            </v-card-title>
            <v-card-text>

            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>

import { useAppStore } from '@/store/index';
const appStore = useAppStore()
appStore.showMenu = true


</script>