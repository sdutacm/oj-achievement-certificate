import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Achievement from '@/views/Achievement.vue'
import Competition from '@/views/Competition.vue'
import competitionList from '@/views/competitionList.vue'


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
        path: '/competition/:competitionId',
        name: 'Competition',
        component: Competition,
        props: true,
    },
    {
        path: '/competitions',
        name: 'Competitions',
        component: competitionList,
    }
]

const router = createRouter({
    history: createWebHistory('/oj-certificate/'),
    routes,
})

export default router