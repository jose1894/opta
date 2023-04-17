const url = "/setup/memberships";
export default [
  {
    meta: {
      title: "Memberships", requiresAuth: true,
    },
    path: url,
    name: "Memberships",
    component: () => import("@/views/Member/IndexView.vue"),
  },
  {
    meta: {
      title: "Membership - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "MembershipsCreate",
    component: () => import("@/views/Member/CreateView.vue"),
  },
  {
    meta: {
      title: "Membership - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "MembershipsUpdate",
    component: () => import("@/views/Member/UpdateView.vue"),
  },

]