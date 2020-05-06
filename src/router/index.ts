import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import NewMesure from '@/components/NewMesure.vue';
import History from '@/components/History.vue';
import Settings from '@/components/Settings.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'New mesure',
    component: NewMesure,
  },
  {
    path: '/history',
    name: 'History',
    component: History,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
