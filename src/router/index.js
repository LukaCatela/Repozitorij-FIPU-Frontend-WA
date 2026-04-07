import CreateProjects from '@/views/CreateProjects.vue'
import DashboardAdmin from '@/views/DashboardAdmin.vue'
import Homepage from '@/views/Homepage.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import Projects from '@/views/Projects.vue'
import Registration from '@/views/Registration.vue'
import Search from '@/views/Search.vue'
import SingleProject from '@/views/SingleProject.vue'
import UserProject from '@/views/UserProject.vue'
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
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/profile',
      name: 'profil',
      component: Profile,
    },

    { path: '/explore', name: 'trazilica', component: Search },

    {
      path: '/projects',
      name: 'Projekt',
      component: Projects,
    },
    {
      path: '/projects/create',
      name: 'NoviProjekt',
      component: CreateProjects,
    },
    {
      path: '/projects/:id',
      name: 'PojediniProjekt',
      component: SingleProject,
    },
    {
      path: '/users/:userId',
      name: 'UserProjects',
      component: UserProject,
    },
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: DashboardAdmin,
    },
  ],
})

export default router
