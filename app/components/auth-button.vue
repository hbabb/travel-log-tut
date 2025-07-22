<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <button :disabled="authStore.loading" class="btn bg-black text-white border-black" @click="authStore.signIn">
    <span v-if="authStore.loading" class="loading loading-ring loading-md text-warning" />
    <Icon v-else name="tabler:brand-github" size="24" />
    Sign In With GitHub
  </button>
</template>
