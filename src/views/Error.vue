<template>
  <v-container class="h-screen d-flex align-center justify-center">
    <v-col>
      <v-row class="d-flex justify-center">
        <v-card elevation="8" min-width="448" rounded="lg" class="pa-12">
          <v-card-item class="pt-8">
            <v-card-title>
              <span class="text-h3"> Información </span>
            </v-card-title>
            <v-card-subtitle>
              <span class="text-h5">
                Para continuar es necesario iniciar sesión en uno de los grupos predetermiados.
                Gracias.
              </span>
            </v-card-subtitle>
          </v-card-item>
          <v-card-item class="text-right">
            <v-btn class="rounded-lg" color="primary" type="submit" @click="goToLogin" :disabled="calling">
              iniciar sesión
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
