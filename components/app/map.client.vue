<script setup lang="ts">
import { CENTER_USA } from "~/lib/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() =>
  colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty");
const zoom = 3;

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_USA"
    :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <div
          class="tooltip tooltip-top tooltip-warning hover:cursor-pointer"
          :data-tip="point.name"
          :class="{
            'tooltip-open': mapStore.selectedPoint === point,
          }"
          @mouseenter="mapStore.selectedPointWithoutFlyTo(point)"
          @mouseleave="mapStore.selectedPointWithoutFlyTo(null)"
        >
          <Icon
            name="tabler:map-pin-filled"
            size="32"
            class="text-info"
            :class="mapStore.selectedPoint === point ? 'text-warning' : 'text-info'"
          />
        </div>
      </template>
      <MglPopup>
        <h3 class="text-xl">
          {{ point.label }}
        </h3>
        <p v-if="point.description">
          {{ point.description }}
        </p>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
