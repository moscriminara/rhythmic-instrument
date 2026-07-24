<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { user, loadUser } from "../user/user.js"
import { current_track } from "../track/track.js"

import config from "../config"

const iframe = ref(null)
const route = useRoute()
const router = useRouter()
const id = route.query.id

const result = ref(null)
const result_screen = ref(false)
const result_message = ref("")

const notice = ref("")
const autoplay_notice = ref("")

const local_user = ref(
  JSON.parse(
      localStorage.getItem("user")
  )
)

if (local_user.value.settings.autoplay === true) {
  autoplay_notice.value = "This result will not be upload under autoplay mode."
}

function receiveMessage(event){

  if(event.data.type === "godot_ready"){

		iframe.value.contentWindow.postMessage(
			{
				type: "settings",
				data: JSON.stringify(local_user.value.settings)
			},
			"*"
		)

	}

  if (event.data.type === "result"){
		result.value = event.data.data

    if (local_user.value.settings.autoplay === true) {
        result_message.value = "Autoplay"
    } else {
        result_message.value = `${result.value.accuracy} %`
    }
  
	}

	if (event.data.type === "exit") {
		router.push("/dashboard")
	}

  if (event.data.type === "finished") {
		result_screen.value = true
	}

}


async function uploadResult() {

  if (!current_track.value || !result.value) {
    return
  }

  if (local_user.value.settings.autoplay === false) {

    const response = await fetch(
      `${config.API}/upload-result`,
      {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          user_id: user.value.id,
          track_id: current_track.value.id,
          accuracy: result.value.accuracy,
          total_hits: result.value.total_notes,
          wonderful: result.value.wonderful,
          nice: result.value.nice,
          miss: result.value.miss
        })
      }
    )

    const data = await response.json()

    if (!data.success) {
      notice.value = "Upload Failed"
      return
    }

  } else {
    router.push("/dashboard")
  }

  await loadUser()

  router.push("/dashboard")
}

onMounted( () => {
	window.addEventListener("message", receiveMessage)
})

onUnmounted( () => {
	window.removeEventListener("message",receiveMessage)
})

</script>

<template>
  <div>

  <template v-if="!result_screen">
    <iframe
      ref="iframe"
      :src="`/rhythmic-instrument/rhythmic-instrument.html?id=${id}`"
      class="godot"
    ></iframe>
  </template>

  <template v-else>
    <transition name="fade" mode="out-in">
      <div class="result_screen">
        <div>
          <h1>{{ result_message }}</h1>
          <p>{{ autoplay_notice }}</p>
        </div>

        <div>
          <div>
            <p>Total Hits: {{ result.total_notes }}</p>
            <p>Wodnerful: {{ result.wonderful }}</p>
            <p>Nice: {{ result.nice }}</p>
            <p>Miss: {{ result.miss }}</p>
          </div>

          <div>
            <button class="button" @click="uploadResult">Continue</button>
            <p style="color: red">{{ notice }}</p>
          </div>
        </div>
      </div>
    </transition>
  
  </template>


  </div>
</template>