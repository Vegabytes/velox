<template>
    <v-app-bar color="secondary" prominent>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>
            <h3>Velox</h3>
        </v-toolbar-title>

    </v-app-bar>

    <v-navigation-drawer v-model="drawer" color="secondary" temporary>
        <v-list-item class="mt-6" prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
            title="John Doe"></v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-view-dashboard" title="Dispositivos" value="dispositivos"></v-list-item>
            <!--<v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item>-->
        </v-list>
    </v-navigation-drawer>
</template>
  
<script setup>

import router from '@/router';
import { ref } from 'vue'

let drawer = ref(false)

</script>
  
<style scoped></style>
  
  