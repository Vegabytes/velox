<template>
  <v-row>
    <v-col :cols="mobile ? 2 : 1" class="d-flex justify-center align-center pa-0">
      <v-img class="mt-3" :max-width="mobile ? '40' : '70'" src="@/assets/logo.png" style="cursor: pointer"
        @click="irHome()" />
    </v-col>
    <v-col :cols="mobile ? 10 : 11" class="d-flex justify-center pa-0">

      <v-img :src="`${path}/${props.path}`" class="align-end rounded-bs-xl" style="cursor: pointer" @click="irHome()"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" :height="mobile ? '100px' : '200px'" cover>
        <v-card-title class="text-white text-lg-h3 text-h5 mb-1" v-text="props.name"></v-card-title>
        <v-card-subtitle class="text-white text-h7   mb-4" v-text="props.description"></v-card-subtitle>
      </v-img>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-row class="align-center justify-center avatar-user">
            <v-col class="pa-0">
              <v-avatar :size="mobile ? 35 : 45">
                <v-img :src="`${path}/${appStore.getCurrentUser.path}`" :alt="appStore.getCurrentUser.path"
                  v-bind="props"></v-img>
              </v-avatar>
              <!--               <div class="text-secondary text-subtitle-2"> {{ appStore.getCurrentUser.name }}</div> -->
            </v-col>


          </v-row>

        </template>
        <v-card class="mx-auto" max-width="344">
          <v-card-text>
            <div>{{ appStore.getCurrentUser.name }} {{ appStore.getCurrentUser.lastName }}</div>
            <p class="text-h6 text--primary mt-4">
              Rol: {{ isAdmin ? 'Admin' : 'Usuario' }}
            </p>
            <p>{{ appStore.getCurrentUser.email }}</p>
            <div class="text--primary">
              {{ appStore.getCurrentUser.description }}
            </div>


            <div class="text-right">Cerrar sesión
              <v-btn class="ma-2" variant="text" icon="mdi-logout" color="black" @click="logout"></v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from '@/store/index';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay()
const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const isAdmin = computed(() => appStore.getIsAdmin);
const idGroup = computed(() => $route.params.idGroup)
const props = defineProps(['path', 'name', 'description'])
const path = ref(import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000');

const logout = () => $router.push(`/${idGroup.value}/login`);
const irHome = () => $router.push(`/${idGroup.value}/groups`);

</script>


<style scope>
.avatar-user {
  width: 12rem;
  position: absolute;
  top: 2rem;
  right: 2rem;
  text-align: right;
}

.avatar-user img {
  cursor: pointer;
}

.icono-salir {
  cursor: pointer;
}
</style>

