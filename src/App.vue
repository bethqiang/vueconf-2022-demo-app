<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import NavMain from '@/components/NavMain.vue';
import { favoritesApi, votesApi } from '@/api';
import useFavoritesStore from '@/stores/favorites';
import useVotesStore from '@/stores/votes';

const favoritesStore = useFavoritesStore();
const votesStore = useVotesStore();

onMounted(async () => {
  const [favorites, votes] = await Promise.all([
    favoritesApi.findAll(),
    votesApi.findAll()
  ]);
  favoritesStore.set(favorites.data);
  votesStore.set(votes.data);
});
</script>

<template>
  <div class="flex flex-nowrap">
    <NavMain class="basis-56 grow-0" />
    <main class="basis-0 grow m-8">
      <RouterView />
    </main>
  </div>
</template>
