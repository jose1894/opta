const url = "/setup/profiles";
export default [
  {
    meta: {
      title: "Profiles", requiresAuth: true,
    },
    path: url,
    name: "Profiles",
    component: () => import("@/views/Profiles/IndexView.vue"),
  },
  {
    meta: {
      title: "Profiles - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "ProfilesCreate",
    component: () => import("@/views/Profiles/CreateView.vue"),
  },
  {
    meta: {
      title: "Profiles - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "ProfilesUpdate",
    component: () => import("@/views/Profiles/UpdateView.vue"),
  },

]