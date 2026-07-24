<script setup>

import { ref } from 'vue'
import { useRouter } from "vue-router"
import { setTrack } from "../track/track.js"

import config from "../config"
import settings from './settings.vue'

const router = useRouter()

const loading = ref(false)

const user = ref(
  JSON.parse(
      localStorage.getItem("user")
  )
)

defineProps({
  track: Object
});

const show = ref(false)

const open = () => {
  show.value = true
}

const close = () => {
  show.value = false
}

async function play(track) {

  const midi = await navigator.requestMIDIAccess()

  if (!midi.inputs.size > 0) {

    const confirm = window.confirm(
      "No MIDI input detected. Are you sure to continue?"
    )

    if (!confirm) {
      return
    }

  }

  setTrack(track)

  router.push({
    path: '/play',
    query: {
      id: track.id
    }
  })

}

function downloadMidi(track) {

  const url = `${config.API}/uploads/${track.midi_path}`

  const download = document.createElement("a")
  download.href = url

  download.click()

}

</script>

<template>
  <div class="trackcard" @click="open">
    <img class="trackcard_cover" :src="track.cover" alt="" />
    <div class="trackcard_text">
      <h3 style="margin:0;">{{ track.trackname }}</h3>
      <p style="margin:5px 0 20px;">{{ track.trackartist }}</p>
    </div>
  </div>

  <transition name="fade" mode="out-in">
    <div v-if="show" class="overlay" @click="close">

      <div class="scrolling">
        <img class="trackimg_bg" :src="track.cover" alt=""/>
        <img class="trackimg_bg" :src="track.cover" alt=""/>
        <img class="trackimg_bg" :src="track.cover" alt=""/>
        <img class="trackimg_bg" :src="track.cover" alt=""/>
      </div>

      <div class="track_overlay">

        <div class="detailcard" @click.stop>

          <img 
          class="trackimg_overlay" 
          :src="track.cover"
          @click="play(track)"
          alt=""/>


          <div>
            
            <div>
              <h1>{{ track.trackname }}</h1>

              <div class="hori_list track_info">

                <div>
                  <h3>{{ track.trackartist }}</h3>
                  <p>BPM: {{ track.bpm }}</p>
                </div>

                <div>
                  <h3 style="height: 26px;">Upload by: <span>{{ track.uploader }}</span></h3>
                  <h3 class="difficulties" :class="track.difficulty">
                    {{ track.difficulty }}
                  </h3>
                </div>
                
              </div>

            </div>
            
            <div class="function_area">
              <div>
                <settings />
              </div>

              <div>
                <button class="button" @click="downloadMidi(track)">
                    Download MIDI
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </transition>
</template>