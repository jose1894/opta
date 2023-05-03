const url = "/setup/professions";
export default [
  {
    meta: {
      title: "Professions", requiresAuth: true,
    },
    path: url,
    name: "Professions",
    component: () => import("@/views/Professions/IndexView.vue"),
  },
  {
    meta: {
      title: "Profession - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "ProfessionsCreate",
    component: () => import("@/views/Professions/CreateView.vue"),
  },
  {
    meta: {
      title: "Profession - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "ProfessionsUpdate",
    component: () => import("@/views/Professions/UpdateView.vue"),
  },

]