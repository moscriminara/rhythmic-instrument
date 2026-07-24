<script setup>

defineProps({
  lesson: Object
});

import { ref } from 'vue'

const show = ref(false)

const open = () => {
  show.value = true
}

const close = () => {
  show.value = false
}

</script>

<template>
  <div class="trackcard" @click="open">
    <img class="trackcard_cover" style="width:300px; height:150px;" :src="lesson.cover" alt=""/>
    <h3 style="margin:0 0 20px;">{{ lesson.lessonname }}</h3>
  </div>

  <transition name="fade" mode="out-in">
    <div v-if="show" class="overlay" @click="close">
      <div class="track_overlay">
        <div class="detailcard" @click.stop>

          <router-link to="/play">

            <img class="trackimg_overlay"
            style="width:500px; height:250px" 
            :src="lesson.cover" alt="" />

          </router-link>

          <div style="margin-bottom: auto;">

            <h1>{{ lesson.lessonname }}</h1>
            <p>{{ lesson.intro }}</p>

          </div>

        </div>
      </div>
    </div>
  </transition>

</template>