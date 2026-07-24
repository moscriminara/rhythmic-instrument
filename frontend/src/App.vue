<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { loadUser } from './user/user.js'
import { loadTrack } from './track/track.js'

import navigation from './components/navigation.vue'
import login from './components/login.vue'

const route = useRoute()
const loading = ref(false)

onMounted(async () => {

    await loadUser()
    await loadTrack()
    loading.value = true

    const sections = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, {
        threshold: 0.15
    });

    sections.forEach(section => {
        observer.observe(section);
    });
})
</script>

<template>

    <div v-if="loading">
        <navigation v-if="!['/', '/login', '/register', '/play'].includes(route.path)" />

        <transition name="fade" mode="out-in">
            <router-view/>
        </transition>
    </div>

    <div v-else class="result_screen">
        <transition name="fade" mode="out-in">
            <h1 style="font-size: 50px;">Loading...</h1>
        </transition>
    </div>
  
</template>