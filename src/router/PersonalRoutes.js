const url = "/setup/personal";
export default [
  {
    meta: {
      title: "Personal", requiresAuth: true,
    },
    path: url,
    name: "Personal",
    component: () => import("@/views/Personal/IndexView.vue"),
  },
  {
    meta: {
      title: "Personal - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "PersonalesCreate",
    component: () => import("@/views/Personal/CreateView.vue"),
  },
  {
    meta: {
      title: "Personal - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "PersonalesUpdate",
    component: () => import("@/views/Personal/UpdateView.vue"),
  },

]