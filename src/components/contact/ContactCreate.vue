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
import { useLocalStorage } from "@vueuse/core";
import { reactive } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { ContactCreate } from "../../lib/api/ContactApi";
import { alertError, alertSuccess } from "../../lib/alert";
import ContactForm from "../Partials/ContactForm.vue";

const router = useRouter();
const token = useLocalStorage("token", "");
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
<style scoped></style>
