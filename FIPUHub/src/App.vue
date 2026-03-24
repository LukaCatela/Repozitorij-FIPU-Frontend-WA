<script setup>
import Body from './components/Body.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'

const auth = useAuthStore()

onMounted(async () => {
  if (localStorage.getItem('token')) {
    await auth.fetchMe()
  }
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <div class="flex-1 flex justify-center">
      <Body />
    </div>

    <Footer />
  </div>
</template>
