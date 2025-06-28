<!-- <template>
  <div class="flex items-center mb-6">
    <RouterLink
      to="/dashboard/contacts"
      class="text-blue-400 hover:text-blue-300 mr-4 flex items-center transition-colors duration-200"
    >
      <i class="fas fa-arrow-left mr-2"></i> Back to Contacts
    </RouterLink>
    <h1 class="text-2xl font-bold text-white flex items-center">
      <i class="fas fa-user-edit text-blue-400 mr-3"></i> Edit Contact
    </h1>
  </div>

  <div
    class="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden max-w-2xl mx-auto animate-fade-in"
  >
    <div class="p-8">
      <ContactForm
        :form="contact"
        :onSubmit="handleSubmit"
        submitText="Save Changes"
        submitIcon="fa-save"
      />
    </div>
  </div>
</template>
<script setup>
import { useSessionStorage } from "@vueuse/core";
import { onMounted, reactive } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { ContactDetail, ContactUpdate } from "../../lib/api/ContactApi";
import { alertError, alertSuccess } from "../../lib/alert";
import ContactForm from "../Partials/ContactForm.vue";

const route = useRoute();
const router = useRouter();
const { id } = route.params;
const contact = reactive({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
});

const token = useSessionStorage("token", "");

async function handleSubmit() {
  const response = await ContactUpdate(token.value, id, contact);
  const responseBody = await response.json();
  // console.log(responseBody);

  if (response.status === 200) {
    await alertSuccess("Contact updated successfully!");
    await router.push({
      path: "/dashboard/contacts",
    });
  } else {
    await alertError(responseBody.errors);
  }
}
async function fetchContact() {
  const response = await ContactDetail(token.value, id);
  const responseBody = await response.json();
  console.log(responseBody);

  if (response.status === 200) {
    contact.first_name = responseBody.data.first_name;
    contact.last_name = responseBody.data.last_name;
    contact.email = responseBody.data.email;
    contact.phone = responseBody.data.phone;
  } else {
    await alertError(responseBody.errors);
  }
}

onMounted(async () => {
  console.log("Mounted! ID:", id);
  await fetchContact();
});
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
      <i class="fas fa-user-edit text-blue-400 mr-3"></i> Edit Contact
    </h1>
  </div>

  <div
    class="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden max-w-2xl mx-auto animate-fade-in"
  >
    <div class="p-8">
      <!-- Loading state saat fetch data -->
      <div v-if="isInitialLoading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-blue-400 text-3xl mb-4"></i>
        <p class="text-gray-300 text-lg">Loading contact details...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="contactStore.hasError" class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-red-400 text-3xl mb-4"></i>
        <p class="text-red-300 text-lg mb-4">Failed to load contact</p>
        <p class="text-gray-400 mb-6">{{ contactStore.error }}</p>
        <button
          @click="fetchContactData"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          <i class="fas fa-redo mr-2"></i> Retry
        </button>
      </div>

      <!-- Contact Form -->
      <div v-else>
        <!-- Loading overlay saat submit -->
        <div
          v-if="contactStore.isLoading && !isInitialLoading"
          class="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-10 rounded-xl"
        >
          <div class="text-center">
            <i class="fas fa-spinner fa-spin text-blue-400 text-2xl mb-4"></i>
            <p class="text-gray-300">Saving changes...</p>
          </div>
        </div>

        <!-- Form Error Display -->
        <div
          v-if="contactStore.hasError && !isInitialLoading"
          class="mb-4 p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg"
        >
          <i class="fas fa-exclamation-triangle text-red-400 mr-2"></i>
          <span class="text-red-300">{{ contactStore.error }}</span>
        </div>

        <ContactForm
          :form="contactStore.currentContact"
          :onSubmit="handleSubmit"
          submitText="Save Changes"
          submitIcon="fa-save"
          :disabled="contactStore.isLoading"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useContactStore } from "../../stores/contactStore";
import { useAuthStore } from "../../stores/authStore";
import ContactForm from "../Partials/ContactForm.vue";

const route = useRoute();
const router = useRouter();
const contactStore = useContactStore();
const authStore = useAuthStore();

const { id } = route.params;
const isInitialLoading = ref(true);

// Computed untuk mendeteksi loading state yang berbeda
const isFormReady = computed(() => {
  return !isInitialLoading.value && !contactStore.hasError;
});

onMounted(async () => {
  console.log("Edit Contact Mounted! ID:", id);

  // Clear any previous errors
  contactStore.clearError();

  // Initialize auth jika belum
  if (!authStore.isLoggedIn) {
    authStore.initializeAuth();
  }

  // Check if user is authenticated
  if (!authStore.isLoggedIn) {
    await alertError("Please login first");
    router.push("/login");
    return;
  }

  await fetchContactData();
});

onUnmounted(() => {
  // Clear error dan reset form ketika komponen di-unmount
  contactStore.clearError();
  contactStore.resetCurrentContact();
});

async function fetchContactData() {
  isInitialLoading.value = true;

  try {
    const result = await contactStore.getContactDetail(authStore.getToken, id);

    if (!result.success) {
      console.error("Failed to fetch contact:", result.errors || result.error);
    }
  } catch (error) {
    console.error("Unexpected error while fetching contact:", error);
  } finally {
    isInitialLoading.value = false;
  }
}

async function handleSubmit() {
  // Pastikan user masih login
  if (!authStore.isLoggedIn) {
    await alertError("Session expired. Please login again.");
    router.push("/login");
    return;
  }

  try {
    const result = await contactStore.updateContact(authStore.getToken, id);

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
/* Loading animations */
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

/* Loading overlay positioning */
.relative {
  position: relative;
}
</style>
