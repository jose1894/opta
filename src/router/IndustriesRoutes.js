const url = "/setup/industries";
export default [
  {
    meta: {
      title: "Industries", requiresAuth: true,
    },
    path: url,
    name: "Industries",
    component: () => import("@/views/Industry/IndexView.vue"),
  },
  {
    meta: {
      title: "Industries - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "IndustriesCreate",
    component: () => import("@/views/Industry/CreateView.vue"),
  },
  {
    meta: {
      title: "Industries - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "IndustriesUpdate",
    component: () => import("@/views/Industry/UpdateView.vue"),
  },

]