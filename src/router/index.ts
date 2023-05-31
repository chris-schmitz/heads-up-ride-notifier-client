import {createRouter, createWebHistory} from 'vue-router'
import RouteList from "@/components/RouteList.vue";
import {getRouteList} from "@/api";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: '/route-selection'
        },
        {
            path: '/route-selection',
            name: 'Route Selection',
            component: RouteList,
            props: {routeIdentifiers: await getRouteList()}
        }
    ]
})

export default router
