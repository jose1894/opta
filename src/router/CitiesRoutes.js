const url = "/setup/cities";
export default [
  {
    meta: {
      title: "Cities", requiresAuth: true,
    },
    path: url,
    name: "Cities",
    component: () => import("@/views/City/IndexView.vue"),
  },
  {
    meta: {
      title: "Cities - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "CitiesCreate",
    component: () => import("@/views/City/CreateView.vue"),
  },
  {
    meta: {
      title: "Cities - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "CitiesUpdate",
    component: () => import("@/views/City/UpdateView.vue"),
  },

]