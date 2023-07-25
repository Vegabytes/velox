export default [
  {
    path: "/admin",
    name: "Admin",
    component: async () => await import('@/modules/admins/pages/Admin.vue')
  },
  {
    path: "/admins/nuevoUsuario",
    name: "nuevoUsuario",
    component: async () => await import('@/modules/admins/pages/newUser.vue')
  }
]
