const url = "/setup/clients";
export default [
  {
    meta: {
      title: "clients", requiresAuth: true,
    },
    path: url,
    name: "clients",
    component: () => import("@/views/Clientes/IndexView.vue"),
  },
  {
    meta: {
      title: "clients - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "ClientsCreate",
    component: () => import("@/views/Clientes/CreateView.vue"),
  },
  {
    meta: {
      title: "clients - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "ClientsUpdate",
    component: () => import("@/views/Clientes/UpdateView.vue"),
  },

]