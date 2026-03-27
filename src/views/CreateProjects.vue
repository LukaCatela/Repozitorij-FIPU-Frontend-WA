<template>
  <div class="min-h-screen bg-white py-10 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <RouterLink
          to="/explore"
          class="text-sm text-gray-400 hover:text-[#023047] transition-colors flex items-center gap-1 mb-4"
        >
          <ArrowLeft class="w-4 h-4" /> Natrag na projekte
        </RouterLink>
        <h1 class="text-2xl font-black text-[#023047]">Novi projekt</h1>
        <p class="text-gray-400 text-sm mt-1">Objavi svoj rad i podijeli ga sa zajednicom</p>
      </div>

      <!-- Forma -->
      <div class="bg-[#8ECAE6]/20 border border-[#8ECAE6] rounded-2xl p-8 space-y-5">
        <!-- Naslov -->
        <div>
          <label class="block text-sm font-medium text-[#023047] mb-1">Naziv projekta *</label>
          <input
            v-model="form.title"
            placeholder="npr. ToDo aplikacija"
            class="w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-colors"
            :class="errors.title ? 'border-red-400' : 'border-[#8ECAE6] focus:border-[#023047]'"
          />
          <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
        </div>

        <!-- Opis -->
        <div>
          <label class="block text-sm font-medium text-[#023047] mb-1">Opis *</label>
          <textarea
            v-model="form.description"
            placeholder="Opiši projekt, tehnologije, rezultate..."
            rows="4"
            class="w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-colors resize-none"
            :class="
              errors.description ? 'border-red-400' : 'border-[#8ECAE6] focus:border-[#023047]'
            "
          ></textarea>
          <p v-if="errors.description" class="text-red-500 text-xs mt-1">
            {{ errors.description }}
          </p>
        </div>

        <!-- Tagovi -->
        <div>
          <label class="block text-sm font-medium text-[#023047] mb-1">Tagovi</label>
          <input
            v-model="form.tags"
            placeholder="Vue, Python, Next.js..."
            class="w-full border border-[#8ECAE6] focus:border-[#023047] rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-colors"
          />
          <p class="text-xs text-gray-400 mt-1">Odvojene zarezom</p>
          <div v-if="tagList.length" class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="tag in tagList"
              :key="tag"
              class="text-xs bg-[#023047] text-white px-3 py-1 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Vidljivost projekta -->
        <div>
          <label class="block text-sm font-medium text-[#023047] mb-2">Vidljivost projekta</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.isPublic = true"
              class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all"
              :class="
                form.isPublic
                  ? 'border-[#023047] bg-[#023047]/5'
                  : 'border-gray-200 hover:border-[#8ECAE6]'
              "
            >
              <Globe class="w-4 h-4" :class="form.isPublic ? 'text-[#023047]' : 'text-gray-400'" />
              <div class="text-left">
                <p
                  class="text-sm font-medium"
                  :class="form.isPublic ? 'text-[#023047]' : 'text-gray-500'"
                >
                  Javno
                </p>
                <p class="text-xs text-gray-400">Svi mogu vidjeti</p>
              </div>
            </button>
            <button
              type="button"
              @click="form.isPublic = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all"
              :class="
                !form.isPublic
                  ? 'border-[#023047] bg-[#023047]/5'
                  : 'border-gray-200 hover:border-[#8ECAE6]'
              "
            >
              <Lock class="w-4 h-4" :class="!form.isPublic ? 'text-[#023047]' : 'text-gray-400'" />
              <div class="text-left">
                <p
                  class="text-sm font-medium"
                  :class="!form.isPublic ? 'text-[#023047]' : 'text-gray-500'"
                >
                  Privatno
                </p>
                <p class="text-xs text-gray-400">Samo ti vidiš</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Image upload -->
        <div>
          <label class="block text-sm font-medium text-[#023047] mb-1">Slike projekta</label>
          <label
            class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#8ECAE6] rounded-xl cursor-pointer hover:border-[#023047] transition-all"
          >
            <div class="flex flex-col items-center gap-2 text-gray-400">
              <span class="text-sm">Klikni za upload slika</span>
              <span class="text-xs">JPG, PNG, WEBP</span>
            </div>
            <input type="file" accept="image/*" multiple class="hidden" @change="handleImage" />
          </label>
        </div>
        <!-- Image previews -->
        <div v-if="imagePreviews.length" class="grid grid-cols-3 gap-2 mt-2">
          <div v-for="(preview, i) in imagePreviews" :key="i" class="relative">
            <img :src="preview" class="w-full h-20 object-cover rounded-lg" />
            <button
              type="button"
              @click="removeImage(i)"
              class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <!-- PDF upload -->
        <div>
          <label class="block text-sm font-medium text-[#023047] mb-1">PDF dokumenti</label>
          <label
            class="flex items-center gap-3 w-full border-2 border-dashed border-[#8ECAE6] rounded-xl px-4 py-4 cursor-pointer hover:border-[#023047] transition-all"
          >
            <span class="text-2xl">📄</span>
            <div>
              <p class="text-sm text-gray-400">Klikni za upload PDF-ova</p>
            </div>
            <input type="file" accept=".pdf" multiple class="hidden" @change="handlePdf" />
          </label>
        </div>

        <!-- PDF lista -->
        <div v-if="pdfNames.length" class="space-y-2 mt-2">
          <div
            v-for="(name, i) in pdfNames"
            :key="i"
            class="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2"
          >
            <div class="flex items-center gap-2">
              <FileText class="w-4 h-4 text-red-400" />
              <span class="text-xs text-gray-600">{{ name }}</span>
            </div>
            <button
              type="button"
              @click="removePdf(i)"
              class="text-red-400 hover:text-red-600 text-xs"
            >
              Ukloni
            </button>
          </div>
        </div>

        <!-- Greska -->
        <p v-if="serverError" class="text-red-500 text-sm">{{ serverError }}</p>

        <!-- Submit -->
        <button
          @click="submit"
          :disabled="loading"
          class="w-full bg-[#FFB703] text-[#023047] py-3 rounded-xl font-bold text-sm hover:bg-[#FB8500] transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Objavljujem...' : 'Objavi projekt' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ArrowLeft, FileText, Globe, Lock } from 'lucide-vue-next'
