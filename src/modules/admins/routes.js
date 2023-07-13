export default [
  {
    path: "/admins",
    name: "Admins",
    component: async () => await import('@/modules/admins/pages/Admins.vue')
  }
]
