<script setup>
import { onMounted } from 'vue';
import imagesApi from '@/api/images';

let images = [];

onMounted(async () => {
  images = await imagesApi.findAll();
  console.log(images);
});
</script>

<template>
  <h1>All Images</h1>
</template>
