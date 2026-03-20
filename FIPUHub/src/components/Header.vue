<template>
  <header
    class="bg-[#8ECAE6] border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm"
  >
    <!-- Logo -->
    <RouterLink to="/" class="flex items-center gap-2">
      <img src="/logo_bili.png" alt="FIPUHub Logo" class="h-9 w-auto" />
    </RouterLink>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center gap-1" v-if="auth.isLoggedIn">
      <RouterLink
        to="/"
        class="text-sm font-bold text-[#FFB703] px-3 py-2 rounded-xl hover:bg-[#FFB703] hover:text-black transition-colors"
        >Početna</RouterLink
      >
      <RouterLink
        to="/explore"
        class="text-sm font-bold text-[#FFB703] px-3 py-2 rounded-xl hover:bg-[#FFB703] hover:text-black transition-colors"
        >Istraži</RouterLink
      >
      <template v-if="auth.isLoggedIn">
        <RouterLink
          to="/projects"
          class="text-sm font-bold text-[#FFB703] px-3 py-2 rounded-xl hover:bg-[#FFB703] hover:text-black transition-colors"
          >Projekti</RouterLink
        >
        <RouterLink
          to="/jobs"
          class="text-sm font-bold text-[#FFB703] px-3 py-2 rounded-xl hover:bg-[#FFB703] hover:text-black transition-colors"
          >Poslovi</RouterLink
        >
      </template>
    </nav>

    <!-- Right side -->
    <div class="hidden md:flex items-center gap-3">
      <template v-if="auth.isLoggedIn">
        <RouterLink
          to="/profile"
          class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FFB703]/20 transition-colors"
        >
          <!-- Profile picture or initials fallback -->
          <div class="w-8 h-8 rounded-full overflow-hidden flex shrink-0">
            <img
              v-if="auth.user?.profilePicture"
              :src="auth.user.profilePicture"
              alt="Profilna slika"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-white flex items-center justify-center text-[#023047] font-bold text-xs"
            >
              {{ auth.user?.name?.charAt(0) }}{{ auth.user?.last_name?.charAt(0) }}
            </div>
          </div>
          <span class="text-sm font-medium text-[#023047]">{{ auth.user?.FirstName }}</span>
        </RouterLink>

        <button
          @click="logout"
          class="text-sm font-bold text-[#FFB703] hover:text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
        >
          Odjava
        </button>
      </template>
      <template v-else>
        <RouterLink
          to="/login"
          class="text-sm font-semibold text-[#023047] px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          Prijava
        </RouterLink>
        <RouterLink
          to="/register"
          class="text-sm font-bold bg-[#FFB703] text-[#023047] px-4 py-2 rounded-xl hover:bg-[#FB8500] transition-colors shadow-sm"
        >
          Registracija
        </RouterLink>
      </template>
    </div>

    <!-- Mobile menu button -->
    <button
      @click="menuOpen = !menuOpen"
      class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Menu v-if="!menuOpen" class="w-5 h-5 text-[#023047]" />
      <X v-else class="w-5 h-5 text-[#023047]" />
    </button>
  </header>

  <!-- Mobile menu -->
  <div
    v-if="menuOpen"
    class="md:hidden bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-1"
  >
    <RouterLink
      @click="menuOpen = false"
      to="/"
      class="text-sm font-medium text-[#023047] px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
      >Početna</RouterLink
    >
    <RouterLink
      @click="menuOpen = false"
      to="/explore"
      class="text-sm font-medium text-[#023047] px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
      >Istraži</RouterLink
    >
    <template v-if="auth.isLoggedIn">
      <RouterLink
        @click="menuOpen = false"
        to="/projects"
        class="text-sm font-medium text-[#023047] px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
        >Projekti</RouterLink
      >
      <RouterLink
        @click="menuOpen = false"
        to="/jobs"
        class="text-sm font-medium text-[#023047] px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
        >Poslovi</RouterLink
      >
      <RouterLink
        @click="menuOpen = false"
        to="/profile"
        class="text-sm font-medium text-[#023047] px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
        >Profil</RouterLink
      >
      <button
        @click="logout"
        class="text-left text-sm text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
      >
        Odjava
      </button>
    </template>
    <template v-else>
      <RouterLink
        @click="menuOpen = false"
        to="/login"
        class="text-sm font-medium text-[#023047] px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
        >Prijava</RouterLink
      >
      <RouterLink
        @click="menuOpen = false"
        to="/registration"
        class="text-sm font-bold bg-[#FFB703] text-[#023047] px-3 py-2 rounded-xl hover:bg-[#FB8500] transition-colors text-center"
        >Registracija</RouterLink
      >
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const menuOpen = ref(false)

function logout() {
  auth.logout()
  menuOpen.value = false
  router.push('/')
}
</script>
