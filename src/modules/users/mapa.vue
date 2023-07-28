<template>
  <ol-map
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    style="height: 500px;width: 500px;"
  >
    <ol-view
      ref="view"
      :center="position"
      :rotation="rotation"
      :zoom="zoom"
      :projection="projection"
    />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>
    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature>
          <ol-geom-point :coordinates="position"></ol-geom-point>
          <ol-style>
            <ol-style-stroke color="red" :width="2"></ol-style-stroke>
            <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
            <ol-style-icon :src="markerIcon" :scale="0.1"></ol-style-icon>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
  </ol-map>
</template>

<script setup>
import { ref,computed } from "vue";
import { useAppStore } from '@/store/index';
import markerIcon from "@/assets/marker.png";
const appStore = useAppStore()

const props = defineProps(['position'])

const position = computed(()=>{return appStore.devicePosition})

const center = ref([-3.7025600, 40.4165000]);
const projection = ref("EPSG:4326");
const zoom = ref(10);
const rotation = ref(0);
</script>