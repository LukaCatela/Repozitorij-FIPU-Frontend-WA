<template>
  <div class="min-h-screen bg-white py-10 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-black text-[#023047]">Istraži projekte</h1>
          <p class="text-gray-400 text-sm mt-1">{{ total }} projekata objavljeno</p>
        </div>
        <RouterLink
          v-if="auth.isLoggedIn"
          to="/projects/create"
          class="bg-[#FFB703] text-[#023047] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#FB8500] transition-colors flex items-center gap-2"
        >
          <Plus class="w-4 h-4" /> Novi projekt
        </RouterLink>
      </div>

      <!-- Search + filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-8">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="search"
            @input="onSearch"
            placeholder="Pretraži projekte..."
            class="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#8ECAE6] transition-colors"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="tag in popularTags"
            :key="tag"
            @click="filterTag(tag)"
            class="px-3 py-2 rounded-xl text-xs font-medium border transition-colors"
            :class="
              activeTag === tag
                ? 'bg-[#023047] text-white border-[#023047]'
                : 'border-gray-200 text-gray-500 hover:border-[#8ECAE6]'
            "
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-gray-100 rounded-2xl h-64 animate-pulse"></div>
      </div>

      <!-- Projects grid -->
      <div v-else-if="projects.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="project in projects"
          :key="project._id"
          :to="`/projects/${project._id}`"
          class="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#8ECAE6] transition-all"
        >
          <!-- Image -->
          <div class="h-40 bg-[#8ECAE6]/20 overflow-hidden">
            <img
              v-if="project.image"
              :src="project.image"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <FolderOpen class="w-10 h-10 text-[#8ECAE6]" />
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">
            <h3
              class="font-bold text-[#023047] text-sm mb-2 line-clamp-2 group-hover:text-[#FFB703] transition-colors"
            >
              {{ project.title }}
            </h3>
            <p class="text-gray-400 text-xs line-clamp-2 mb-3">{{ project.description }}</p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1 mb-3">
              <span
                v-for="tag in project.tags?.slice(0, 3)"
                :key="tag"
                class="text-xs bg-[#8ECAE6]/20 text-[#023047] px-2 py-0.5 rounded-full"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between text-xs text-gray-400">
              <span>{{ formatDate(project.createdAt) }}</span>
              <div class="flex items-center gap-1">
                <FileText v-if="project.pdf" class="w-3 h-3" />
              </div>
            </div>
          </div>
        </RouterLink>
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-20">
        <FolderOpen class="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p class="text-gray-400">Nema projekata</p>
        <RouterLink
          v-if="auth.isLoggedIn"
          to="/projects/create"
          class="text-[#FFB703] font-medium text-sm hover:underline mt-2 inline-block"
        >
          Budi prvi koji objavi →
        </RouterLink>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-10">
        <button
          @click="changePage(page - 1)"
          :disabled="page === 1"
          class="px-4 py-2 rounded-xl border border-gray-200 text-sm hover:border-[#8ECAE6] disabled:opacity-40 transition-colors"
        >
          ←
        </button>
        <button
          v-for="p in totalPages"
          :key="p"
          @click="changePage(p)"
          class="px-4 py-2 rounded-xl border text-sm transition-colors"
          :class="
            p === page
              ? 'bg-[#023047] text-white border-[#023047]'
              : 'border-gray-200 hover:border-[#8ECAE6]'
          "
        >
          {{ p }}
        </button>
        <button
          @click="changePage(page + 1)"
          :disabled="page === totalPages"
          class="px-4 py-2 rounded-xl border border-gray-200 text-sm hover:border-[#8ECAE6] disabled:opacity-40 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Search, Plus, FolderOpen, FileText } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const auth = useAuthStore()
const projects = ref([])
const total = ref(0)
const loading = ref(false)
const search = ref('')
const activeTag = ref('')
const page = ref(1)

const totalPages = computed(() => Math.ceil(total.value / 12))

const popularTags = ['Vue', 'Python', 'React', 'Machine Learning', 'C++']

function formatDate(date) {
  return dayjs(date).fromNow()
}

async function fetchProjects() {
  loading.value = true
  try {
    const params = { page: page.value }
    if (search.value) params.search = search.value
    if (activeTag.value) params.tag = activeTag.value
    const { data } = await api.get('/projects', { params })
    projects.value = data.projects
    total.value = data.total
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

let searchTimeout
function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchProjects()
  }, 400)
}

function filterTag(tag) {
  activeTag.value = activeTag.value === tag ? '' : tag
  page.value = 1
  fetchProjects()
}

function changePage(p) {
  page.value = p
  fetchProjects()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(fetchProjects)
</script>
