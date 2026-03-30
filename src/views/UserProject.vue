<template>
  <div class="min-h-screen py-10 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Loading -->
      <div v-if="loading" class="space-y-6">
        <div class="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="i in 3" :key="i" class="h-52 bg-gray-100 rounded-2xl animate-pulse"></div>
        </div>
      </div>

      <div v-else>
        <!-- User info -->
        <div
          class="flex items-center gap-5 mb-10 p-6 bg-[#8ECAE6]/10 border border-[#8ECAE6]/30 rounded-2xl"
        >
          <div
            class="w-16 h-16 rounded-full overflow-hidden bg-[#8ECAE6] flex items-center justify-center shrink-0"
          >
            <img
              v-if="userProfile?.profilePicture"
              :src="userProfile.profilePicture"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-[#023047] font-black text-xl">
              {{ userProfile?.FirstName?.charAt(0) }}{{ userProfile?.LastName?.charAt(0) }}
            </span>
          </div>
          <div>
            <p class="text-xl font-black text-[#023047]">
              {{ userProfile?.FirstName }} {{ userProfile?.LastName }}
            </p>
            <p class="text-sm text-gray-400">
              {{ userProfile?.department }}
              {{ userProfile?.study_year ? `· ${userProfile.study_year}. godina` : '' }}
            </p>
          </div>
        </div>

        <!-- Projects -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-bold text-[#023047]">
            Projekti <span class="text-gray-400 font-normal">({{ projects.length }})</span>
          </h2>
        </div>

        <div v-if="projects.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <RouterLink
            v-for="project in projects"
            :key="project._id"
            :to="`/projects/${project._id}`"
            class="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-[#8ECAE6] transition-all"
          >
            <div class="h-36 bg-[#8ECAE6]/10 overflow-hidden">
              <img
                v-if="project.thumbnail"
                :src="project.thumbnail"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <FolderOpen class="w-8 h-8 text-[#8ECAE6]" />
              </div>
            </div>

            <div class="p-4">
              <h3
                class="font-bold text-[#023047] text-sm mb-1 line-clamp-1 group-hover:text-[#FFB703] transition-colors"
              >
                {{ project.title }}
              </h3>
              <p class="text-gray-400 text-xs line-clamp-2 mb-3">{{ project.description }}</p>
              <div class="flex flex-wrap gap-1 mb-2">
                <span
                  v-for="tag in project.tags?.slice(0, 2)"
                  :key="tag"
                  class="text-xs bg-[#8ECAE6]/20 text-[#023047] px-2 py-0.5 rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
              <p class="text-xs text-gray-400">{{ formatDate(project.createdAt) }}</p>
            </div>
          </RouterLink>
        </div>

        <div v-else class="text-center py-20">
          <FolderOpen class="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p class="text-gray-400">Ovaj korisnik još nema projekata</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { FolderOpen } from 'lucide-vue-next'
import api from '@/api/axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/hr'

dayjs.extend(relativeTime)
dayjs.locale('hr')

const route = useRoute()
const projects = ref([])
const userProfile = ref(null)
const loading = ref(true)

function formatDate(date) {
  return dayjs(date).fromNow()
}

// mala optimizacija, paralelno se izvrsavaju rute da bude manje cekanja -> zato koristin Promise.all

onMounted(async () => {
  try {
    const [projectsRes, profileRes, userRes] = await Promise.all([
      api.get(`/projects/user/${route.params.userId}`),
      api.get(`/profiles/${route.params.userId}`),
      api.get(`/users/${route.params.userId}`),
    ])
    projects.value = projectsRes.data
    userProfile.value = {
      ...profileRes.data,
      FirstName: userRes.data.FirstName,
      LastName: userRes.data.LastName,
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
