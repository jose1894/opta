const url = "/setup/allies";
export default [
  {
    meta: {
      title: "Allies", requiresAuth: true,
    },
    path: url,
    name: "Allies",
    component: () => import("@/views/Allies/IndexView.vue"),
  },
  {
    meta: {
      title: "Ally - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "AlliesCreate",
    component: () => import("@/views/Allies/CreateView.vue"),
  },
  /*{
    meta: {
      title: "Cities - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "CitiesUpdate",
    component: () => import("@/views/City/UpdateView.vue"),
  },*/

]