<template>
  <div class="min-h-screen bg-white py-10 px-4">
    <div class="max-w-4xl mx-auto">
      <RouterLink
        to="/explore"
        class="text-sm text-gray-400 hover:text-[#023047] flex items-center gap-1 mb-6 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" /> Natrag
      </RouterLink>

      <div v-if="loading" class="space-y-4">
        <div class="h-8 bg-gray-100 rounded-xl animate-pulse w-2/3"></div>
        <div class="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
      </div>

      <div v-else-if="project">
        <div class="flex items-start justify-between gap-4 mb-4">
          <h1 class="text-3xl font-black text-[#023047]">{{ project.title }}</h1>
          <span
            class="flex shrink-0 text-xs font-semibold px-3 py-1 rounded-full"
            :class="project.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
          >
            {{ project.isPublic ? 'Javno' : 'Privatno' }}
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
          <RouterLink
            :to="`/users/${project.ownerId}`"
            class="flex items-center gap-1 hover:text-[#023047] transition-colors"
          >
            <User class="w-4 h-4" /> {{ ownerName || 'Nepoznat autor' }}
          </RouterLink>
          <span class="flex items-center gap-1">
            <Calendar class="w-4 h-4" /> {{ formatDate(project.createdAt) }}
          </span>
        </div>

        <div v-if="project.tags?.length" class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="text-xs bg-[#8ECAE6]/20 text-[#023047] px-3 py-1 rounded-full font-medium"
          >
            {{ tag }}
          </span>
        </div>

        <div
          v-if="project.thumbnail"
          class="rounded-2xl overflow-hidden mb-6 border border-gray-100"
        >
          <img :src="project.thumbnail" class="w-full object-cover max-h-96" />
        </div>

        <div class="bg-[#8ECAE6]/10 border border-[#8ECAE6]/30 rounded-2xl p-6 mb-6">
          <h2 class="font-bold text-[#023047] mb-3">Opis projekta</h2>
          <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {{ project.description }}
          </p>
        </div>

        <div v-if="media.length" class="mb-6">
          <h2 class="font-bold text-[#023047] mb-3">Datoteke</h2>
          <div class="space-y-2">
            <button
              v-for="file in media"
              :key="file._id"
              @click="downloadFile(file.url, file.originalName, file.type)"
              class="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-[#8ECAE6] transition-colors"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-lg flex items-center justify-center"
                  :class="file.type === 'pdf' ? 'bg-red-50' : 'bg-blue-50'"
                >
                  <FileText v-if="file.type === 'pdf'" class="w-4 h-4 text-red-500" />
                  <ImageIcon v-else class="w-4 h-4 text-blue-500" />
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-[#023047]">{{ file.originalName }}</p>
                  <p class="text-xs text-gray-400">{{ file.type.toUpperCase() }}</p>
                </div>
              </div>
              <Download class="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div v-if="isOwner" class="flex gap-3 pt-4 border-t border-gray-100">
          <button
            @click="deleteProject"
            class="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 class="w-4 h-4" /> Obriši
          </button>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <FolderOpen class="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p class="text-gray-400">Projekt nije pronađen</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  ImageIcon,
  Download,
  Pencil,
  Trash2,
  FolderOpen,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/hr'

dayjs.extend(relativeTime)
dayjs.locale('hr')

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const project = ref(null)
const media = ref([])
const ownerName = ref('')
const loading = ref(true)

const isOwner = computed(
  () =>
    auth.user && project.value && project.value.ownerId?.toString() === auth.user._id?.toString(),
)

function formatDate(date) {
  return dayjs(date).fromNow()
}

async function downloadFile(url, filename, type) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)

    const name =
      type === 'pdf' && !filename.endsWith('.pdf')
        ? filename.replace(/\.[^.]+$/, '') + '.pdf'
        : filename
    link.download = name
    link.click()
    URL.revokeObjectURL(link.href)
  } catch (e) {
    console.error('Download failed:', e)
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get(`/projects/${route.params.id}`)
    project.value = data
    ownerName.value = project.value.authorName

    try {
      const mediaRes = await api.get(`/media/${route.params.id}`)
      media.value = mediaRes.data
    } catch {}
  } catch {
    project.value = null
  } finally {
    loading.value = false
  }
})

async function deleteProject() {
  if (!confirm('Jesi li siguran?')) return
  try {
    await api.delete(`/projects/${project.value._id}`)
    router.push('/explore')
  } catch {
    alert('Greška pri brisanju.')
  }
}
</script>
