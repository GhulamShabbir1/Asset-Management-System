import { createRouter, createWebHistory } from 'vue-router'
import pinia from '@/stores'
import { useAuthStore } from '@/stores/authStore'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/',
      component: AuthLayout,
      meta: { requiresAuth: false, guestOnly: true, layout: 'guest' },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/Login.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/Register.vue'),
        },
        {
          path: 'forget-password',
          name: 'forgetPassword',
          component: () => import('@/views/auth/ForgetPassword.vue'),
        },
        {
          path: 'reset-password',
          name: 'resetPassword',
          component: () => import('@/views/auth/ResetPassword.vue'),
        },
        {
          path: 'verify',
          name: 'verify',
          component: () => import('@/views/auth/AccountVerify.vue'),
        },
      ],
    },
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true, layout: 'authenticated' },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'assets',
          name: 'assets',
          component: () => import('@/views/AssetsView.vue'),
        },
        {
          path: 'employees',
          name: 'employees',
          component: () => import('@/views/EmployeeDirectory.vue'),
        },
        {
          path: 'assignment-history',
          name: 'assignment-history',
          component: () => import('@/views/HistoryView.vue'),
        },
        {
          path: 'history',
          name: 'history',
          component: () => import('@/views/HistoryView.vue'),
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/views/ReportsView.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/UserManagement.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/AppSettings.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/404.vue'),
      meta: { requiresAuth: false, guestOnly: false, layout: 'guest' },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore(pinia)

  // Resolve auth exactly once on first navigation to avoid incorrect initial routing.
  if (!authStore.initialized) {
    try {
      await authStore.fetchUser()
    } catch {
      authStore.clearSession()
    }
  }

  const requiresAuth = Boolean(to.meta.requiresAuth)
  const guestOnly = Boolean(to.meta.guestOnly)
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }

  if (guestOnly && isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
})

export default router