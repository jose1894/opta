const url = "/setup/jobPositions";
export default [
  {
    meta: {
      title: "Cargos", requiresAuth: true,
    },
    path: url,
    name: "Cargos",
    component: () => import("@/views/JobPosition/IndexView.vue"),
  },
  {
    meta: {
      title: "Cargo - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "CargosCreate",
    component: () => import("@/views/JobPosition/CreateView.vue"),
  },
  {
    meta: {
      title: "Cargo - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "CargosUpdate",
    component: () => import("@/views/JobPosition/UpdateView.vue"),
  },

]