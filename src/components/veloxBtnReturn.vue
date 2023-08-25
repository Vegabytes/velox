<template>
  <v-btn class="justify-end mr-2" color="primary" variant="" prepend-icon="mdi-arrow-left-thin" @click="toUserPage()">
    Volver</v-btn>
</template>

<script setup>

import { useRouter } from "vue-router";

const $router = useRouter();

const toUserPage = () => {
    $router.go(-1)
}
</script>