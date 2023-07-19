const url = "/setup/papers";
export default [
  {
    meta: {
      title: "Papers", requiresAuth: true,
    },
    path: url,
    name: "Papers",
    component: () => import("@/views/Papers/IndexView.vue"),
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