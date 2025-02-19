import { createRouter, createWebHistory } from 'vue-router';

const ShowDetails = () => import('../views/ShowDetails.vue');
const Home = () => import('../views/Home.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/show/:id',
      name: 'ShowDetails',
      component: ShowDetails,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      // component: () => import('../views/NotFound.vue')
    }
  ]
});

router.onError((error) => {
  console.error('Router error:', error)
  // redirect to some error page
});

export default router;