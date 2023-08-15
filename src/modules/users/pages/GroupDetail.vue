<template>
  <v-container>
    <v-card variant="flat">

      <!--       <v-img :src="appStore.currentGroup.path" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="150px" cover>

        <v-card-title class="text-white text-h2" v-text="appStore.currentGroup.name"></v-card-title>
        <v-card-subtitle class="text-white text-h5 mb-4" v-text="appStore.currentGroup.description"></v-card-subtitle>

      </v-img> -->

      <v-card-text>
        <v-row>

          <v-card class="mb-8" variant="flat">
            <v-card-title>
              <v-row class="py-2">
                <v-col cols="12">
                  <p class="text-h5 font-weight-bold">Mis subgrupos de dispositivos</p>
                </v-col>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>
          </v-card>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>



</script>
