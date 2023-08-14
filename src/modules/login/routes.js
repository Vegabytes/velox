export default [
  /*   {
      path: "/",
      name: "Inicio",
      component: async () => await import('@/modules/login/pages/Login')
    }, */
  {
    path: "/:idGroup/login",
    name: "Login",
    component: async () => await import('@/modules/login/pages/Login')
  }
]
