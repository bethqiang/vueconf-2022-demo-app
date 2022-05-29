<script setup>
defineProps({
  label: { type: String, required: true },
  labelClass: { type: String, default: '' }
});
</script>

<template>
  <div class="grid grid-cols-6 mb-2 items-center">
    <div
      :id="label"
      :class="`col-span-2 text-right mr-4 ${labelClass}`"
    >
      {{ label }}:
    </div>
    <div
      :aria-describedby="label"
      class="col col-span-4"
    >
      <slot />
    </div>
  </div>
</template>
