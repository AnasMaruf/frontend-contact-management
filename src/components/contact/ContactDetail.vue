<template>
  <div class="flex items-center mb-6">
    <RouterLink
      to="/dashboard/contacts"
      class="text-blue-400 hover:text-blue-300 mr-4 flex items-center transition-colors duration-200"
    >
      <i class="fas fa-arrow-left mr-2"></i> Back to Contacts
    </RouterLink>
    <h1 class="text-2xl font-bold text-white flex items-center">
      <i class="fas fa-id-card text-blue-400 mr-3"></i> Contact Details
    </h1>
  </div>
  <div>
    <div
      class="bg-gray-800 bg-opacity-80 rounded-xl shadow-custom border border-gray-700 overflow-hidden max-w-2xl mx-auto animate-fade-in"
    >
      <div class="p-8">
        <!-- Contact Header -->
        <div class="mb-8 text-center">
          <div
            class="w-20 h-20 bg-gradient rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg"
          >
            <i class="fas fa-user text-3xl text-white"></i>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">
            {{ contact.first_name }} {{ contact.last_name }}
          </h2>
          <div class="w-24 h-1 bg-gradient mx-auto rounded-full"></div>
        </div>

        <!-- Contact Information -->
        <div class="space-y-5 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              class="bg-gray-700 bg-opacity-50 p-5 rounded-lg shadow-md border border-gray-600 transition-all duration-200 hover:bg-opacity-70"
            >
              <div class="flex items-center mb-2">
                <i class="fas fa-user-tag text-blue-400 mr-2"></i>
                <h3 class="text-gray-300 text-sm font-medium">First Name</h3>
              </div>
              <p class="text-white text-lg ml-6">{{ contact.first_name }}</p>
            </div>
            <div
              class="bg-gray-700 bg-opacity-50 p-5 rounded-lg shadow-md border border-gray-600 transition-all duration-200 hover:bg-opacity-70"
            >
              <div class="flex items-center mb-2">
                <i class="fas fa-user-tag text-blue-400 mr-2"></i>
                <h3 class="text-gray-300 text-sm font-medium">Last Name</h3>
              </div>
              <p class="text-white text-lg ml-6">{{ contact.last_name }}</p>
            </div>
          </div>

          <div
            class="bg-gray-700 bg-opacity-50 p-5 rounded-lg shadow-md border border-gray-600 transition-all duration-200 hover:bg-opacity-70"
          >
            <div class="flex items-center mb-2">
              <i class="fas fa-envelope text-blue-400 mr-2"></i>
              <h3 class="text-gray-300 text-sm font-medium">Email</h3>
            </div>
            <p class="text-white text-lg ml-6">{{ contact.email }}</p>
          </div>

          <div
            class="bg-gray-700 bg-opacity-50 p-5 rounded-lg shadow-md border border-gray-600 transition-all duration-200 hover:bg-opacity-70"
          >
            <div class="flex items-center mb-2">
              <i class="fas fa-phone text-blue-400 mr-2"></i>
              <h3 class="text-gray-300 text-sm font-medium">Phone</h3>
            </div>
            <p class="text-white text-lg ml-6">{{ contact.phone }}</p>
          </div>
        </div>

        <!-- Addresses Section -->
        <div class="mb-8">
          <div class="flex items-center mb-5">
            <i class="fas fa-map-marker-alt text-blue-400 mr-3"></i>
            <h3 class="text-xl font-semibold text-white">Addresses</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Add Address Card -->
            <div
              class="bg-gray-700 bg-opacity-50 p-5 rounded-lg border-2 border-dashed border-gray-600 shadow-md card-hover"
            >
              <RouterLink
                :to="`/dashboard/contacts/${id}/addresses/create`"
                class="block h-full"
              >
                <div
                  class="flex flex-col items-center justify-center h-full text-center py-4"
                >
                  <div
                    class="w-16 h-16 bg-gradient rounded-full flex items-center justify-center mb-4 shadow-lg transform transition-transform duration-300 hover:scale-110"
                  >
                    <i class="fas fa-plus text-2xl text-white"></i>
                  </div>
                  <h4 class="text-lg font-semibold text-white">Add Address</h4>
                </div>
              </RouterLink>
            </div>

            <!-- Address Card 1 -->
            <AddressCard
              v-for="address in addresses"
              :key="address.id"
              :id="id"
              :address="address"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <RouterLink
            to="/dashboard/contacts"
            class="px-5 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center shadow-md"
          >
            <i class="fas fa-arrow-left mr-2"></i> Back
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useSessionStorage } from "@vueuse/core";
import { RouterLink, useRoute } from "vue-router";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert";
import { ContactDetail } from "../../lib/api/ContactApi";
import { onMounted, reactive, ref } from "vue";
import { addressDelete, addressList } from "../../lib/api/AddressApi";
import AddressCard from "../Partials/AddressCard.vue";

const route = useRoute();
const { id } = route.params;
const token = useSessionStorage("token", "");
const contact = reactive({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
});
const addresses = ref([]);

async function handleDeleteAddress(addressId) {
  if (!(await alertConfirm("Are you sure?"))) {
    return;
  }
  const response = await addressDelete(token.value, id, addressId);
  const responseBody = await response.json();
  // console.log(responseBody);

  if (response.status === 200) {
    await alertSuccess("Address deleted successfully!");
    await fetchAddresses();
  } else {
    await alertError(responseBody.errors);
  }
}
async function fetchAddresses() {
  const response = await addressList(token.value, id);
  const responseBody = await response.json();
  // console.log(responseBody);

  if (response.status === 200) {
    addresses.value = responseBody.data;
  } else {
    await alertError(responseBody.errors);
  }
}

async function fetchContact() {
  const response = await ContactDetail(token.value, id);
  const responseBody = await response.json();
  // console.log(responseBody);

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
  await fetchAddresses();
});
</script>
<style scoped></style>
