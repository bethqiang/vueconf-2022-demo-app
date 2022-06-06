<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { imagesApi, favoritesApi, votesApi } from '@/api';
import { formatBreeds } from '@/utils';
import DetailsRow from '@/components/DetailsRow.vue';
import useFavoritesStore from '@/stores/favorites';
import useVotesStore from '@/stores/votes';

const favoritesStore = useFavoritesStore();
const votesStore = useVotesStore();

const state = reactive({
  loading: true,
  error: null,
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
    state.error = err.message;
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
    <template v-if="!state.loading">
      <Alert
        v-if="state.error"
        variant="error"
      >
        {{ state.error}}
      </Alert>
      <div
        v-if="state.image"
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
                variant="secondary"
                size="small"
                :class="[{ '!text-white !border-coral-700 !bg-coral-700': state.favorite }]"
                @click="handleFavorite"
              >
                <Heart class="w-6 h-6"/>
                <span class="sr-only">Favorite</span>
              </LobButton>
              <LobButton
                variant="secondary"
                size="small"
                class="ml-2"
                :disabled="!state.favorite"
                @click="handleDeleteFavorite"
              >
                <Trash class="w-6 h-6"/>
                <span class="sr-only">Delete Favorite</span>
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
                variant="secondary"
                size="small"
                :class="[{ '!text-white !border-mint-700 !bg-mint-700': state.vote === 1 }]"
                @click="() => handleVote(1)"
              >
                <Check class="w-6 h-6"/>
                <span class="sr-only">Upvote</span>
              </LobButton>
              <LobButton
                variant="secondary"
                size="small"
                :class="['ml-2', { '!text-white !border-lemon-700 !bg-lemon-700': state.vote === 0 }]"
                @click="() => handleVote(0)"
              >
                <Close class="w-6 h-6"/>
                <span class="sr-only">Downvote</span>
              </LobButton>
              <span class="text-sm ml-2">
                {{ hasVoted(state.vote) }}
              </span>
            </div>
          </DetailsRow>
        </Card>
      </div>
    </template>
  </LoadingIndicator>
</template>
