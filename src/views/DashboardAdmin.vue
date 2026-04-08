<template>
  <div class="min-h-screen py-10 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-black text-[#023047]">Admin Panel</h1>
        <p class="text-gray-400 text-sm mt-1">Upravljanje korisnicima i projektima</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white/80 border border-gray-200 rounded-2xl p-5 text-center"
        >
          <div class="text-3xl font-black text-[#FFB703]">{{ stat.value }}</div>
          <div class="text-xs text-gray-400 mt-1 font-medium">{{ stat.label }}</div>
        </div>
      </div>

      <div class="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
        <button
          @click="activeTab = 'users'"
          class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
          :class="
            activeTab === 'users'
              ? 'bg-white text-[#023047] shadow-sm'
              : 'text-gray-400 hover:text-[#023047]'
          "
        >
          Korisnici ({{ users.length }})
        </button>
        <button
          @click="activeTab = 'projects'"
          class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
          :class="
            activeTab === 'projects'
              ? 'bg-white text-[#023047] shadow-sm'
              : 'text-gray-400 hover:text-[#023047]'
          "
        >
          Projekti ({{ projects.length }})
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="h-14 bg-white/60 rounded-xl animate-pulse"></div>
      </div>

      <!-- USERS Tablica -->
      <div
        v-else-if="activeTab === 'users'"
        class="bg-white/80 border border-gray-200 rounded-2xl overflow-hidden"
      >
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Korisnik
              </th>
              <th
                class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Uloga
              </th>
              <th
                class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Registriran
              </th>
              <th class="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full bg-[#8ECAE6]/30 flex items-center justify-center text-xs font-bold text-[#023047]"
                  >
                    {{ user.FirstName?.charAt(0) }}{{ user.LastName?.charAt(0) }}
                  </div>
                  <span class="text-sm font-medium text-[#023047]"
                    >{{ user.FirstName }} {{ user.LastName }}</span
                  >
                </div>
              </td>
              <td class="px-5 py-3 text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-5 py-3">
                <span
                  class="text-xs font-semibold px-2 py-1 rounded-full"
                  :class="{
                    'bg-red-100 text-red-600': user.role === 'admin',
                    'bg-[#FFB703]/20 text-[#023047]': user.role === 'student',
                    'bg-[#8ECAE6]/20 text-[#023047]': user.role === 'profesor',
                    'bg-gray-100 text-gray-500': user.role === 'gost',
                  }"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-5 py-3 text-sm text-gray-400">{{ formatDate(user.createdAt) }}</td>
              <td class="px-5 py-3">
                <button
                  @click="deleteUser(user._id)"
                  class="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!users.length" class="text-center py-10 text-gray-400 text-sm">
          Nema korisnika
        </div>
      </div>

      <!-- PROJECTS Tablica -->
      <div v-else class="bg-white/80 border border-gray-200 rounded-2xl overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Projekt
              </th>
              <th
                class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Autor
              </th>
              <th
                class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Datum
              </th>
              <th class="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="project in projects"
              :key="project._id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[#8ECAE6]/20 overflow-hidden flex shrink-0">
                    <img
                      v-if="project.thumbnail"
                      :src="project.thumbnail"
                      class="w-full h-full object-cover"
                    />
                    <FolderOpen v-else class="w-4 h-4 text-[#8ECAE6] m-2" />
                  </div>
                  <span class="text-sm font-medium text-[#023047] line-clamp-1">{{
                    project.title
                  }}</span>
                </div>
              </td>
              <td class="px-5 py-3 text-sm text-gray-500">
                {{ project.authorName || 'Nepoznat' }}
              </td>
              <td class="px-5 py-3">
                <span
                  class="text-xs font-semibold px-2 py-1 rounded-full"
                  :class="
                    project.isPublic ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                  "
                >
                  {{ project.isPublic ? 'Javno' : 'Privatno' }}
                </span>
              </td>
              <td class="px-5 py-3 text-sm text-gray-400">{{ formatDate(project.createdAt) }}</td>
              <td class="px-5 py-3 flex items-center gap-1">
                <RouterLink
                  :to="`/projects/${project._id}`"
                  class="text-gray-400 hover:text-[#023047] p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Eye class="w-4 h-4" />
                </RouterLink>
                <button
                  @click="deleteProject(project._id)"
                  class="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!projects.length" class="text-center py-10 text-gray-400 text-sm">
          Nema projekata
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Trash2, Eye, FolderOpen } from 'lucide-vue-next'
import api from '@/api/axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/hr'

dayjs.extend(relativeTime)
dayjs.locale('hr')

const activeTab = ref('users')
const users = ref([])
const projects = ref([])
const loading = ref(true)

const stats = computed(() => [
  { value: users.value.length, label: 'Ukupno korisnika' },
  { value: users.value.filter((u) => u.role === 'student').length, label: 'Studenata' },
  { value: projects.value.length, label: 'Projekata' },
  { value: projects.value.filter((p) => p.isPublic).length, label: 'Javnih projekata' },
])

function formatDate(date) {
  return dayjs(date).fromNow()
}

onMounted(async () => {
  try {
    const [usersRes, projectsRes] = await Promise.all([api.get('/users'), api.get('/projects')])
    users.value = usersRes.data.users ?? usersRes.data
    projects.value = projectsRes.data.projects ?? projectsRes.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

async function deleteUser(id) {
  if (!confirm('Obrisati korisnika?')) return
  try {
    await api.delete(`/users/${id}`)
    users.value = users.value.filter((u) => u._id !== id)
  } catch (e) {
    alert('Greška pri brisanju.')
  }
}

async function deleteProject(id) {
  if (!confirm('Obrisati projekt?')) return
  try {
    await api.delete(`/projects/${id}`)
    projects.value = projects.value.filter((p) => p._id !== id)
  } catch (e) {
    alert('Greška pri brisanju.')
  }
}
</script>
