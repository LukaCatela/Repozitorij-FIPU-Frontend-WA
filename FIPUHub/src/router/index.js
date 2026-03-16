import Homepage from '@/views/Homepage.vue'
import Registration from '@/views/Registration.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Homepage,
    },
    {
      path: '/register',
      name: 'register',
      component: Registration,
    },
  ],
})

export default router