import api from '@/api/axios'

const router = useRouter()

const form = reactive({ title: '', description: '', tags: '', isPublic: true })
const errors = reactive({})
const serverError = ref('')
const loading = ref(false)

const tagList = computed(() =>
  form.tags
    ? form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [],
)

const imageFiles = ref([])
const imagePreviews = ref([])
const pdfFiles = ref([])
const pdfNames = ref([])

function handleImage(e) {
  const files = Array.from(e.target.files)
  files.forEach((file) => {
    imageFiles.value.push(file)
    imagePreviews.value.push(URL.createObjectURL(file))
  })
}

function handlePdf(e) {
  const files = Array.from(e.target.files)
  files.forEach((file) => {
    pdfFiles.value.push(file)
    pdfNames.value.push(file.name)
  })
}

function removeImage(index) {
  imageFiles.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
}

function removePdf(index) {
  pdfFiles.value.splice(index, 1)
  pdfNames.value.splice(index, 1)
}

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.title) errors.title = 'Naziv je obavezan'
  if (!form.description) errors.description = 'Opis je obavezan'
  return Object.keys(errors).length === 0
}

async function submit() {
  serverError.value = ''
  if (!validate()) return
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('tags', form.tags)
    formData.append('isPublic', form.isPublic)
    imageFiles.value.forEach((file) => formData.append('images', file))
    pdfFiles.value.forEach((file) => formData.append('pdfs', file))

    await api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    router.push('/explore')
  } catch (e) {
    serverError.value = e.response?.data?.error || 'Greška pri objavljivanju.'
  } finally {
    loading.value = false
  }
}
</script>
