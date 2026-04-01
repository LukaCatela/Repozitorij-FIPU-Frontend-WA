<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <!--<RouterLink to="/" class="inline-flex items-center gap-2">
          <img src="/logo_crni.png" alt="FipuGO Logo" class="h-10 w-auto" />
        </RouterLink>-->
        <h1 class="text-4xl font-bold text-[#FFB703]">Izradi račun</h1>
        <p class="text-[#8ECAE6] text-sm mt-1">Pridruži se FIPU zajednici</p>
      </div>

      <!-- Forma box -->
      <div class="bg-[#8ECAE6]/20 border border-[#8ECAE6] rounded-2xl p-8 space-y-4">
        <!-- redak Ime i prezime -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-bold text-[#023047] mb-1">Ime</label>
            <input
              v-model="form.FirstName"
              placeholder="npr. Marko"
              class="w-full border border-[#8ECAE6] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#023047] bg-white transition-colors"
            />
            <p v-if="errors.FirstName" class="text-red-500 text-xs mt-1">{{ errors.FirstName }}</p>
          </div>
          <div>
            <label class="block text-sm font-bold text-[#023047] mb-1">Prezime</label>
            <input
              v-model="form.LastName"
              placeholder="npr. Horvat"
              class="w-full border border-[#8ECAE6] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#023047] bg-white transition-colors"
            />
            <p v-if="errors.LastName" class="text-red-500 text-xs mt-1">{{ errors.LastName }}</p>
          </div>
        </div>

        <!-- redak Email -->
        <div>
          <label class="block text-sm font-bold text-[#023047] mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="npr. mhorvat@student.unipu.hr"
            class="w-full border border-[#8ECAE6] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#023047] bg-white transition-colors"
          />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
        </div>

        <!-- Lozinka -->
        <div>
          <label class="block text-sm font-bold text-[#023047] mb-1">Lozinka</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Minimalno 8 znakova"
              class="w-full border border-[#8ECAE6] rounded-xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-[#023047] bg-white transition-colors"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#023047]"
            >
              <Eye v-if="!showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
        </div>

        <!-- Student checkbox -->
        <label class="flex items-center gap-3 cursor-pointer">
          <input v-model="form.isStudent" type="checkbox" class="w-4 h-4 accent-[#FFB703]" />
          <span class="text-sm text-[#023047] font-medium">Ja sam student</span>
        </label>

        <!-- jmbg -->
        <div v-if="form.isStudent">
          <label class="block text-sm font-bold text-[#023047] mb-1">JMBG</label>
          <input
            v-model="form.jmbg"
            placeholder="1234567890123"
            maxlength="15"
            class="w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-colors"
            :class="errors.jmbg ? 'border-red-400' : 'border-[#8ECAE6] focus:border-[#023047]'"
          />
          <p v-if="errors.jmbg" class="text-red-500 text-xs mt-1">{{ errors.jmbg }}</p>
        </div>

        <!-- Server error -->
        <p v-if="serverError" class="text-red-500 text-sm text-center">{{ serverError }}</p>

        <!-- Submit -->
        <button
          @click="submit"
          :disabled="loading"
          class="w-full bg-[#FFB703] text-[#023047] py-3 rounded-xl font-bold text-sm hover:bg-[#FB8500] transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Pričekaj...' : 'Registriraj se' }}
        </button>
      </div>

      <!-- Login link -->
      <p class="text-center text-[#8ECAE6] text-sm mt-6">
        Vec imaš račun?
        <RouterLink
          to="/login"
          class="text-[#FFB703] font-semibold hover:text-[#FFB703] transition-colors ml-1"
          >Prijavi se</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Eye, EyeOff } from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  FirstName: '',
  LastName: '',
  email: '',
  password: '',
  jmbg: '',
  isStudent: false,
})

const errors = reactive({})
const serverError = ref('')
const loading = ref(false)
const showPassword = ref(false)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.FirstName) {
    errors.FirstName = 'Obavezno ispunit'
  } else if (form.FirstName.length <= 2) {
    errors.FirstName = 'Mora sadrzavat vise od 2 znaka'
  }

  if (!form.LastName) {
    errors.LastName = 'Obavezno ispunit'
  } else if (form.LastName.length <= 2) {
    errors.LastName = 'Mora sadrzavat vise od 2 znaka'
  }

  if (!form.email) errors.email = 'Obavezno'
  if (!emailRegex.test(form.email)) errors.email = 'Email mora imat strukturu user@user.user'
  if (!form.password || form.password.length < 8) errors.password = 'Minimalno 8 znakova'

  // samo ako student označi da je student
  if (form.isStudent) {
    if (!form.jmbg) {
      errors.jmbg = 'JMBG je obavezan za studente'
    } else if (form.jmbg.length !== 10) {
      errors.jmbg = 'JMBG mora sadrzavati 10 brojeva'
    } else if (!/^\d+$/.test(form.jmbg)) {
      errors.jmbg = 'JMBG moraju biti samo brojevi'
    }
  }
  return Object.keys(errors).length === 0
}

async function submit() {
  serverError.value = ''
  if (!validate()) return
  loading.value = true
  try {
    await auth.register(
      form.FirstName,
      form.LastName,
      form.email,
      form.password,
      form.isStudent ? 'student' : 'gost',
      form.isStudent ? form.jmbg : undefined,
    )
    router.push('/')
  } catch (e) {
    if (e.response?.data?.errors) {
      serverError.value = e.response.data.errors.map((err) => err.msg).join(', ')
    } else {
      serverError.value = e.response?.data?.error || 'Greška.'
    }
  } finally {
    loading.value = false
  }
}
</script>
