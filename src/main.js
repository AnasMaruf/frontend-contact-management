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

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
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
      children: [
        {
          path: "users/contacts",
          component: ContactList,
        },
        {
          path: "profile",
          component: UserProfile,
        },
        {
          path: "logout",
          component: UserLogout,
        },
      ],
    },
  ],
});

createApp(App).use(router).mount("#app");
