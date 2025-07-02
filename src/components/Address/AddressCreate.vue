<template>
  <div class="flex items-center mb-6">
    <RouterLink
      :to="`/dashboard/contacts/${id}`"
      class="text-blue-400 hover:text-blue-300 mr-4 flex items-center transition-colors duration-200"
    >
      <i class="fas fa-arrow-left mr-2"></i> Back to Contact Details
    </RouterLink>
    <h1 class="text-2xl font-bold text-white flex items-center">
      <i class="fas fa-plus-circle text-blue-400 mr-3"></i> Add New Address
    </h1>
  </div>

  <div
    class="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden max-w-2xl mx-auto animate-fade-in"
  >
    <div class="p-8">
      <!-- Contact Information -->
      <div class="mb-6 pb-6 border-b border-gray-700">
        <div class="flex items-center">
          <div
            class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 shadow-md"
          >
            <i class="fas fa-user text-white"></i>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-white">
              {{ contactStore.currentContact.first_name }}
              {{ contactStore.currentContact.last_name }}
            </h2>
            <p class="text-gray-300 text-sm">
              {{ contactStore.currentContact.email }} •
              {{ contactStore.currentContact.phone }}
            </p>
          </div>
        </div>
      </div>

      <AddressForm
        :id="id"
        :onSubmit="handleSubmit"
        :form="addressStore.currentAddress"
        submitText="Create Address"
        submitIcon="fa-plus-circle"
        :disabled="addressStore.isLoading"
      />
    </div>
  </div>
</template>
<script setup>
import { useSessionStorage } from "@vueuse/core";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { ContactDetail } from "../../lib/api/ContactApi";
import AddressForm from "../Partials/AddressForm.vue";
import { useAddressStore } from "../../stores/addressStore";
import { useAuthStore } from "../../stores/authStore";
import { useContactStore } from "../../stores/contactStore";
const route = useRoute();
const router = useRouter();
const addressStore = useAddressStore();
const contactStore = useContactStore();
const authStore = useAuthStore();
const id = computed(() => Number(route.params.id));

onMounted(async () => {
  addressStore.resetCurrentAddress();
  addressStore.clearError();
  if (!authStore.isLoggedIn) {
    authStore.initializeAuth();
  }
  // Tunggu sampai token muncul
  if (!authStore.getToken) {
    console.warn("Token belum tersedia, tidak bisa fetch contact");
    return;
  }
  await fetchContact();
});

onUnmounted(() => {
  addressStore.clearError();
});

async function handleSubmit() {
  if (!authStore.isLoggedIn) {
    await alertError("Please login first");
    router.push("/login");
    return;
  }

  try {
    const result = await addressStore.createAddress(
      authStore.getToken,
      id.value
    );
    console.log("Address creation result:", result);

    if (result.success) {
      await router.push({
        path: `/dashboard/contacts/${id.value}`,
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
  // const response = await addressCreate(token.value, id, address);
  // const responseBody = await response.json();
  // console.log(responseBody);

  // if (response.status === 200) {
  //   await alertSuccess("Address created successfully!");
  //   await router.push({
  //     path: `/dashboard/contacts/${id}`,
  //   });
  // } else {
  //   await alertError(responseBody.errors);
  // }
}

async function fetchContact() {
  const response = await ContactDetail(authStore.getToken, id.value);
  const responseBody = await response.json();

  if (response.status === 200) {
    contactStore.setCurrentContact(responseBody.data);
  } else {
    await alertError(responseBody.errors);
  }
}
</script>
<style scoped></style>
