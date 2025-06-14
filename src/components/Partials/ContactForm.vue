<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
      <InputField
        v-model="form.first_name"
        icon="fa-user-tag"
        label="First Name"
        placeholder="Enter first name"
      />
      <InputField
        v-model="form.last_name"
        icon="fa-user-tag"
        label="Last Name"
        placeholder="Enter last name"
      />
    </div>

    <InputField
      v-model="form.email"
      type="email"
      icon="fa-envelope"
      label="Email"
      placeholder="Enter email"
      class="mb-5"
    />
    <InputField
      v-model="form.phone"
      type="tel"
      icon="fa-phone"
      label="Phone"
      placeholder="Enter phone"
      class="mb-6"
    />

    <div class="flex justify-end space-x-4">
      <RouterLink
        to="/dashboard/contacts"
        class="px-5 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
      >
        <i class="fas fa-times mr-2"></i> Cancel
      </RouterLink>
      <button
        type="submit"
        class="px-5 py-3 bg-gradient text-white rounded-lg hover:opacity-90"
      >
        <i :class="`fas ${submitIcon} mr-2`"></i> {{ submitText }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { toRefs } from "vue";
import { RouterLink } from "vue-router";
import InputField from "../base/InputField.vue"; // Komponen input kecil

const props = defineProps({
  form: Object,
  onSubmit: Function,
  submitText: String,
  submitIcon: String,
});
</script>
