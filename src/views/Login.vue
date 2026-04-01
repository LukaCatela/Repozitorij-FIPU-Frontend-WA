<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-[#FFB703] mt-4">Dobrodošao nazad</h1>
        <p class="text-[#8ECAE6] text-sm mt-1">Prijavi se na svoj račun</p>
      </div>

      <!-- Forma box -->
      <div class="bg-[#8ECAE6]/20 border border-[#8ECAE6] rounded-2xl p-8 space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-[#023047] mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="marko@student.unipu.hr"
            class="w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-colors"
            :class="errors.email ? 'border-red-400' : 'border-[#8ECAE6] focus:border-[#023047]'"
          />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
        </div>

        <!-- Lozinka -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-medium text-[#023047]">Lozinka</label>
            <a href="#" class="text-xs text-[#8ECAE6] hover:text-[#023047] transition-colors"
              >Zaboravljena lozinka?</a
            >
          </div>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Tvoja lozinka"
              class="w-full border rounded-xl px-4 py-2.5 pr-10 text-sm outline-none bg-white transition-colors"
              :class="
                errors.password ? 'border-red-400' : 'border-[#8ECAE6] focus:border-[#023047]'
              "
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

        <!-- Server error -->
        <p v-if="serverError" class="text-red-500 text-sm text-center">{{ serverError }}</p>

        <!-- Submit -->
        <button
          @click="submit"
          :disabled="loading"
          class="w-full bg-[#FFB703] text-[#023047] py-3 rounded-xl font-bold text-sm hover:bg-[#FB8500] transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Pričekaj...' : 'Prijavi se' }}
        </button>
      </div>

      <!-- Registracija link -->
      <p class="text-center text-gray-400 text-sm mt-6">
        Nemaš račun?
        <RouterLink
          to="/register"
          class="text-[#023047] font-semibold hover:text-[#FFB703] transition-colors ml-1"
          >Registriraj se</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()

const form = reactive({ email: '', password: '' })
const errors = reactive({})
const serverError = ref('')
const loading = ref(false)
const showPassword = ref(false)

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.email) {
    errors.email = 'Unesite email'
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Krivi email'
  }

  if (!form.password) {
    errors.password = 'Unesite lozinku'
  }

  return Object.keys(errors).length === 0
}

async function submit() {
  serverError.value = ''
  if (!validate()) return
  loading.value = true
  const auth = useAuthStore()

  try {
    await auth.login(form.email, form.password)
    router.push('/')
  } catch (e) {
    serverError.value = e.response?.data?.message || 'Pogrešan email ili lozinka.'
  } finally {
    loading.value = false
  }
}
</script>
