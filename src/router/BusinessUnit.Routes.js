const url = "/setup/businessUnit";
export default [
  {
    meta: {
      title: "Business unit", requiresAuth: true,
    },
    path: url,
    name: "BusinessUnit",
    component: () => import("@/views/BusinessUnit/IndexView.vue"),
  },
  {
    meta: {
      title: "Business unit - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "BusinessUnitCreate",
    component: () => import("@/views/BusinessUnit/CreateView.vue"),
  },
  {
    meta: {
      title: "Business unit - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "BusinessUnitUpdate",
    component: () => import("@/views/BusinessUnit/UpdateView.vue"),
  },

]