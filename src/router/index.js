// Composables
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { routes as loginRoutes } from "@/modules/login"
import { routes as usersRoutes } from "@/modules/users"



const routes = [
  ...loginRoutes,
  ...usersRoutes,
  {
    path: "/:catchAll(.*)",
    name: "Error",
    component: async () => await import('@/views/Error')
  },
]



const router = createRouter({
  //history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
  strict: true
})

export default router
