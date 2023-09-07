<template>
  <v-row>
    <v-col md="1" cols="12" class="d-flex justify-center align-center">
      <v-img class="" max-width="80" src="@/assets/logo.png" />
    </v-col>
    <v-col md="11" cols="12" class="d-flex justify-center py-0">

      <v-img :src="`${path}/${props.path}`" class="align-end rounded-bs-xl"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="150px" cover>
        <v-card-title class="text-white text-h2" v-text="props.name"></v-card-title>
        <v-card-subtitle class="text-white text-h5 mb-4" v-text="props.description"></v-card-subtitle>
      </v-img>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-row class="align-center avatar-user">
            <v-col cols="6" class="pa-0">
              <div class="text-secondary"> {{ appStore.getCurrentUser.name }}</div>
              <div class="text-secondary">Salir<v-icon @click="logout" icon="mdi-exit-to-app pl-3 icono-salir"></v-icon>
              </div>
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-avatar size="50">
                <v-img :src="appStore.currentUser.path" alt="John" v-bind="props"></v-img>
              </v-avatar>
            </v-col>

          </v-row>

        </template>

        <!--         <v-list>
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list> -->
        <v-card class="mx-auto" max-width="344">
          <v-card-text>
            <div>{{ appStore.getCurrentUser.name }} {{ appStore.getCurrentUser.lastName }}</div>
            <p class="text-h4 text--primary mt-4">
              {{ isAdmin ? 'Admin' : 'Usuario' }}
            </p>
            <p>{{ appStore.getCurrentUser.email }}</p>
            <div class="text--primary">
              {{ appStore.getCurrentUser.description }}
            </div>
          </v-card-text>
          <!--           <v-card-actions>
            <v-btn variant="text" color="deep-purple-accent-4">
              Hacer algo
            </v-btn>
          </v-card-actions> -->
        </v-card>


      </v-menu>

    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from '@/store/index';


const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const isAdmin = computed(() => appStore.getIsAdmin);
const idGroup = computed(() => $route.params.idGroup)
const props = defineProps(['path', 'name', 'description'])
const path = ref(import.meta.env['VITE_SERVER_BASE_URL'] || 'http://185.166.213.42:5000');

const items = [
  { title: 'Click Me' },
  { title: 'Click Me' },
  { title: 'Click Me' },
  { title: 'Click Me 2' },
];

const logout = () => $router.push(`/${idGroup.value}/login`);
</script>


<style scope>
.avatar-user {
  width: 10rem;
  position: absolute;
  top: 1rem;
  right: 2rem;
}

.avatar-user img {
  cursor: pointer;
}

.icono-salir {
  cursor: pointer;
}
</style>

