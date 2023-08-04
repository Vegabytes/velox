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
  },
  {
    path: "/asignUser",
    name: "AsignUser",
    component: async () => await import('@/modules/users/pages/AsignUser.vue')
  },
  {
    path: "/users",
    name: "Users",
    component: async () => await import('@/modules/users/pages/Users.vue')
  },
]
