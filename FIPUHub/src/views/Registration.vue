<template>
  <div>
    <input v-model="form.FirstName" placeholder="Ime" />
    <input v-model="form.LastName" placeholder="Prezime" />
    <input v-model="form.email" placeholder="Email" />
    <input v-model="form.password" type="password" placeholder="Lozinka" />
    <input v-model="form.jmbg" placeholder="JMBG studenta" />

    <button @click="submit" class="hover:text-amber-200">Registriraj se</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios.js'

// reactive koristimo kada imamo neki objekt ili listu, dok ref kad imamo single podatak
const router = useRouter()

const form = reactive({ FirstName: '', LastName: '', email: '', password: '', jmbg: '' })
const error = ref('')

async function submit() {
  try {
    const { data } = await api.post('/auth/register', form)
    localStorage.setItem('token', data.token)
    router.push('/')
    console.log('Uspjesno registriran')
  } catch (e) {
    error.value = e.response?.data?.message || 'Greška.'
  }
}
</script>
