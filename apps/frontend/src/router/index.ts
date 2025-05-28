const VBaseView = () => import('@/views/VBaseView.vue');
const VBookListView = () => import('@/views/VBookListView.vue');
const VBookView = () => import('@/views/VBookView.vue');

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: VBaseView,
      redirect: { name: 'books' },
      children: [
        {
          path: '/books',
          name: 'books',
          component: VBookListView,
        },
        {
          path: '/books/:bookId',
          name: 'book',
          component: VBookView,
        },
      ],
    },
  ],
});

export default router;
