import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ============= ROOT REDIRECT =============
    {
      path: '/',
      redirect: '/dashboard',
    },

    // ============= AUTH ROUTES (NO AUTH REQUIRED) =============
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { requiresAuth: false, layout: 'AuthLayout' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/Register.vue'),
      meta: { requiresAuth: false, layout: 'AuthLayout' },
    },
    {
      path: '/forget-password',
      name: 'forgetPassword',
      component: () => import('@/views/auth/ForgetPassword.vue'),
      meta: { requiresAuth: false, layout: 'AuthLayout' },
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: () => import('@/views/auth/ResetPassword.vue'),
      meta: { requiresAuth: false, layout: 'AuthLayout' },
    },
    {
      path: '/verify',
      name: 'verify',
      component: () => import('@/views/auth/AccountVerify.vue'),
      meta: { requiresAuth: false, layout: 'AuthLayout' },
    },

    // ============= PROTECTED ROUTES (AUTH REQUIRED) =============
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, layout: 'DefaultLayout' },
    },
    {
      path: '/assets',
      name: 'assets',
      component: () => import('@/views/AssetsView.vue'),
      meta: { requiresAuth: true, layout: 'DefaultLayout' },
    },

    // ============= 404 NOT FOUND =============
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/404.vue'),
      meta: { requiresAuth: false, layout: 'AuthLayout' },
    },
    {
      path: '/assignment-history',
      name: 'assignment-history',
      component: () => import('@/views/HistoryView.vue'),
      meta: { requiresAuth: true, layout: 'DefaultLayout' },
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/HistoryView.vue'),
      meta: { requiresAuth: true, layout: 'DefaultLayout' },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/ReportsView.vue'),
      meta: { requiresAuth: true, layout: 'DefaultLayout' },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UserManagement.vue'),
      meta: { requiresAuth: true, layout: 'DefaultLayout' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/AppSettings.vue'),
      meta: { requiresAuth: true, layout: 'DefaultLayout' },
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('@/views/LoginView.vue'),
    // },
  ],
})

// ============= NAVIGATION GUARD =============
// Protect routes that require authentication
router.beforeEach((to, from) => {
  const isAuthenticated = !!localStorage.getItem('auth_token') // Check if user is logged in

  // If route requires auth but user is not logged in, redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  // If user is logged in and tries to access login/register, redirect to dashboard
  else if (!to.meta.requiresAuth && isAuthenticated && (to.name === 'login' || to.name === 'register')) {
    return { name: 'dashboard' }
  }
  // Otherwise proceed normally (return undefined)
})

export default router
