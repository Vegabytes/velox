<template>
    <v-container>
        <v-card class="d-flex justify-start">
            <v-col>
                <v-card-title class="pa-6">
                <h2 class="text-primary">Nuevo Usuario</h2>
            </v-card-title>
            <v-card-text>
                
                    <form @submit.prevent="submit">


                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field :counter="20" label="Nombre" variant="outlined" color="primary"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field :counter="20" label="Apellidos" variant="outlined" color="primary"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field :counter="20" label="Alias" variant="outlined" color="primary"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field :counter="20" label="Fecha de nacimiento" variant="outlined" color="primary"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <v-text-field :counter="20" label="Dirección" variant="outlined" color="primary"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field :counter="20" label="Correo electrónico" variant="outlined" color="primary"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field :counter="20" label="Teléfono" variant="outlined" color="primary"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-select :items="items" label="Tipo de Usuario" variant="outlined" color="primary"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select :items="items" label="Grupo al que pertenece" variant="outlined" color="primary"></v-select>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <v-textarea :counter="20" label="Descripción" variant="outlined" color="primary"></v-textarea>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <v-btn class="me-4" type="submit" variant="tonal" rounded="xl" size="x-large">
                                    Crear usuario
                                </v-btn>
                            </v-col>
                        </v-row>
                    </form>
            </v-card-text>
            </v-col>
            
        </v-card>
    </v-container>
</template>

<script setup>

import { useAppStore } from '@/store/index';
const appStore = useAppStore()
appStore.showMenu = true



</script>