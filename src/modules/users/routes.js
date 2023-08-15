export default [
  {
    path: "/:idGroup/groups",
    name: "Groups",
    component: async () => await import('@/modules/users/pages/User.vue')
  },
  {
    path: "/:idGroup/groups/groupDetail/:id",
    name: "GroupDetail",
    component: async () => await import('@/modules/users/pages/GroupDetail.vue')
  },
  {
    path: "/:idGroup/createUser",
    name: "CreateUser",
    component: async () => await import('@/modules/users/pages/CreateUser.vue')
  },
  {
    path: "/:idGroup/asignUser",
    name: "AsignUser",
    component: async () => await import('@/modules/users/pages/AsignUser.vue')
  },
  {
    path: "/:idGroup/users",
    name: "Users",
    component: async () => await import('@/modules/users/pages/Users.vue')
  },
]
