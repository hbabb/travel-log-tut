<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <section class="hero bg-base-300 container mx-auto mt-4 rounded-2xl shadow-xl">
    <article class="hero-content text-center min-h-96">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">
          Travel Log
        </h1>
        <p class="py-6">
          Keep track of your travels and adventures with this simple travel log app. Add locations, photos, and notes to create a digital journal of your journeys.
        </p>
        <AuthButton v-if="!authStore.user" />
        <NuxtLink
          v-else
          to="/dashboard"
          class="btn btn-lg btn-primary rounded-xl"
        >
          Start Logging
        </NuxtLink>
      </div>
    </article>
  </section>
</template>
