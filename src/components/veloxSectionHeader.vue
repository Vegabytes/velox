<template>

  <v-row class="pt-8 pb-4 ml-2">
    <span class="text-h5 font-weight-bold">{{ props.title }}</span>
  </v-row>
  <v-card variant="flat" color="secondary">
    <v-row>
      <v-col cols="12" md="12" lg="6">
        <v-card-actions v-if="isAdmin" class="d-lg-flex d-md-flex d-block d-sm-block justify-md-center pl-4">
          <v-btn variant="tonal" prepend-icon="mdi-plus" color="primary" @click="newGroup()" class="mb-lg-0 mb-md-0 mb-4">Nuevo
            grupo
          </v-btn>
          <v-btn variant="tonal" prepend-icon="mdi-plus" color="primary" @click="toCreateUser()" class="mb-lg-0 mb-md-0 mb-4">Crear
            Usuario</v-btn>
          <v-btn variant="tonal" prepend-icon="mdi-link" color="primary" @click="toAsignUser()" class="mb-lg-0 mb-md-0 mb-4">Añadir Usuario a
            grupo</v-btn>
        </v-card-actions>
      </v-col>
      <v-col cols="12" md="12" lg="6" class="d-flex justify-lg-end justify-md-center justify-sm-center justify-center">
        <v-breadcrumbs :items="items">
          <template v-slot:prepend>
            <v-icon size="small" icon="mdi-home"></v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
  </v-card>

</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from "vue-router";
import {useAppStore, useLoginStore} from '@/store/index';
const $router = useRouter();
const $route = useRoute();
const appStore = useAppStore()
const loginStore = useLoginStore()

const props = defineProps(['title', 'items'])
const idGroup = computed(() => $route.params.idGroup)
const isAdmin = computed(() => appStore.getIsAdmin);
const currentUser = computed(() => appStore.getCurrentUser);



const newGroup = async () => {
  if (currentUser.value.id) {
    $router.push("NewGroup");
  } else {
    $router.push(`/${idGroup.value}/login`);
  }
}

const toCreateUser = async () => {
  if (loginStore.loggedUser.groupId) {
    $router.push(`/${idGroup.value}/CreateUser`);
  } else {
    $router.push(`/${idGroup.value}/login`);
  }
}

const toAsignUser = () => {
  $router.push(`/${idGroup.value}/asignUser`);
}

const goToGroupDetail = (item) => {
  $router.push(`/${idGroup.value}/groups/groupDetail/${item.id}`);
}


</script>

