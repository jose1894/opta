const url = "/setup/approaches";
export default [
  {
    meta: {
      title: "Approaches", requiresAuth: true,
    },
    path: url,
    name: "Approaches",
    component: () => import("@/views/Approaches/IndexView.vue"),
  },
 /* {
    meta: {
      title: "Approach - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "ApproachesCreate",
    component: () => import("@/views/Approaches/CreateView.vue"),
  },
  {
    meta: {
      title: "Approach - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "ApproachesUpdate",
    component: () => import("@/views/Approaches/UpdateView.vue"),
  },*/

]