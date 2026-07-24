import { createApp, useTemplateRef } from 'vue'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

import './style.css'

import App from './App.vue'

import Reveal from './reveal.js'

import Home from './components/home.vue'

import Login from './components/login.vue'
import Register from './components/register.vue'

import Dashboard from './components/dashboard.vue'
import Library from './components/library.vue'
import Multiplayer from './components/multiplayer.vue'
import Community from './components/community.vue'
import Profile from './components/profile.vue'

import Play from './components/play.vue'

import { updateScale } from "./ui/scale.js";

updateScale();

window.addEventListener(
  "resize",
  updateScale
);

const routes = [
    { 
        path:'/', 
        component: Home
    },

    { 
        path: '/login', 
        component: Login, 
        meta: {
            guest: true
        } 
    },

    {
        path: '/register',
        component: Register
    },

    { 
        path: '/dashboard', 
        component: Dashboard,
        meta: {
            requiresAuth: true
        }
     },

    { 
        path: '/multiplayer', 
        component: Multiplayer,
        meta: {
            requiresAuth: true
        }
    },

    { 
        path: '/community', 
        component: Community,
        meta: {
            requiresAuth: true
        }
    },

    { 
        path: '/profile', 
        component: Profile,
        meta: {
            requiresAuth: true
        }
    },

    {
        path: '/library',
        component: Library,
        meta: {
            requiresAuth: true
        }
    },

    { 
        path: '/play', 
        component: Play,
        meta: {
            requiresAuth: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const user = localStorage.getItem("user")

    if (to.meta.requiresAuth && !user) {
        next("/")
    } else {
        next()
    }
})

const app = createApp(App)

app.directive("reveal", Reveal)

app.use(router).mount('#app')