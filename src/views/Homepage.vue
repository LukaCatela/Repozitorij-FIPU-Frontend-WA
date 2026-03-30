<template>
  <div class="min-h-screen text-gray-900">
    <section class="px-6 lg:px-20 py-20 flex flex-col lg:flex-row items-center gap-10">
      <div class="flex-1">
        <h1 class="text-4xl lg:text-5xl font-bold leading-tight">
          Dobrodošli u <span class="text-[#8ECAE6]">FIPU</span
          ><span class="text-[#FFB703]">Hub</span>
        </h1>
        <p class="mt-5 text-lg text-[#219EBC] max-w-xl">
          Centralno mjesto za studentske projekte, članke, znanstvene radove i razmjenu poslova.
          Poveži se s kolegama, profesorima i poslodavcima.
        </p>

        <div class="flex gap-4 mt-8">
          <template v-if="auth.isLoggedIn">
            <RouterLink
              to="/explore"
              class="bg-[#FFB703] text-[#023047] px-5 py-3 rounded-xl shadow-md hover:bg-[#FB8500] transition"
            >
              Pregledaj radove
            </RouterLink>

            <RouterLink
              to="/post-job"
              class="bg-white border border-gray-300 px-5 py-3 rounded-xl shadow hover:bg-[#FFB703] transition"
            >
              Objavi oglas
            </RouterLink>
          </template>
          <template v-else="!auth.isLoggedIn">
            <RouterLink
              to="/register"
              class="bg-[#FFB703] text-[#023047] px-5 py-3 rounded-xl shadow-md hover:bg-[#FB8500] transition"
            >
              Pregledaj radove
            </RouterLink>

            <RouterLink
              to="/register"
              class="bg-white border border-gray-300 px-5 py-3 rounded-xl shadow hover:bg-[#FFB703] transition"
            >
              Objavi oglas
            </RouterLink>
          </template>
        </div>
      </div>

      <div class="flex-1">
        <img src="/logo_crni.png" alt="FIPU Hub" class="w-full drop-shadow-xl rounded-xl" />
      </div>
    </section>

    <section class="py-16 px-6 lg:px-20">
      <h2 class="text-3xl font-bold text-center mb-12">Što nudi FIPU Hub?</h2>

      <div class="grid md:grid-cols-3 gap-10">
        <div class="p-6 bg-[#8ECAE6] rounded-xl shadow hover:shadow-lg transition">
          <h3 class="text-xl font-semibold mb-3">Studentski radovi</h3>
          <p class="text-gray-600">
            Objavljuj i pregledaj radove svih kolega na fakultetu. Izgradi svoj portfelj.
          </p>
        </div>

        <div class="p-6 bg-[#8ECAE6] rounded-xl shadow hover:shadow-lg transition">
          <h3 class="text-xl font-semibold mb-3">Recenzije i mentorstvo</h3>
          <p class="text-gray-600">
            Profesori i mentori mogu ostavljati komentare, odobravati i ocjenjivati kvalitetu.
          </p>
        </div>

        <div class="p-6 bg-[#8ECAE6] rounded-xl shadow hover:shadow-lg transition">
          <h3 class="text-xl font-semibold mb-3">Poslovi i projekti</h3>
          <p class="text-gray-600">Objavi ili pronađi projekt, praksu ili studentski posao.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>
