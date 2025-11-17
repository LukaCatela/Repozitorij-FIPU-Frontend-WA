<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>
<template>
  <div class="w-full px-4 sm:px-6 lg:px-8">
    <div v-if="route.path === '/'">
      <RouterLink to="/"></RouterLink>
    </div>
    <RouterView />
  </div>
</template>
