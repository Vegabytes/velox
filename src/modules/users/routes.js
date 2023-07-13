export default [
  {
    path: "/users",
    name: "Users",
    component: async () => await import('@/modules/users/pages/Users.vue')
  }
]
