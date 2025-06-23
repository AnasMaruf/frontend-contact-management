import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import Layout from "./components/Layout.vue";
import UserRegister from "./components/user/UserRegister.vue";
import UserLogin from "./components/user/UserLogin.vue";
import DashboardLayout from "./components/DashboardLayout.vue";
import ContactList from "./components/contact/ContactList.vue";
import UserProfile from "./components/user/UserProfile.vue";
import UserLogout from "./components/user/UserLogout.vue";
import ContactCreate from "./components/contact/ContactCreate.vue";
import ContactEdit from "./components/contact/ContactEdit.vue";
import ContactDetail from "./components/contact/ContactDetail.vue";
import AddressCreate from "./components/Address/AddressCreate.vue";
import AddressEdit from "./components/Address/AddressEdit.vue";
import authGuard from "./middleware/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
      component: Layout,
      children: [
        {
          path: "/register",
          component: UserRegister,
        },
        {
          path: "/login",
          component: UserLogin,
        },
      ],
    },
    {
      component: DashboardLayout,
      path: "/dashboard",
      redirect: "/dashboard/contacts",
      meta: { requiresAuth: true },
      children: [
        {
          path: "contacts",
          component: ContactList,
          meta: { requiresAuth: true },
        },
        {
          path: "contacts/create",
          component: ContactCreate,
          meta: { requiresAuth: true },
        },
        {
          path: "contacts/:id/edit",
          component: ContactEdit,
          meta: { requiresAuth: true },
        },
        {
          path: "contacts/:id",
          component: ContactDetail,
          meta: { requiresAuth: true },
        },
        {
          path: "contacts/:id/addresses/create",
          component: AddressCreate,
          meta: { requiresAuth: true },
        },
        {
          path: "contacts/:id/addresses/:addressId/edit",
          component: AddressEdit,
          meta: { requiresAuth: true },
        },
        {
          path: "users/profile",
          component: UserProfile,
          meta: { requiresAuth: true },
        },
        {
          path: "users/logout",
          component: UserLogout,
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
});

router.beforeEach(authGuard);

createApp(App).use(router).mount("#app");
