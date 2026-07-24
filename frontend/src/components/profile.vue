<script setup>

import { ref } from "vue"
import { useRouter } from "vue-router"
import { user } from "../user/user.js"

import config from "../config"

const router  = useRouter()

const notice = ref("")

function logOut() {

  localStorage.removeItem("user")
  user.value = null

  router.push('/')
}

</script>

<template>
  <div>
    <section id="center">
        <h1>{{ user?.username }}</h1>
    </section>

    <div class="ticks"></div>
    <section id="spacer"></section>

    <section>
      <h2>Records</h2>
      
      <div class="overall_result">

        <div>
          <h3>AVERAGE ACCURACY</h3>
          <h1>{{ user?.average_accuracy }}</h1>
        </div>
        
        <div>
          <h3>HITTED NOTES</h3>
          <h1>{{ user?.total_hits }}</h1>
        </div>

        <div>
          <h3>TOTAL PLAY TIME</h3>
          <h1>{{ user?.total_plays }}</h1>
        </div>
      </div>

    </section>

    <div class="ticks"></div>
    <section id="spacer"></section>
  
    <section>
      <button class="button" @click="logOut">
        Log Out
      </button>
      <p color="red">{{ notice }}</p>
    </section>

  </div>
</template>
