import Vue from 'vue';
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export function createRouter() {
    const router = new VueRouter({
        mode: 'history',
        base: __dirname,
        routes: [
            { path: '/', component: Home },
            { path: '/about', component: About }
        ]
    });
    return router;
}