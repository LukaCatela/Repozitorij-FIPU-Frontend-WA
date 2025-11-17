<script setup>
import Body from './components/Body.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header/>

    <div class="flex-1 flex justify-center">
      <Body/>
    </div>

  <Footer/>
  </div>
</template>
