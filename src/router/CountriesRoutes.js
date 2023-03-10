export default [
  {
    meta: {
      title: "Countries", requiresAuth: true,
    },
    path: "/setup/countries",
    name: "Countries",
    component: () => import("@/views/Country/IndexView.vue"),
  },
  {
    meta: {
      title: "Countries - create ", requiresAuth: true,
    },
    path: "/setup/countries/create",
    name: "CountriesCreate",
    component: () => import("@/views/Country/CreateView.vue"),
  },

]