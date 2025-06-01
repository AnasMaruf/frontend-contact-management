<template></template>
<script setup>
import { useLocalStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { UserLogout } from "../../lib/api/UserApi";
import { alertError } from "../../lib/alert";
import { onBeforeMount } from "vue";

const token = useLocalStorage("token", "");
const router = useRouter();

async function handleLogout() {
  const response = await UserLogout(token.value);
  const responseBody = await response.json();
  console.log(responseBody);

  if (response.status === 200) {
    token.value = "";
    await router.push({
      path: "/login",
    });
  } else {
    await alertError(responseBody.errors);
  }
}
onBeforeMount(async () => {
  await handleLogout();
});
</script>
<style scoped></style>
