export default [
  {
    path: "/:idGroup/groups",
    name: "Groups",
    component: async () => await import('@/modules/users/pages/Groups.vue')
  },
  {
    path: "/:idGroup/groups/groupDetail/:id",
    name: "GroupDetail",
    component: async () => await import('@/modules/users/pages/GroupDetail.vue')
  },
  {
    path: "/:idGroup/groups/groupDetail/:id/logs/:idDevice",
    name: "Logs",
    component: async () => await import('@/modules/users/pages/LogsDevice.vue')
  },
  {
    path: "/:idGroup/groups/groupDetail/:id/logs/:idDevice/log/:idLog",
    name: "LogDetail",
    component: async () => await import('@/modules/users/pages/LogDetail.vue')
  },
  {
    path: "/:idGroup/createUser",
    name: "CreateUser",
    component: async () => await import('@/modules/users/pages/CreateUser.vue')
  },
  {
    path: "/:idGroup/newGroup",
    name: "NewGroup",
    component: async () => await import('@/modules/users/pages/NewGroup.vue')
  },
  {
    path: "/:idGroup/asignUser",
    name: "AsignUser",
    component: async () => await import('@/modules/users/pages/AsignUser.vue')
  },
  {
    path: "/:idGroup/associateDeviceGroup",
    name: "AssociateDeviceGroup",
    component: async () => await import('@/modules/users/pages/AssociateDeviceGroup.vue')
  },

]
