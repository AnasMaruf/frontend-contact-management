<!-- <template>
  <div class="flex items-center mb-6">
    <RouterLink
      to="/dashboard/contacts"
      class="text-blue-400 hover:text-blue-300 mr-4 flex items-center transition-colors duration-200"
    >
      <i class="fas fa-arrow-left mr-2"></i> Back to Contacts
    </RouterLink>
    <h1 class="text-2xl font-bold text-white flex items-center">
      <i class="fas fa-user-plus text-blue-400 mr-3"></i> Create New Contact
    </h1>
  </div>

  <div
    class="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden max-w-2xl mx-auto animate-fade-in"
  >
    <div class="p-8">
      <ContactForm
        :form="contact"
        :onSubmit="handleSubmit"
        submitText="Create Contact"
        submitIcon="fa-plus-circle"
      />
    </div>
  </div>
</template>
<script setup>
import { useSessionStorage } from "@vueuse/core";
import { reactive } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { ContactCreate } from "../../lib/api/ContactApi";
import { alertError, alertSuccess } from "../../lib/alert";
import ContactForm from "../Partials/ContactForm.vue";

const router = useRouter();
const token = useSessionStorage("token", "");
const contact = reactive({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
});

async function handleSubmit() {
  const response = await ContactCreate(token.value, contact);
  const responseBody = await response.json();
  // console.log(responseBody);

  if (response.status === 200) {
    await alertSuccess("Contact created successfully");
    await router.push({
      path: "/dashboard/contacts",
    });
  } else {
    await alertError(responseBody.errors);
  }
}
</script>
<style scoped></style> -->

<template>
  <div class="flex items-center mb-6">
    <RouterLink
      to="/dashboard/contacts"
      class="text-blue-400 hover:text-blue-300 mr-4 flex items-center transition-colors duration-200"
    >
      <i class="fas fa-arrow-left mr-2"></i> Back to Contacts
    </RouterLink>
    <h1 class="text-2xl font-bold text-white flex items-center">
      <i class="fas fa-user-plus text-blue-400 mr-3"></i> Create New Contact
    </h1>
  </div>

  <div
    class="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden max-w-2xl mx-auto animate-fade-in"
  >
    <div class="p-8">
      <!-- Loading state -->
      <div v-if="contactStore.isLoading" class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-blue-400 text-2xl mb-4"></i>
        <p class="text-gray-300">Creating contact...</p>
      </div>

      <!-- Contact Form -->
      <ContactForm
        v-else
        :form="contactStore.currentContact"
        :onSubmit="handleSubmit"
        submitText="Create Contact"
        submitIcon="fa-plus-circle"
        :disabled="contactStore.isLoading"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useContactStore } from "../../stores/contactStore";
import { useAuthStore } from "../../stores/authStore";
import ContactForm from "../Partials/ContactForm.vue";

const router = useRouter();
const contactStore = useContactStore();
const authStore = useAuthStore();

onMounted(() => {
  // Reset form ketika komponen dimount
  contactStore.resetCurrentContact();

  // Clear any previous errors
  contactStore.clearError();

  // Initialize auth jika belum
  if (!authStore.isLoggedIn) {
    authStore.initializeAuth();
  }
});

onUnmounted(() => {
  // Clear error ketika komponen di-unmount
  contactStore.clearError();
});

async function handleSubmit() {
  // Pastikan user sudah login
  if (!authStore.isLoggedIn) {
    await alertError("Please login first");
    router.push("/login");
    return;
  }

  try {
    const result = await contactStore.createContact(authStore.getToken);

    if (result.success) {
      // Redirect ke contacts page
      await router.push({
        path: "/dashboard/contacts",
      });
    }
    // Error handling sudah ditangani di store
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}
</script>

<style scoped>
/* Tambahan style untuk loading dan error states */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
