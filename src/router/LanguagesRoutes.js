const url = "/setup/languages";
export default [
  {
    meta: {
      title: "Languages", requiresAuth: true,
    },
    path: url,
    name: "Languages",
    component: () => import("@/views/Languages/IndexView.vue"),
  },
  {
    meta: {
      title: "Language - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "LanguagesCreate",
    component: () => import("@/views/Languages/CreateView.vue"),
  },
  {
    meta: {
      title: "Language - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "LanguagesUpdate",
    component: () => import("@/views/Languages/UpdateView.vue"),
  },

]