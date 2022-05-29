<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const props = defineProps({
  to: { type: String, required: true },
  iconSrc: { type: String, required: true },
  iconAltText: { type: String, required: true },
  title: { type: String, required: true }
});

const active = computed(() => `/${route.path.split('/')[1]}` === props.to);
</script>

<template>
  <li class="list-none">
    <RouterLink
      :to="props.to"
      :class="[
        'py-4 px-6 flex items-center',
        { 'font-medium underline bg-white-300': active }
      ]"
    >
      <img
        :src="props.iconSrc"
        :alt="props.iconAltText"
        class="w-6 align-bottom"
      >
      <span class="pl-4">{{ props.title }}</span>
    </RouterLink>
  </li>
</template>