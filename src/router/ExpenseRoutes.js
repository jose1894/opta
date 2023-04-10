const url = "/setup/expense";
export default [
  {
    meta: {
      title: "Expense", requiresAuth: true,
    },
    path: url,
    name: "Expense",
    component: () => import("@/views/Expense/IndexView.vue"),
  },
  {
    meta: {
      title: "Expense - create ", requiresAuth: true,
    },
    path: `${url}/create`,
    name: "ExpenseCreate",
    component: () => import("@/views/Expense/CreateView.vue"),
  },
  {
    meta: {
      title: "Expense - update ", requiresAuth: true,
    },
    path: `${url}/update/:id`,
    name: "ExpenseUpdate",
    component: () => import("@/views/Expense/UpdateView.vue"),
  },

]