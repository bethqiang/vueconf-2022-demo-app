<script setup>
import { reactive, onMounted } from 'vue';
import imagesApi from '@/api/images';
import { useRouter } from 'vue-router';
import { formatBreeds, hasVoted } from '@/utils';

// API paging is zero-based but pagination component is one-based, so that's why there's some funky math going on

const PAGE_SIZE = 10;

const router = useRouter();

const state = reactive({
  images: [],
  count: 0,
  currentPage: 1
});

const INITIAL_PARAMS = {
  limit: PAGE_SIZE,
  order: 'asc'
};

onMounted(async () => {
  const response = await imagesApi.findAll({ ...INITIAL_PARAMS, page: 0 });
  state.images = response.data;
  state.count = response.count;
});

function goToDetails (id) {
  router.push(`/images/${id}`);
}

function favorited (include_favorite) {
  if (include_favorite === 1) {
    return 'Favorited';
  } else {
    return 'Not Favorited';
  }
}

async function handlePageChange ({ page }) {
  state.currentPage = page;
  const response = await imagesApi.findAll({ ...INITIAL_PARAMS, page: state.currentPage - 1 });
  state.images = response.data;
}
</script>

<template>
  <h1 class="mb-12">All Images</h1>
  <LobTable
    class="min-w-full border-b border-gray-100 divide-y divide-gray-100 mb-8"
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
        <TableRow
          class="hover:shadow rounded-md cursor-pointer border-b-white-300 border-b last:border-0 hover:text-black text-sm"
          @click="goToDetails(image.id)"
        >
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
            {{ hasVoted(image.include_vote) }}
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
  <Pagination
    v-if="state.images.length"
    :collection="state.images"
    :page="state.currentPage"
    :limit="PAGE_SIZE"
    :total="Number(state.count)"
    @change="handlePageChange"
  />
</template>
