<script setup>
import { reactive, computed, onMounted } from 'vue';
import { imagesApi } from '@/api';
import { useRouter, useRoute } from 'vue-router';
import { formatBreeds, isEmptyObject } from '@/utils';

// API paging is zero-based but pagination component is one-based, so that's why there's some funky math going on

const PAGE_SIZE = 10;

const router = useRouter();
const route = useRoute();

const state = reactive({
  loading: true,
  error: null,
  images: [],
  count: 0,
  currentPage: 1
});

const INITIAL_PARAMS = {
  limit: PAGE_SIZE,
  order: 'asc'
};

const routeQuery = computed(() => route.query);

onMounted(async () => {
  const query = routeQuery.value;
  let page = 0;
  if (!isEmptyObject(query) && query.page) {
    state.currentPage = Number(query.page);
    page = query.page;
  }
  try {
    const response = await imagesApi.findAll({ ...INITIAL_PARAMS, page });
    state.images = response.data;
    state.count = response.count;
  } catch (err) {
    state.error = err.message;
  } finally {
    state.loading = false;
  }
});

function goToDetails (id) {
  router.push(`/images/${id}`);
}

async function handlePageChange ({ page }) {
  state.loading = true;
  state.currentPage = page;
  try {
    if (state.currentPage === 1) {
      router.push(`${route.path}`);
    } else {
      router.push(`${route.path}?page=${state.currentPage}`);
    }
    const response = await imagesApi.findAll({ ...INITIAL_PARAMS, page: state.currentPage - 1 });
    state.images = response.data;
  } catch (err) {
    state.error = err.message;
  } finally {
    state.loading = false;
  }
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
        </TableHeader>
        <TableBody>
          <template
            v-for="image in state.images"
            :key="image.id"
          >
            <TableRow
              class="hover:shadow rounded-md cursor-pointer border-b-white-300 border-b last:border-0 hover:text-black text-sm"
              :data-testId="`row-${image.id}`"
              @click="goToDetails(image.id)"
            >
              <div>
                <img :src="image.url" class="h-20" />
              </div>
              <div class="max-w-xs py-2 truncate fs-exclude">
                {{ formatBreeds(image.breeds) }}
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
  </LoadingIndicator>
</template>
