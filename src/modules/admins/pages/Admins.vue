<template>
    <v-container>
        <v-card color="onPrimary" variant="flat">
            <v-card-text>

                <v-row>
                    <v-col cols="12" md="4">
                        <v-card  class="pa-8" color="surface">
                            <div class="mb-8">
                                <v-row class="d-flex justify-center mb-2">
                                    <v-avatar color="primary" size="large">
                                        <span class="text-h5" v-if="!appStore.currentUser.path">JD</span>
                                        <v-img
                                            v-if="appStore.currentUser.path"
                                            :src="appStore.currentUser.path"
                                            alt="John"
                                        ></v-img>
                                    </v-avatar>
                                </v-row>
                                <v-row class="d-flex justify-center">
                                    <h2 class="mr-2 text-primary">{{ appStore.currentUser.name }}</h2> <h2 class="text-primary">{{ appStore.currentUser.lastName }}</h2>
                                </v-row>
                                <v-row class="d-flex justify-center">
                                    <span class="text-subtitle-3 text-medium-emphasis capitalize-text">{{ appStore.currentUser.status }}</span>
                                </v-row>
                            </div>

                            <div class="d-flex justify-center">
                                <v-btn 
                                    variant="tonal"
                                    color="primary"
                                    rounded="xl" 
                                    size="small"
                                    :prepend-icon="(mostrarInfo)?'mdi-minus':'mdi-plus'"
                                    @click="mostrarInfo = !mostrarInfo"> 
                                        {{(mostrarInfo)?'Ocultar información':'Mostrar más información'}}
                                </v-btn>
                            </div>

                            <div v-if="mostrarInfo" class="py-6 mt-6">
                                <v-row class="mb-2">
                                    <v-text-field v-model="appStore.currentUser.email" flat="true" label="Correo electrónico"
                                        :readonly="true"></v-text-field>
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

                        <v-row>
                            <v-col cols="12" md="4"  v-for="item in options">
                                <v-card>

                                    <v-img
                                        :src="item.path"
                                        class="align-end"
                                        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                        height="200px"
                                        cover
                                        >
                                        
                                        <v-card-item>
                                        <v-card-title class="text-white">{{ item.title  }}</v-card-title>
                                        <v-card-subtitle class="text-white">{{ item.description }}</v-card-subtitle>
                                    </v-card-item>
                                        </v-img>

                                    <v-card-actions>
                                        <v-btn append-icon="mdi-chevron-right">Ir </v-btn>
                                    </v-card-actions>
                                    
                                    
                                </v-card>
                            </v-col>
                        </v-row>

                        
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


const options = ref([
    {
        title:'Asignar grupos de usuarios',
        description:' Loren ipsum dolor bla bla bla',
        path:'https://www.donwordpress.com/blog/wp-content/uploads/2019/07/usuarios-wordpress-1024x475.jpg'
    },
    {
        title:'Asignar usuario a grupo',
        description:' Loren ipsum dolor bla bla bla',
        path:'https://www.donwordpress.com/blog/wp-content/uploads/2019/07/usuarios-wordpress-1024x475.jpg'
    },
    {
        title:'Asignar grupo a otro grupo',
        description:' Loren ipsum dolor bla bla bla',
        path:'https://www.donwordpress.com/blog/wp-content/uploads/2019/07/usuarios-wordpress-1024x475.jpg'
    },
    {
        title:'Asignar grupo cliente a dispositivos',
        description:' Loren ipsum dolor bla bla bla',
        path:'https://img.freepik.com/vector-premium/dispositivos-dispositivos-electronicos-realistas-isometria-vector-ilustracion-isometrica-dispositivos_480270-27.jpg'
    },
    {
        title:'Dispositivos',
        description:' Loren ipsum dolor bla bla bla',
        path:'https://img.freepik.com/vector-premium/dispositivos-dispositivos-electronicos-realistas-isometria-vector-ilustracion-isometrica-dispositivos_480270-27.jpg'
    },

])



</script>

<style scope>

</style>
