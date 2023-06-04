import { createRouter, createWebHashHistory } from "vue-router";
import routes from './routes'
import { useMainStore } from "@/stores/main";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});


router.beforeEach((to, from, next) => {
  const mainStore = useMainStore();
  if (to.name !== 'Login' && to.name !== 'Register' && to.meta.requiresAuth && !mainStore.user.isLoggedIn) {
      next({ name: 'Login' })
      return
  }
  next()
})

export default router;
