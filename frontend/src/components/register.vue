<script setup>
import { ref } from "vue"
import { useRouter } from 'vue-router'
import config from "../config"

const router = useRouter()

const reg_username = ref("")
const reg_email = ref("")
const reg_password = ref("")
const reg_confirm_password = ref("")
const notice = ref("")

const loading = ref(false)

const verification = ref(false)
const verif_code = ref("")


async function sendVerifCode() {

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reg_email.value)) {
    notice.value = "Please enter the correct email address."
    return
  }
  if (reg_email.value.includes(" ") || reg_password.value.includes(" ")) {
    notice.value = "Can't include spaces in email address or password."
    return
  }

  if (reg_confirm_password.value !== reg_password.value) {
    notice.value = "The confirm password must be the same as the password."
    return
  }
  if (!/^[a-zA-Z0-9#*!?_+-]+$/.test(reg_password.value)) {
    notice.value = "Password can only include letters, numbers and limited special characters (#*!?_+-)."
    return
  }

  if (reg_username.value.length > 50) {
    notice.value = "The username is too long (Max 50 characters)."
    return
  }
  if (reg_password.value.length > 30) {
    notice.value = "The password is too long (Max 30 characters)."
    return
  }
  if (reg_password.value.length < 5) {
    notice.value = "The password must be at least 5 characters."
    return
  }

  loading.value = true

  const response = await fetch(
    `${config.API}/send-verification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reg_email: reg_email.value
      })
    }
  )

  loading.value = false

  const data = await response.json()

  if (data.error === "Email_exists") {
    notice.value = "This email has already been registered."
    return
  }

  notice.value = ""
  verification.value = true

}


async function register() {

  if (!verif_code.value.trim()) {
    notice.value = "Please enter the verification code."
    return
  }

  const response = await fetch(
    `${config.API}/register`, 
    {
      method: "POST",

      headers: {
          "Content-Type":"application/json"
      },

      body: JSON.stringify({
        reg_username: reg_username.value,
        reg_email: reg_email.value,
        reg_password: reg_password.value,
        verif_code: verif_code.value
      })
    }
  )

  const data = await response.json()

  if (!data.success) {

    if (data.error === "Expired") {
      notice.value = "The verification code has expired."
      return
    } else if (data.error === "Incorrect_code") {
      notice.value = "The verification code is incorrect."
      return
    }

  }

  router.push({
    path: "/login",
    query: {
      registered: "true"
    }
  })

}

</script>

<template>
  <section class="login">
          
    <p style="color: red">{{ notice }}</p>

    <template v-if="!verification">

      <input v-model="reg_username" placeholder="Username">
      <input v-model="reg_email" placeholder="Email Address">
      <input type="password" v-model="reg_password" placeholder="Password">
      <input type="password" v-model="reg_confirm_password" placeholder="Confirm the password">

      <button class="button" @click="sendVerifCode" :disabled="loading">
        {{ loading ?"Verifying..." :"Continue" }}
      </button>

    </template>

    <template v-else>

      <input v-model="verif_code" placeholder="Enter 6 digit code">

      <button class="button" @click="register">
        Register
      </button>

    </template>

  </section>
</template>