<template>
  <v-container class="h-screen d-flex align-md-center justify-center">
    <v-col>
      <v-row class="d-flex justify-center align-center">
        <v-card elevation="8" min-width="448" rounded="lg" class="pa-12">
          <v-card-item class="pt-8">
            <v-card-title>
              <div class="text-h3"> Error 405</div>
            </v-card-title>
            <v-card-title class="mt-1">
              <div> No autorizado</div>
            </v-card-title>
            <v-card-subtitle class="mt-9">
              <div class="text-h5">
                Actualmente no está autorizado para ver esta página.
                Gracias.
              </div>
            </v-card-subtitle>
          </v-card-item>
          <v-card-item class="text-right">
            <v-btn class="rounded-lg" color="error" type="submit" @click="goToLogin" :disabled="calling">
              Ir a login
            </v-btn>
          </v-card-item>
        </v-card>
      </v-row>
    </v-col>
  </v-container>
</template>

<script setup>

import { useAppStore } from '@/store/index';
import { useRoute, useRouter } from "vue-router";

const $router = useRouter();

const goToLogin = () => {
  $router.push("/1/login");
}

</script>
<style scoped>
.v-card-subtitle {
  white-space: inherit;
}
</style>


