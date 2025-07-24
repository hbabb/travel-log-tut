<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { AppFormField } from "#components";

import { InsertLocation } from "~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await $csrfFetch("/api/locations", {
      method: "POST",
      body: values,
    });
    submitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = error.statusMessage || "An unknown error occurred!";
  }
  loading.value = false;
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will be lost!");
    if (!confirm) {
      return false;
    }
  }
  return true;
});
</script>

<template>
  <div class="container max-w-md mx-auto mt-4">
    <div class="my-4">
      <h1 class="text-lg">
        ADD LOCATION
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <!-- Error Alert -->
    <div
      v-if="submitError"
      role="alert"
      class="alert alert-error"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ submitError }}</span>
    </div>
    <!-- Location Form -->
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <!-- Name Field -->
      <AppFormField
        name="name"
        label="Name"
        :error="errors.name"
        :disabled="loading"
      />

      <!-- Description Field -->
      <AppFormField
        name="description"
        label="Description"
        type="textarea"
        :errors="errors.name"
        :disabled="loading"
      />

      <!-- Latitude Field -->
      <AppFormField
        name="lat"
        label="Latitude"
        :error="errors.lat"
        :disabled="loading"
      />

      <!-- Longitude Field -->
      <AppFormField
        name="long"
        label="Longitude"
        :error="errors.long"
        :disabled="loading"
      />

      <!-- Buttons -->
      <div class="flex justify-end gap-2">
        <!-- Cancel Button -->
        <button
          :disabled="loading"
          type="button"
          class="btn btn-outline w-1/3"
          @click="router.back"
        >
          <Icon name="tabler:arrow-left" size="24" />
          Cancel
        </button>

        <!-- Submit Button -->
        <button
          :disabled="loading"
          type="submit"
          class="btn btn-primary w-1/3"
        >
          Add
          <span v-if="loading" class="loading loading-infinity text-info loading-xl" />
          <Icon
            v-else
            name="tabler:square-rounded-plus-filled"
            size="24"
          />
        </button>
      </div>
    </form>
  </div>
</template>
