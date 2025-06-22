import { createRouter, createWebHistory } from "vue-router"
import Dashboard from "@/views/Dashboard.vue"
import Managers from "@/views/Managers.vue"
import Workers from "@/views/Workers.vue"

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/managers",
    name: "Managers",
    component: Managers,
  },
  {
    path: "/workers",
    name: "Workers",
    component: Workers,
  },
  {
    path: "/delivery",
    name: "Delivery",
    component: () => import("@/views/Delivery.vue"),
  },
  {
    path: "/stores",
    name: "Stores",
    component: () => import("@/views/Stores.vue"),
  },
  {
    path: "/expenses",
    name: "Expenses",
    component: () => import("@/views/Expenses.vue"),
  },
  {
    path: "/warehouse",
    name: "Warehouse",
    component: () => import("@/views/Warehouse.vue"),
  },
  {
    path: "/bread-types",
    name: "BreadTypes",
    component: () => import("@/views/BreadTypes.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/views/Settings.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
