export default [
  {
    path: "/admins",
    name: "Admins",
    component: async () => await import('@/modules/admins/pages/Admins.vue')
  },
  {
    path: "/admins/nuevoUsuario",
    name: "nuevoUsuario",
    component: async () => await import('@/modules/admins/pages/newUser.vue')
  }
]
