<template>
  <div class="min-h-screen py-10 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-black text-[#023047]">Moji projekti</h1>
          <p class="text-gray-400 text-sm mt-1">{{ projects.length }} projekata</p>
        </div>
        <RouterLink
          to="/projects/create"
          class="bg-[#FFB703] text-[#023047] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#FB8500] transition-colors flex items-center gap-2"
        >
          <Plus class="w-4 h-4" /> Novi projekt
        </RouterLink>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="i in 3" :key="i" class="h-52 bg-gray-100 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Projekti -->
      <div v-else-if="projects.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="project in projects"
          :key="project._id"
          class="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-[#8ECAE6] transition-all group"
        >
          <!-- Slika -->
          <div class="h-36 bg-[#8ECAE6]/10 overflow-hidden relative">
            <img
              v-if="project.thumbnail"
              :src="project.thumbnail"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <FolderOpen class="w-8 h-8 text-[#8ECAE6]" />
            </div>
            <!-- Public/Private -->
            <span
              class="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full"
              :class="
                project.isPublic ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-500'
              "
            >
              {{ project.isPublic ? 'Javno' : 'Privatno' }}
            </span>
          </div>

          <!-- Sadrzaj -->
          <div class="p-4">
            <h3 class="font-bold text-[#023047] text-sm mb-1 line-clamp-1">{{ project.title }}</h3>
            <p class="text-gray-400 text-xs line-clamp-2 mb-3">{{ project.description }}</p>

            <!-- Tagovi -->
            <div class="flex flex-wrap gap-1 mb-3">
              <span
                v-for="tag in project.tags?.slice(0, 2)"
                :key="tag"
                class="text-xs bg-[#8ECAE6]/20 text-[#023047] px-2 py-0.5 rounded-full"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Akcije -->
            <div class="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <RouterLink
                :to="`/projects/${project._id}`"
                class="flex-1 text-center text-xs font-medium text-[#023047] px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Pregledaj
              </RouterLink>

              <button
                @click="deleteProject(project._id)"
                class="px-3 py-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
              >
                <Trash2 class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ako nema projekta -->
      <div v-else class="text-center py-24">
        <FolderOpen class="w-14 h-14 text-gray-200 mx-auto mb-4" />
        <h2 class="text-lg font-bold text-gray-300 mb-2">Nemaš još projekata</h2>
        <p class="text-gray-400 text-sm mb-6">
          Objavi svoj prvi projekt i podijeli ga sa zajednicom
        </p>
        <RouterLink
          to="/projects/create"
          class="bg-[#FFB703] text-[#023047] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#FB8500] transition-colors"
        >
          Stvori prvi projekt
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Plus, FolderOpen, FileText, Pencil, Trash2 } from 'lucide-vue-next'
import api from '@/api/axios.js'

const projects = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get('/projects/me')
    projects.value = data.projects
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

async function deleteProject(id) {
  if (!confirm('Jesi li siguran da želiš obrisati projekt?')) return
  try {
    await api.delete(`/projects/${id}`)
    projects.value = projects.value.filter((p) => p._id !== id)
  } catch (e) {
    alert('Greška pri brisanju.')
  }
}
</script>
