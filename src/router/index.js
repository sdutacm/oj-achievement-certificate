import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Achievement from '@/views/Achievement.vue'
import Competition from '@/views/Competition.vue'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/achievement',
        name: 'Achievement',
        component: Achievement,
    },
    {
        path: '/competition',
        name: 'Competition',
        component: Competition,
    },
]

const router = createRouter({
    history: createWebHistory('/oj-certificate/'),
    routes,
})

export default router