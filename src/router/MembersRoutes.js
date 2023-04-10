const url = "/setup/members";
export default [
  {
    meta: {
      title: "Members", requiresAuth: true,
    },
    path: url,
    name: "Members",
    component: () => import("@/views/Member/IndexView.vue"),
  },
  {
    meta: {
      title: "Member - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "MembersCreate",
    component: () => import("@/views/Member/CreateView.vue"),
  },
  {
    meta: {
      title: "Member - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "MembersUpdate",
    component: () => import("@/views/Member/UpdateView.vue"),
  },

]