import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/images',
      name: 'images',
      component: () => import('../views/ImageView/ImageView.vue'),
      children: [
        {
          path: '',
          name: 'image list',
          component: () => import('../views/ImageView/ImageList.vue')
        },
        {
          path: ':id',
          name: 'image details',
          component: () => import('../views/ImageView/ImageDetails.vue')
        }
      ]
    }
  ]
});

export default router;
