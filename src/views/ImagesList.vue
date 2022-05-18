<script setup>
import { reactive, onMounted } from 'vue';
import imagesApi from '@/api/images';

const state = reactive({
  images: []
});

onMounted(async () => {
  state.images = await imagesApi.findAll();
});

function formatBreeds (breeds) {
  if (breeds.length) {
    const breedsArr = breeds.map(({ name }) => name);
    return breedsArr.join(', ');
  } else {
    return 'Unknown';
  }
}

function favorited (include_favorite) {
  if (include_favorite === 1) {
    return 'Favorited';
  } else {
    return 'Not Favorited';
  }
}

function voted (include_vote) {
  if (include_vote === 1) {
    return 'Liked';
  } else if (include_vote === 0) {
    return 'Disliked';
  } else {
    return 'Not Voted';
  }
}
</script>

<template>
  <h1>All Images</h1>
  <LobTable
    class="min-w-full border-b border-gray-100 divide-y divide-gray-100"
    space="md"
  >
    <TableHeader class="text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
      <div class="w-4">
        Thumbnail
      </div>
      <div>
        Breed
      </div>
      <div>
        Favorited
      </div>
      <div>
        Voted
      </div>
    </TableHeader>
    <TableBody>
      <template
        v-for="image in state.images"
        :key="image.id"
      >
        <TableRow class="hover:shadow rounded-md cursor-pointer border-b-white-300 border-b last:border-0 hover:text-black text-sm">
          <div>
            <img :src="image.url" class="h-20" />
          </div>
          <div class="max-w-xs py-2 truncate fs-exclude">
            {{ formatBreeds(image.breeds) }}
          </div>
          <div
            class="py-2 fs-exclude"
          >
            {{ favorited(image.include_favorite) }}
          </div>
          <div class="py-2">
            {{ voted(image.include_vote) }}
          </div>
          <div class="flex justify-end py-2">
            <ChevronRight
              class="w-4 h-4"
            />
          </div>
        </TableRow>
      </template>
    </TableBody>
  </LobTable>
</template>
