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
 {
    meta: {
      title: "Audit Approach ", requiresAuth: true,
    },
    path: `${url}/auditApproach/:codigo/:nombre`,
    name: "AuditApproach",
    component: () => import("@/views/Papers/AuditApproachView.vue"),
  }
]