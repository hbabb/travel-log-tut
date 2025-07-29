<script setup lang="ts">
const locationsStore = useLocationStore();
const { locations, status } = storeToRefs(locationsStore);

onMounted(() => {
  locationsStore.refresh();
});
</script>

<template>
  <div class="p-4 flex flex-col items-center">
    <h2 class="text-2xl font-bold">
      Locations
    </h2>

    <!-- Pending status shows while database is queried -->
    <div v-if="status === 'pending'">
      <span class="loading loading-ring loading-xl text-primary" />
    </div>

    <!-- Location Cards show only when there are locations in the database for the user -->
    <div v-else-if="locations && locations.length > 0" class="flex flex-wrap mt-4 gap-6">
      <div
        v-for="location in locations"
        :key="location.id"
        class="card w-96 bg-base-200 card-lg shadow-xl rounded-xl"
      >
        <div class="card-body flex flex-col">
          <h3 class="card-title justify-center">
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
