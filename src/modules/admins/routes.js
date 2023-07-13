export default [
<<<<<<< HEAD
  {
    path: "/admins",
    name: "Admins",
    component: async () => await import('@/modules/admins/pages/Admins.vue')
  }
]
=======
    {
        path: "/admins",
        name:"Admins",
        component:async()=> await import('@/modules/admins/pages/Admins.vue')
    },
    {
        path: "/admins/nuevoUsuario",
        name:"nuevoUsuario",
        component:async()=> await import('@/modules/admins/pages/newUser.vue')
    }
]
>>>>>>> 1d749eb6319078c064f992e7fbab6136e494a27f
