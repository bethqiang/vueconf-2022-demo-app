<script setup>
import { reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import imagesApi from '@/api/images';
import favoritesApi from '@/api/favorites';
import votesApi from '@/api/votes';
import { formatBreeds, voted } from '@/utils';
import DetailsRow from '@/components/DetailsRow.vue';
import useFavoritesStore from '@/stores/favorites';
import useVotesStore from '@/stores/votes';

const favoritesStore = useFavoritesStore();
const votesStore = useVotesStore();

const state = reactive({
  image: null
});

const route = useRoute();

onMounted(async () => {
  const response = await imagesApi.findById(route.params.id);
  state.image = response.data;
  console.log(favoritesStore._favorites);
  console.log(votesStore._votes);
});

const favorite = computed(() => {
  return state.image?.include_favorite === 1;
});

const upvoted = computed(() => {
  return state.image?.include_vote === 1;
});

const downvoted = computed(() => {
  return state.image?.include_vote === 0;
});

async function handleFavorite () {
  await favoritesApi.favorite({ image_id: route.params.id });
  const response = await imagesApi.findById(route.params.id);
  state.image = response.data;
}

async function handleUpvote () {
  await votesApi.vote({ image_id: route.params.id });
  const response = await imagesApi.findById(route.params.id);
  state.image = response.data;
}

function handleDownvote () {

}
</script>

<template>
  <template v-if="state.image">
    <h1 class="mb-12">{{ `Image ${state.image.id}` }}</h1>
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
          <NewButton
            variant="secondary"
            small
            @click="handleFavorite"
          >
            <Heart :class="['w-6 h-6', { 'text-coral-500': favorite }]"/>
          </NewButton>
          <span class="text-sm ml-2">{{ favorite ? 'Favorited' : 'Not Favorited' }}</span>
        </div>
      </DetailsRow>
      <DetailsRow
        label="Vote"
        label-class="text-gray-500 font-medium text-left text-sm"
      >
        <div class="flex items-center">
          <NewButton
            :variant="upvoted ? 'success' : 'secondary'"
            small
            @click="handleUpvote"
          >
            <Check class="w-6 h-6"/>
          </NewButton>
          <NewButton
            :variant="downvoted ? 'error' : 'secondary'"
            small
            class="ml-2"
            @click="handleDownvote"
          >
            <Close class="w-6 h-6"/>
          </NewButton>
          <span class="text-sm ml-2">
            {{ voted() }}
          </span>
        </div>
      </DetailsRow>
    </Card>
  </template>
</template>
