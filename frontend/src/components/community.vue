<script setup lang="ts">
import trackcard from './trackcard.vue';
import tracks from '../data/tracks.json'
import upload from './upload.vue'
</script>

<template>
  <div>
    <section id="center">
      <h1>Community</h1>
    </section>

    <div class="ticks"></div>
    <section id="spacer"></section>

    <upload />

    <div class="ticks"></div>
    <section id="spacer"></section>
    
  </div>
</template>
