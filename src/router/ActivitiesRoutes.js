const url = "/setup/activities";
export default [
  {
    meta: {
      title: "Activities", requiresAuth: true,
    },
    path: url,
    name: "Activities",
    component: () => import("@/views/Actividad/IndexView.vue"),
  },
  {
    meta: {
      title: "Activities - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "ActivitiesCreate",
    component: () => import("@/views/Actividad/CreateView.vue"),
  },
  {
    meta: {
      title: "Activities - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "ActivitiesUpdate",
    component: () => import("@/views/Actividad/UpdateView.vue"),
  },

]