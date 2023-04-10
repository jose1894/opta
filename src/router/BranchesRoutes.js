const url = "/setup/branches";
export default [
  {
    meta: {
      title: "Branches", requiresAuth: true,
    },
    path: url,
    name: "Branches",
    component: () => import("@/views/Branch/IndexView.vue"),
  },
  {
    meta: {
      title: "Branch - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "BranchesCreate",
    component: () => import("@/views/Branch/CreateView.vue"),
  },
  {
    meta: {
      title: "Branch - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "BranchesUpdate",
    component: () => import("@/views/Branch/UpdateView.vue"),
  },

]