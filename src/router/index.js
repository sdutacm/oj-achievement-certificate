import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Achievement from '@/views/Achievement.vue'
import Competition from '@/views/Competition.vue'
import competitionList from '@/views/competitionList.vue'
import Sets from '@/views/Sets.vue'
import setList from '@/views/setList.vue'


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
    },
    {
        path: '/set/:setId',
        name: 'Set',
        component: Sets,
        prop: true,
    },
    {
        path: '/sets',
        name: 'sets',
        component: setList,
    },
]

const router = createRouter({
    history: createWebHistory('/oj-certificate/'),
    routes,
})

export default router