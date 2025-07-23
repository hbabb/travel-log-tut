<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppNavBar />
    <main>
      <slot />
    </main>
  </div>
</template>
