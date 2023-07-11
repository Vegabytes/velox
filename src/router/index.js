// Composables
import { createRouter, createWebHistory } from 'vue-router'
import {routes as adminsRoutes} from "@/modules/admins"
import {routes as loginRoutes} from "@/modules/login"
import {routes as usersRoutes} from "@/modules/users"

const routes = [
  ...adminsRoutes,
  ...loginRoutes,
  ...usersRoutes
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
