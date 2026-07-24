<script setup>
import { ref } from 'vue'
import config from '../config'

const notice = ref("")
const notice_color = ref("green")

const loading = ref(false)

const user = ref(
  JSON.parse(
      localStorage.getItem("user")
  )
)

const settings = ref(
  user.value.settings ?? {
    speed: 300,
    autoplay: false,
    octave_guide_piano: false,
    octave_guide_bg: true,
    F_octave: false,
    bg_blur: 4.0,
    bg_brightness: 0.5
  }
)

function saveSettings() {

  user.value.settings = settings.value

  localStorage.setItem(
    "user",
    JSON.stringify(user.value)
  )

}

async function updateSettings() {

  loading.value = true

  user.value.settings = settings.value

  const response = await fetch(
    `${config.API}/update-settings`,
    {
      method: "PUT",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        id: user.value.id,
        settings: settings.value
      })
    }
  )

  loading.value = false

  const data = await response.json()

  if (data.success) {
    notice.value = "Saved settings"
  } else {
    notice.value = "Failed"
    notice_color.value = "red"
  }
}

</script>


<template>
  <section class="hori_list settings">

    <list>
      
      <div>
        <input v-model="settings.autoplay"
        @change="saveSettings" 
        type="checkbox" 
        class="checkbox">
        <p>Autoplay</p>
      </div>

      <div>
        <input 
        v-model="settings.octave_guide_piano" 
        @change="saveSettings" 
        type="checkbox" 
        class="checkbox">
        <p>Piano Octave Guide</p>
      </div>

      <div>
        <input 
        v-model="settings.octave_guide_bg" 
        @change="saveSettings" 
        type="checkbox" 
        class="checkbox">
        <p>Background Octave Guide</p>
      </div>

      <div>
        <input 
        v-model="settings.F_octave" 
        @change="saveSettings" 
        type="checkbox" 
        class="checkbox">
        <p>F Octave Guide</p>
      </div>

    </list>

    <list>

      <div>
        <span>{{ Number(settings.speed / 100).toFixed(1) }}</span>
        <input 
        v-model.number="settings.speed" 
        @input="saveSettings"
        class="slider"
        type="range"
        min="100" 
        max="800">
        <p>Speed</p>
      </div>

      <div>
        <span>{{ Number(settings.bg_blur).toFixed(1) }}</span>
        <input 
        v-model.number="settings.bg_blur" 
        @input="saveSettings"
        class="slider"
        type="range" 
        min="0.0" 
        max="5.0" 
        step="0.1">
        <p>Background Blur</p>
      </div>

      <div>
        <span>{{ settings.bg_brightness * 10 }}</span>
        <input 
        v-model.number="settings.bg_brightness"
         @input="saveSettings"
         class="slider"
         type="range" 
         min="0.0" 
         max="1.0" 
         step="0.1">
        <p>Background Brightness</p>
      </div>

      <div>
        <button class="button settings" @click="updateSettings" :disabled="loading">
          {{ loading ?"Uploading..." :"Save" }}
        </button>
        <p :style="{color: notice_color}" >{{ notice }}</p>
      </div>

    </list>

  </section>
</template>