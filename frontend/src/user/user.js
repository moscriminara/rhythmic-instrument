import { ref } from "vue"
import config from "../config"

export const user = ref(null)

export async function loadUser() {

    const saved_user = JSON.parse(localStorage.getItem("user"))

    if (!saved_user) {
        user.value = null
        return
    }

    const response = await fetch(
        `${config.API}/user/${saved_user.id}`
    )

    const data = await response.json()

    if (data.success) {

        user.value = data.user

        localStorage.setItem(
            "user", 
            JSON.stringify(data.user)
        )

    } else {
        user.value = null
    }

}