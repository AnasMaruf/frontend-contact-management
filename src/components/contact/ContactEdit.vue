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
<style scoped></style>
