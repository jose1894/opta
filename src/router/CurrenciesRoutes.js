const url = "/setup/currencies";
export default [
  {
    meta: {
      title: "Currencies", requiresAuth: true,
    },
    path: url,
    name: "Currencies",
    component: () => import("@/views/Currency/IndexView.vue"),
  },
  {
    meta: {
      title: "Currencies - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "CurrenciesCreate",
    component: () => import("@/views/Currency/CreateView.vue"),
  },
  {
    meta: {
      title: "Currencies - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "CurrenciesUpdate",
    component: () => import("@/views/Currency/UpdateView.vue"),
  },

]