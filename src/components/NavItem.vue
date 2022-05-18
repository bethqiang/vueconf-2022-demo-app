<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  to: { type: String, required: true },
  iconSrc: { type: String, required: true },
  iconAltText: { type: String, required: true },
  title: { type: String, required: true }
});
</script>

<template>
  <li class="list-none">
    <RouterLink
      :to="to"
      class="py-4 px-6 flex items-center"
      active-class="font-medium underline bg-white-300"
    >
      <img
        :src="iconSrc"
        :alt="iconAltText"
        class="w-6 align-bottom"
      >
      <span class="pl-4">{{ title }}</span>
    </RouterLink>
  </li>
</template>