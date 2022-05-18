<script setup>
import { RouterView } from 'vue-router';
import NavMain from '@/components/NavMain.vue';
</script>

<template>
  <div class="flex flex-nowrap h-screen">
    <NavMain class="basis-56 grow-0" />
    <main class="basis-0 grow m-8">
      <RouterView />
    </main>
  </div>
</template>
