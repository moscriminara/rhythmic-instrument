<script setup>
import trackcard from './trackcard.vue'

import config from "../config"

import { ref, onMounted } from 'vue'

const tracks = ref([])
const search = ref("")

onMounted( async () => {
  const response = await fetch(`${config.API}/tracks`)
  const data = await response.json()

  tracks.value = data.tracks
})

async function searchTracks() {
  const response = await fetch(
    `${config.API}/search?keyword=${search.value}`
  )

  tracks.value = await response.json()
}

</script>

<template>
  <div>
    <section id="center">
      <input class="search" v-model="search" @input="searchTracks" placeholder="Search the song">
    </section>

    <section class="library">
      <trackcard 
        v-for="track in tracks"
        :key=track.id
        :track="track"
      />
    </section>
  </div>
</template>