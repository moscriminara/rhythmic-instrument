<script setup>
import { ref, onMounted } from 'vue'
import { tracks } from '../track/track.js'

import trackcard from './trackcard.vue'
import lessoncard from './lessoncard.vue'

import lessons from "../data/lessons.json"

import config from "../config"

</script>

<template>
  <div>

    <section id="center">
      <h1>Rhythmic Instrument</h1>
      <p style="all:unset"><code>DEVELOPER MODE 0.0.1</code></p>
    </section>


    <div class="ticks"></div>
    <section id="spacer"></section>


    <section id="song-list">
      <div style="display: flex;">
        <h2>Song list</h2>

        <router-link to="/library" class="all">
          All
        </router-link>

      </div>
      <div class="hori_list">
        <trackcard 
          v-for="track in tracks.slice(0, 10)"
          :key="track.id"
          :track="track"
        />
      </div>
    </section>


    <div class="ticks"></div>
    <section id="spacer"></section>


    <section>
      <div style="display: flex;">
        <h2>Lessons</h2>
        <button class="all">All</button>
      </div>
      <div class="hori_list">
        <lessoncard 
          v-for="lesson in lessons"
          :key="lesson.id"
          :lesson="lesson"
        />
      </div>
    </section>


    <div class="ticks"></div>
    <section id="spacer"></section>


    <section>
      <h2>Licence</h2>
      <div>
        <img style="width: 200px; margin: 15px;" src="https://static.vecteezy.com/system/resources/thumbnails/053/227/245/small/graphic-representation-of-a-driver-s-license-card-with-a-male-photo-personal-details-and-security-features-png.png">
      </div>
    </section>

    
  </div>
</template>