const url = "/setup/itemsMenu";
export default [
  {
    meta: {
      title: "Items menu", requiresAuth: true,
    },
    path: url,
    name: "Items menu",
    component: () => import("@/views/MenuItems/IndexView.vue"),
  },
  {
    meta: {
      title: "Items menu - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "ItemsMenuCreate",
    component: () => import("@/views/MenuItems/CreateView.vue"),
  },
  {
    meta: {
      title: "Items menu - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "ItemsMenuUpdate",
    component: () => import("@/views/MenuItems/UpdateView.vue"),
  },

]