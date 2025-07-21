<!-- <script lang="ts" setup>
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(value) {
    colorMode.preference = value ? "dark" : "light";
  },
});
</script>
v-model="isDark"
-->

<template>
  <label class="swap swap-rotate mx-4">
    <!-- this hidden checkbox controls the state -->
    <input type="checkbox" class="theme-controller" value="business">

    <!-- sun icon -->
    <Icon class="swap-off" name="tabler:sun" size="24" />

    <!-- moon icon -->
    <Icon class="swap-on" name="tabler:moon-filled" size="24" />
  </label>
</template>
