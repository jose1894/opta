const url = "/setup/industries";
export default [
  {
    meta: {
      title: "Industries", requiresAuth: true,
    },
    path: url,
    name: "Industries",
    component: () => import("@/views/industry/IndexView.vue"),
  },
  {
    meta: {
      title: "Industries - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "IndustriesCreate",
    component: () => import("@/views/industry/CreateView.vue"),
  },
  {
    meta: {
      title: "Industries - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "IndustriesUpdate",
    component: () => import("@/views/industry/UpdateView.vue"),
  },

]