const url = "/setup/categories";
export default [
  {
    meta: {
      title: "Categories", requiresAuth: true,
    },
    path: url,
    name: "Categories",
    component: () => import("@/views/Categoria/IndexView.vue"),
  },
  {
    meta: {
      title: "Categories - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "CategoriesCreate",
    component: () => import("@/views/Categoria/CreateView.vue"),
  },
  {
    meta: {
      title: "Categories - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "CategoriesUpdate",
    component: () => import("@/views/Categoria/UpdateView.vue"),
  },
]