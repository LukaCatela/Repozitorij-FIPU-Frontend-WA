<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Profile-->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <!-- Cover slika -->
        <div class="h-24 bg-linear-to-r from-[#8ECAE6] to-[#023047]"></div>

        <!-- ikona + ime -->
        <div class="px-6 pb-6">
          <div class="flex items-end justify-between -mt-10 mb-4">
            <!-- ikona -->
            <div class="relative">
              <div
                class="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-[#c5ebfd] flex items-center justify-center shadow-md"
              >
                <img
                  v-if="profile.profilePicture"
                  :src="profile.profilePicture"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-[#023047] font-black text-2xl">
                  {{ auth.user?.name?.charAt(0) }}{{ auth.user?.last_name?.charAt(0) }}
                </span>
              </div>
              <!-- Upload botun -->
              <label
                class="absolute bottom-0 right-0 w-6 h-6 bg-[#FFB703] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FB8500] transition-colors shadow"
              >
                <Camera class="w-3 h-3 text-[#023047]" />
                <input type="file" accept="image/*" class="hidden" @change="uploadPhoto" />
              </label>
            </div>

            <!-- Edit botun -->
            <button
              @click="editing = !editing"
              class="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-[#023047] hover:bg-gray-50 transition-colors"
            >
              <Pencil class="w-4 h-4" />
              {{ editing ? 'Odustani' : '' }}
            </button>
          </div>

          <!-- ime & rola -->
          <h1 class="text-xl font-black text-[#023047]">
            {{ auth.user?.name }} {{ auth.user?.last_name }}
          </h1>
          <div class="flex items-center gap-2 mt-1">
            <span
              class="text-xs font-semibold px-2 py-0.5 rounded-full"
              :class="{
                'bg-[#FFB703]/20 text-[#023047]': auth.user?.role === 'student',
                'bg-[#8ECAE6]/30 text-[#023047]': auth.user?.role === 'profesor',
                'bg-gray-100 text-gray-500': auth.user?.role === 'gost',
              }"
            >
              {{ auth.user?.role }}
            </span>
            <span v-if="profile.department" class="text-sm text-gray-400">{{
              profile.department
            }}</span>
            <span v-if="profile.study_year" class="text-sm text-gray-400"
              >· {{ profile.study_year }}. godina</span
            >
          </div>
          <p v-if="profile.bio && !editing" class="text-sm text-gray-500 mt-3 leading-relaxed">
            {{ profile.bio }}
          </p>
        </div>
      </div>

      <!-- Edit Form -->
      <div
        v-if="editing"
        class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4"
      >
        <h2 class="font-bold text-[#023047] text-lg">Uredi profil</h2>

        <!-- Bio -->
        <div>
          <label class="block text-sm font-medium text-[#023047] mb-1">Bio</label>
          <textarea
            v-model="form.bio"
            placeholder="Kratki opis o sebi..."
            rows="3"
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#8ECAE6] transition-colors resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- godina studiranja -->
          <div>
            <label class="block text-sm font-medium text-[#023047] mb-1">Godina studija</label>
            <select
              v-model="form.study_year"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#8ECAE6] transition-colors bg-white"
            >
              <option value="">Odaberi</option>
              <option value="1">1. godina prijediplomski</option>
              <option value="2">2. godina prijediplomski</option>
              <option value="3">3. godina prijediplomski</option>
              <option value="4">1. godina diplomski</option>
              <option value="5">2. godina diplomski</option>
            </select>
          </div>

          <!-- Fakultet -->
          <div>
            <label class="block text-sm font-medium text-[#023047] mb-1">Smjer</label>
            <input
              v-model="form.department"
              placeholder="npr. Informatika"
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#8ECAE6] transition-colors"
            />
          </div>
        </div>

        <!-- Skills setovi -->
        <div>
          <label class="block text-sm font-medium text-[#023047] mb-1">Vještine</label>
          <input
            v-model="form.skill"
            placeholder="npr. Vue, Python, GIS..."
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#8ECAE6] transition-colors"
          />
          <p class="text-xs text-gray-400 mt-1">Odvojene zarezom</p>
        </div>

        <!-- Social -->
        <div>
          <label class="block text-sm font-medium text-[#023047] mb-1">LinkedIn / GitHub</label>
          <input
            v-model="form.social"
            placeholder="https://linkedin.com/in/..."
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#8ECAE6] transition-colors"
          />
        </div>

        <!-- Error / Success -->
        <p v-if="serverError" class="text-red-500 text-sm">{{ serverError }}</p>
        <p v-if="successMsg" class="text-green-500 text-sm">{{ successMsg }}</p>

        <!-- Save -->
        <button
          @click="saveProfile"
          :disabled="saving"
          class="w-full bg-[#FFB703] text-[#023047] py-3 rounded-xl font-bold text-sm hover:bg-[#FB8500] transition-colors disabled:opacity-50"
        >
          {{ saving ? 'Spremanje...' : 'Spremi promjene' }}
        </button>
      </div>

      <!-- Info Cards (view mode) -->
      <div v-if="!editing" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Skills -->
        <div v-if="profile.skill" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 class="text-sm font-bold text-[#023047] mb-3 flex items-center gap-2">
            <Zap class="w-4 h-4 text-[#FFB703]" /> Vještine
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in skillList"
              :key="skill"
              class="text-xs bg-[#8ECAE6]/20 text-[#023047] px-3 py-1 rounded-full font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Social -->
        <div
          v-if="profile.social"
          class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
        >
          <h3 class="text-sm font-bold text-[#023047] mb-3 flex items-center gap-2">
            <Link2 class="w-4 h-4 text-[#FFB703]" /> Linkovi
          </h3>
          <a
            :href="profile.social"
            target="_blank"
            class="text-sm text-[#8ECAE6] hover:text-[#023047] transition-colors break-all"
          >
            {{ profile.social }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Camera, Pencil, Zap, Link2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.js'
import api_axios from '@/api/axios.js'

const auth = useAuthStore()
const editing = ref(false)
const saving = ref(false)
const serverError = ref('')
const successMsg = ref('')

const profile = reactive({
  bio: '',
  study_year: '',
  department: '',
  skill: '',
  social: '',
  profilePicture: null,
})

const form = reactive({
  bio: '',
  study_year: '',
  department: '',
  skill: '',
  social: '',
})

const skillList = computed(() =>
  profile.skill
    ? profile.skill
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [],
)

onMounted(async () => {
  try {
    const { data } = await api_axios.get('/profiles/me')
    Object.assign(profile, data)
    Object.assign(form, {
      bio: data.bio || '',
      study_year: data.study_year || '',
      department: data.department || '',
      skill: data.skill || '',
      social: data.social || '',
    })
  } catch (e) {
    if (e.response?.status === 404) {
      await api_axios.post('/profile')
    } else {
      serverError.value = 'Greska pri dohvatu podataka.'
    }
  }
})

async function saveProfile() {
  serverError.value = ''
  successMsg.value = ''
  saving.value = true
  try {
    const { data } = await api_axios.put('/profiles/me', form)
    Object.assign(profile, data)
    successMsg.value = 'Profil uspjesno spremljen!'
    editing.value = false
  } catch (e) {
    console.log(e.response?.status)
    console.log(e.response?.data)
    serverError.value = e.response?.data?.message || 'Greska pri spremanju.'
  } finally {
    saving.value = false
  }
}

async function uploadPhoto(event) {
  const file = event.target.files[0]
  if (!file) return
  console.log('file selected:', file.name)
  const formData = new FormData()
  formData.append('photo', file)
  try {
    const { data } = await api_axios.post('/profiles/img', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    console.log('response:', data)
    profile.profilePicture = data.profilePicture
    if (auth.user) {
      auth.user.profilePicture = data.profilePicture
      localStorage.setItem('user', JSON.stringify(auth.user))
    }
  } catch (e) {
    console.log('upload error:', e.response?.status, e.response?.data)
    serverError.value = 'Greska pri uploadu slike.'
  }
}
</script>
