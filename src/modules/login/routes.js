export default [
  {
    path: "/",
    name: "Inicio",
    component: async () => await import('@/modules/login/pages/Login')
  },
  {
    path: "/login",
    name: "Login",
    component: async () => await import('@/modules/login/pages/Login')
  },
  {
    path: "/create",
    name: "Create",
    component: async () => await import('@/modules/login/pages/Create')
  },
]
