<script setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from 'vue-router'
import { loadUser } from '../user/user.js'

import config from "../config"

const route = useRoute()
const router = useRouter()

const email = ref("")
const password = ref("")
const notice = ref("")
const notice_color = ref("red")

const loading = ref(false)

onMounted(() => {
  if (route.query.registered === "true") {
    notice.value = "Registration successful."
    notice_color.value = "green"

    router.replace("/login")
  }
})

async function login() {
  
  loading.value = true

  const response = await fetch(
    `${config.API}/login`, 
    {
      method: "POST",

      headers: {
          "Content-Type":"application/json"
      },

      body: JSON.stringify({
          email: email.value,
          password: password.value
      })
    }
  )
  
  loading.value = false

  const data = await response.json()

  if (!data.success){

    notice.value = "Email or password is incorrect."
    notice_color.value = "red"
  
    return

  }

  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  )

  await loadUser()

  router.push('/dashboard')

}
</script>

<template>
  <section class="login">
  
    <p :style="{color: notice_color}">{{ notice }}</p>

    <input v-model="email" placeholder="Email Address">
    <input type="password" v-model="password" placeholder="Password">

    <button class="button" @click="login" :disabled="loading">
      {{ loading ?"Verifying..." :"Login" }}
    </button>
  </section>
</template>