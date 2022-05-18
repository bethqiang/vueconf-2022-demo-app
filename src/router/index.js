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
      component: () => import('../views/ImageList.vue')
    },
    {
      path: '/images/:id',
      name: 'image details',
      component: () => import('../views/ImageDetails.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
});

export default router;
