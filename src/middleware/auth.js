export default function authGuard(to, from, next) {
  const isLoggedIn = !!sessionStorage.getItem("token");

  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    next("/login");
  } else {
    next();
  }
}
