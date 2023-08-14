<template>
  <v-app-bar flat :elevation="2">
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>
      <h2 class="text-primary">Velox</h2>
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn size="small" icon="mdi-theme-light-dark" @click="toggleTheme" />
      <v-btn size="small" icon="mdi-logout " @click="logout"></v-btn>
      <!--       <v-avatar color="primary" size="x-small"
        src="https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg">
        32
      </v-avatar> -->
      <!-- <v-avatar size="50px" radius="10px">
        <img src="https://www.figma.com/community/plugin/739659977030056719/icon">
      </v-avatar> -->
      <v-avatar color="secondary" size="default">
        <v-img :src="currentUser.path" alt="user"></v-img>
      </v-avatar>

    </template>
  </v-app-bar>

  <!--   <v-navigation-drawer v-model="drawer" temporary>
    <span class="my-4">
      <v-row class="d-flex justify-center mt-6">
        <v-avatar color="secondary" size="large">
          <v-img v-if="appStore.currentUser.path" :src="appStore.currentUser.path" alt="user"></v-img>
        </v-avatar>
      </v-row>
      <v-row class="d-flex justify-center">
        <h4 class="pt-1">{{ appStore.currentUser.name }} {{ ' ' }} {{ appStore.currentUser.lastName }}</h4>
      </v-row>
      <v-row class="d-flex justify-center">
        <span class="text-subtitle-3 text-medium-emphasis">{{ user.status }}</span>
      </v-row>
    </span>

    <v-list class="mt-6" density="compact" nav>
      <v-list-item prepend-icon="mdi-account-plus" title="Nuevo usuario" value="newUser"></v-list-item>
      <v-list-item prepend-icon="mdi-view-dashboard" title="Asignar grupos de usuarios" value="AsignGroups"></v-list-item>
      <v-list-item prepend-icon="mdi-view-dashboard" title="Asignar usuario a grupo" value="AsignUserGroup"></v-list-item>
      <v-list-item prepend-icon="mdi-view-dashboard" title="Asignar grupo a otro grupo"
        value="AsignGroupGroup"></v-list-item>
      <v-list-item prepend-icon="mdi-view-dashboard" title="Asignar grupo cliente a dispositivo"
        value="AsignClienteDispositivo"></v-list-item>
      <v-list-item prepend-icon="mdi-tablet-cellphone" title="Dispositivos" value="Dispositivos"></v-list-item>
    </v-list>
  </v-navigation-drawer> -->
</template>

<script setup>

import { useRoute, useRouter } from "vue-router";
import { ref, computed } from 'vue'
import { useAppStore } from '@/store/index';
const appStore = useAppStore()

import { useTheme } from 'vuetify'
const theme = useTheme()

const toggleTheme = () => theme.global.name.value = theme.global.current.value.dark ? 'customLightTheme' : 'customDarkTheme'

const $router = useRouter();
const $route = useRoute();

let drawer = ref(false)

const props = defineProps({
  user: Object
});

const currentUser = computed(() => appStore.getCurrentUser);

const logout = async () => {
  try {
    //const user = await loginService.logout();
    const to = $route.query.to?.toString();
    $router.push(to || "/");
  }
  catch (err) {
    console.log(err);
  }
}

</script>

<style scoped></style>

