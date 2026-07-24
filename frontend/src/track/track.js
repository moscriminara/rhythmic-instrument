import { ref } from "vue"
import config from "../config"

export const current_track = ref(null)
export const tracks = ref([])

export async function loadTrack(track) {
    const response = await fetch(`${config.API}/tracks`)
    const data = await response.json()

    tracks.value = data.tracks
}

export function setTrack(track) {

    current_track.value = track

    localStorage.setItem(
        "current_track",
        JSON.stringify(track)
    )

}