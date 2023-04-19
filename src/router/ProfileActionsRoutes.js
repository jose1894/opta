const url = "/setup/profileActions";
export default [
  {
    meta: {
      title: "Profile actions", requiresAuth: true,
    },
    path: url,
    name: "Profile actions",
    component: () => import("@/views/ProfileActions/IndexView.vue"),
  },
  {
    meta: {
      title: "Profile actions - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "ProfileActionsCreate",
    component: () => import("@/views/ProfileActions/CreateView.vue"),
  },
  {
    meta: {
      title: "Profile actions - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "ProfileActionsUpdate",
    component: () => import("@/views/ProfileActions/UpdateView.vue"),
  },

]