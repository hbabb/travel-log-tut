<script setup lang="ts">
const locationsStore = useLocationStore();
const { locations, status } = storeToRefs(locationsStore);
const mapStore = useMapStore();

onMounted(() => {
  locationsStore.refresh();
});
</script>

<template>
  <div class="p-4 flex flex-col">
    <h2 class="text-2xl font-bold">
      Locations
    </h2>

    <!-- Pending status shows while database is queried -->
    <div v-if="status === 'pending'">
      <span class="loading loading-ring loading-xl text-primary" />
    </div>

    <!-- Location Cards show only when there are locations in the database for the user -->
    <div v-else-if="locations && locations.length > 0" class="flex flex-nowrap mt-4 gap-6 overflow-auto px-2">
      <div
        v-for="location in locations"
        :key="location.id"
        class="card card-compact bg-base-200 h-32 w-56 shadow-xl rounded-xl shrink-0 hover:cursor-pointer border-2"
        :class="{
          'border-accent': location === mapStore.selectedPoint,
          'border-transparent': location !== mapStore.selectedPoint,
        }"
        @mouseenter="mapStore.selectedPoint = location"
        @mouseleave="mapStore.selectedPoint = null"
      >
        <div class="card-body flex flex-col">
          <h3 class="card-title">
            {{ location.name }}
          </h3>
          <p class="line-clamp-3">
            {{ location.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Add Locations Button shows only if there are no locations in the database -->
    <div v-else class="flex flex-col gap-2 mt-4 justify-center items-center">
      <p>Add a location to get started</p>
      <NuxtLink to="/dashboard/add" class="btn btn-primary w-40">
        Add Location
        <Icon name="tabler:square-rounded-plus-filled" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>
