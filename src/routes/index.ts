import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/assets',
      name: 'assets',
      component: () => import('@/views/AssetsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/assignment-history',
      name: 'assignment-history',
      component: () => import('@/views/AssetsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/Report'),
      meta: { requiresAuth: true },
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('@/views/LoginView.vue'),
    // },
  ],
})

export default router
