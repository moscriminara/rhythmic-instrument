<script setup>
import { ref } from 'vue'

const show = ref(false)

const open = () => {
  show.value  = true
}
const close = () => {
  show.value = false
}

const trackname = ref("")
const trackartist = ref("")
const bpm = ref("")

const cover = ref(null)
const midi = ref(null)

const notice = ref("")

const selectCover = (event) => {
  cover.value = event.target.files[0]
}

const selectMidi = (event) => {
  midi.value = event.target.files[0]
}

async function uploadTrack() {
  if (!trackname.value || !trackartist.value || !bpm.value || !cover.value || !midi.value) {
    notice.value = "Please complete all fields"
    return
  }
  const formData = new FormData()


  formData.append("trackname", trackname.value)
  formData.append("trackartist", trackartist.value)
  formData.append("bpm", bpm.value)

  formData.append("cover", cover.value)

  formData.append("midi", midi.value)


  const response = await fetch(
    `${config.API}/upload`,
    {
      method:"POST",
      body:formData
    }
  )

  const data = await response.json()
}

</script>

<template>
  <div id="center">
    <button class="button" @click="open">Upload</button>
  </div>

  <transition name="fade" mode="out-in">
    <div v-show="show" class="overlay" @click="close">

      <div class="track_overlay" @click.stop>

        <div class="detailcard upload">

        <input v-model="trackname" placeholder="Track Title">
        <input v-model="trackartist" placeholder="Track Artist">
        <input v-model="bpm" placeholder="BPM">
        <input @change="selectCover" type="file" accept=".png, .jpg, .webp">
        <input @change="selectMidi" type="file" accept=".mid, .midi">

        </div>

        <button class="button" @click="uploadTrack">Upload</button>
        <p>{{ notice }}</p>
      </div>
    </div>
  </transition>
  
</template>