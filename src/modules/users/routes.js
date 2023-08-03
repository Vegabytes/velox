export default [
  {
    path: "/user",
    name: "User",
    component: async () => await import('@/modules/users/pages/User.vue')
  },
  {
    path: "/createUser",
    name: "CreateUser",
    component: async () => await import('@/modules/users/pages/CreateUser.vue')
  }
]
