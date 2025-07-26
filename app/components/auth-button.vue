<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div v-if="!authStore.loading && authStore.user" class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn m-1 rounded-xl"
    >
      <div v-if="authStore.user.image" class="avatar">
        <div class="w-8 rounded-full">
          <img :src="authStore.user.image" :alt="authStore.user.name">
        </div>
      </div>
      {{ authStore.user.name }}
    </div>
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
      <li>
        <NuxtLink to="/sign-out" class="text-black dark:bg-neutral-300 dark:border-neutral-300">
          <Icon name="tabler:logout-2" size="24" />
          Sign Out
        </NuxtLink>
      </li>
    </ul>
  </div>
  <button
    v-else
    :disabled="authStore.loading"
    class="btn bg-black text-white border-black rounded-xl"
    @click="authStore.signIn"
  >
    <span v-if="authStore.loading" class="loading loading-ring loading-md text-warning" />
    <Icon
      v-else
      name="tabler:brand-github"
      size="24"
    />
    Sign In With GitHub
  </button>
</template>
