<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue"
import { useRouter } from "vue-router"

import pic01 from "../assets/images/pub_pic01.png"
import pic02 from "../assets/images/pub_pic02.png"
import pic03 from "../assets/images/pub_pic03.png"

const router = useRouter()

const images = [pic01, pic02, pic03]

const current = ref(0)

let timer

onMounted( () => {
  timer = setInterval( () => {
    current.value = (current.value + 1) % images.length
  }, 4000)
})

onUnmounted( () => {
  clearInterval(timer)
})

const loginStatus = computed( () => {
  return localStorage.getItem("user")
    ?"/dashboard"
    :"/login"
})


</script>

<template>
  <div>
  
    <section>

      <nav class="hori_list navigation">
        <a class="navigation_content" href="#authentication">Home</a>
        <a class="navigation_content" href="#features">Features</a>
        <a class="navigation_content" href="#documentation">Documentation</a>
      </nav>

      <section id="spacer" style="height: 0;"></section>

    </section>
  

    <section class="reveal" id="authentication" v-reveal>

      <div class="authentication">

        <div class="image_box">
          <h1 id="center">Rhythmic Instrument</h1>
          <transition name="image" mode="out-in">
            <img
              :key="current"
              :src="images[current]"
              class="pub_img"
            >
          </transition>
        </div>

        <div class="login_box">
          <div class="button_box">

            <router-link class="button" :to="loginStatus">
              Login
            </router-link>

            <router-link class="button" to="/register">
              Register
            </router-link>

          </div>
        </div>

      </div>

    </section>


    <section id="features" class="reveal" v-reveal>

      <section id="spacer"></section>
    
      <div class="features_box">
        <h1>Features</h1><br>
        
        <h3 class="reveal" v-reveal>
          Rhythm Instrument implements a visualised MIDI learning system that combines real-time note visualisation, 
          MIDI keyboard input and performance feedback to provide an interactive experience.
        </h3><br>

        <img class="features_img reveal" src="../assets/images/pub_pic01.png" v-reveal>

        <h3 class="reveal" v-reveal>
          The multiplayer mode lets players compete against each other by comparing their performance accuracy.
        </h3><br>

        <img class="features_img reveal" src="../assets/images/features01.png" v-reveal>

        <h3 class="reveal" v-reveal>
          Discover a growing collection of community-created tracks and share your own creations.
        </h3><br>

        <img class="features_img reveal" src="../assets/images/features02.png" v-reveal>

      </div>
    </section>

    <section id="documentation">

      <section id="spacer"></section>

      <div>

        <div class="hori_list">
    
          <list>
            <h3>Contact</h3>
            <p>kanozkuyo@gmail.com</p>
          </list>
        
          <list>
            <h3>Github</h3>
            <p>Comming Soon</p>
          </list>

        </div>
    
        <p>
          @ Moment <br>
          @ Tough Guy™ LLC.
        </p>
        <br>

      </div>
    </section>
  </div>

</template>