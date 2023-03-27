const url = '/setup/states';
export default [
    {
      meta: {
        title: "States", requiresAuth: true,
      },
      path: url,
      name: "States",
      component: () => import("@/views/State/IndexView.vue"),
    },
    {
      meta: {
        title: "States - create ", requiresAuth: true,
      },
      path: `${url}/create`,
      name: "StatesCreate",
      component: () => import("@/views/State/CreateView.vue"),
    },
    {
      meta: {
        title: "States - update ", requiresAuth: true,
      },
      path: `${url}/create/update/:id`,
      name: "StatesUpdate",
      component: () => import("@/views/State/UpdateView.vue"),
    },
  
  ]