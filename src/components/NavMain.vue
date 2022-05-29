<script setup>
import NavItem from './NavItem.vue';
import iconHome from '@/assets/icons/icon-home.png';
import iconFolderSearch from '@/assets/icons/icon-folder-search.png';
</script>

<template>
  <nav class="bg-white-100 border-r-2 border-white-300 h-screen">
    <ul>
      <NavItem
        to="/"
        :iconSrc="iconHome"
        iconAltText="Home icon"
        title="Home"
      />
      <NavItem
        to="/images"
        :iconSrc="iconFolderSearch"
        iconAltText="Folder with a magnifying glass icon"
        title="Images"
      />
    </ul>
  </nav>
</template>