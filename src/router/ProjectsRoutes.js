const url = "/setup/projects";
export default [
  {
    meta: {
      title: "Projects", requiresAuth: true,
    },
    path: url,
    name: "Projects",
    component: () => import("@/views/Proyectos/IndexView.vue"),
  },
  {
    meta: {
      title: "Projects - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "ProjectsCreate",
    component: () => import("@/views/Proyectos/CreateView.vue"),
  },
  {
    meta: {
      title: "Projects - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "ProjectsUpdate",
    component: () => import("@/views/Proyectos/UpdateView.vue"),
  },

]