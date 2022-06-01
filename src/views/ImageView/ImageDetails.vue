<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import imagesApi from '@/api/images';
import favoritesApi from '@/api/favorites';
import votesApi from '@/api/votes';
import { formatBreeds } from '@/utils';
import DetailsRow from '@/components/DetailsRow.vue';
import useFavoritesStore from '@/stores/favorites';
import useVotesStore from '@/stores/votes';

const favoritesStore = useFavoritesStore();
const votesStore = useVotesStore();

const state = reactive({
  loading: true,
  image: null,
  favorite: false,
  vote: undefined,
});

const route = useRoute();

function formatVote () {
  // every vote is an entry (rather than the previous entry being overridden), so only get your most recent one
  const votes = votesStore.votes.filter(({ image_id }) => image_id === state.image.id);
  const mostRecentVote = votes[votes.length - 1];
  return mostRecentVote?.value;
}

function hasVoted (vote) {
  if (vote === 1) {
    return 'Upvoted';
  } else if (vote === 0) {
    return 'Downvoted';
  } else {
    return 'Not Voted';
  }
}

function isFavorited () {
  return favoritesStore.favorites.find(({ image_id }) => image_id === state.image.id);
}

onMounted(async () => {
  try {
    const response = await imagesApi.findById(route.params.id);
    state.image = response.data;
    // even though the API documentation says this info is included in the response ... it's not ...
    state.favorite = isFavorited();
    state.vote = formatVote();
  } catch (err) {
    // do something
  } finally {
    state.loading = false;
  }
});

async function handleFavorite () {
  await favoritesApi.favorite({ image_id: route.params.id });
  updateFavorites();
}

async function handleDeleteFavorite () {
  // it's possible to have multiple favorite entries on the same photo... so that's fun...
  const favorites = favoritesStore.favorites.filter(({ image_id }) => image_id === state.image.id);
  const allFavorites = [];
  favorites.forEach((favorite) => allFavorites.push(favoritesApi.delete(favorite.id)));
  await Promise.all(allFavorites);
  updateFavorites();
}

async function updateFavorites () {
  const response = await favoritesApi.findAll();
  favoritesStore.set(response.data);
  state.favorite = isFavorited();
}

async function handleVote (value) {
  await votesApi.vote({ image_id: route.params.id, value });
  const response = await votesApi.findAll();
  votesStore.set(response.data);
  state.vote = formatVote();
}
</script>

<template>
  <LoadingIndicator>
    <div
      v-if="state.image && !state.loading"
      class="flex flex-col items-center"
    >
      <h2 class="mb-12">{{ `Image ${state.image.id}` }}</h2>
      <img
        v-if="state.image"
        :src="state.image.url"
        class="h-96"
      />
      <Card class="w-[500px] mt-8">
        <DetailsRow
          label="Breeds"
          label-class="text-gray-500 font-medium text-left text-sm my-2"
        >
          <span class="text-sm">
            {{ formatBreeds(state.image.breeds) }}
          </span>
        </DetailsRow>
        <DetailsRow
          label="Favorite"
          label-class="text-gray-500 font-medium text-left text-sm"
        >
          <div class="flex items-center">
            <LobButton
              :variant="state.favorite ? 'error' : 'secondary'"
              size="small"
              @click="handleFavorite"
            >
              <Heart class="w-6 h-6"/>
            </LobButton>
            <LobButton
              variant="secondary"
              size="small"
              class="ml-2"
              :disabled="!state.favorite"
              @click="handleDeleteFavorite"
            >
              <Trash class="w-6 h-6"/>
            </LobButton>
            <span class="text-sm ml-2">{{ state.favorite ? 'Favorited' : 'Not Favorited' }}</span>
          </div>
        </DetailsRow>
        <DetailsRow
          label="Vote"
          label-class="text-gray-500 font-medium text-left text-sm"
        >
          <div class="flex items-center">
            <LobButton
              :variant="state.vote === 1 ? 'success' : 'secondary'"
              size="small"
              @click="() => handleVote(1)"
            >
              <Check class="w-6 h-6"/>
            </LobButton>
            <LobButton
              :variant="state.vote === 0 ? 'error' : 'secondary'"
              size="small"
              class="ml-2"
              @click="() => handleVote(0)"
            >
              <Close class="w-6 h-6"/>
            </LobButton>
            <span class="text-sm ml-2">
              {{ hasVoted(state.vote) }}
            </span>
          </div>
        </DetailsRow>
      </Card>
    </div>
  </LoadingIndicator>
</template>
