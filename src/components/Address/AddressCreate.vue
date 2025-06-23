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
              {{ contact.first_name }} {{ contact.last_name }}
            </h2>
            <p class="text-gray-300 text-sm">
              {{ contact.email }} • {{ contact.phone }}
            </p>
          </div>
        </div>
      </div>

      <AddressForm
        :onSubmit="handleSubmit"
        :form="address"
        submitText="Create Address"
        submitIcon="fa-plus-circle"
      />
    </div>
  </div>
</template>
<script setup>
import { useSessionStorage } from "@vueuse/core";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { onMounted, reactive } from "vue";
import { ContactDetail } from "../../lib/api/ContactApi";
import { addressCreate } from "../../lib/api/AddressApi";
import { alertSuccess } from "../../lib/alert";
import AddressForm from "../Partials/AddressForm.vue";

const route = useRoute();
const router = useRouter();
const { id } = route.params;
const token = useSessionStorage("token", "");
const contact = reactive({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
});

const address = reactive({
  street: "",
  city: "",
  province: "",
  country: "",
  postal_code: "",
});

async function handleSubmit() {
  const response = await addressCreate(token.value, id, address);
  const responseBody = await response.json();
  console.log(responseBody);

  if (response.status === 200) {
    await alertSuccess("Address created successfully!");
    await router.push({
      path: `/dashboard/contacts/${id}`,
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
  await fetchContact();
});
</script>
<style scoped></style>
