const url = "/setup/rates";
export default [
  {
    meta: {
      title: "Rates", requiresAuth: true,
    },
    path: url,
    name: "Rates",
    component: () => import("@/views/Rate/IndexView.vue"),
  },
  {
    meta: {
      title: "Rate - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "RatesCreate",
    component: () => import("@/views/Rate/CreateView.vue"),
  },
  {
    meta: {
      title: "Rate - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "RatesUpdate",
    component: () => import("@/views/Rate/UpdateView.vue"),
  },

]