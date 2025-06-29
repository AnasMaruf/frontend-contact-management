<template>
  <form @submit.prevent="onSubmit">
    <div class="mb-5">
      <InputField
        v-model="form.street"
        icon="fa-road"
        label="Street"
        placeholder="Enter street address"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
      <InputField
        v-model="form.city"
        icon="fa-city"
        label="City"
        placeholder="Enter city address"
      />
      <InputField
        v-model="form.province"
        icon="fa-map"
        label="Province/State"
        placeholder="Enter province/state"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      <InputField
        v-model="form.country"
        icon="fa-flag"
        label="Country"
        placeholder="Enter country"
      />
      <InputField
        v-model="form.postal_code"
        icon="fa-hashtag"
        label="Postal Code"
        placeholder="Enter postal code"
      />
    </div>

    <div class="flex justify-end space-x-4">
      <RouterLink
        :to="`/dashboard/contacts/${id}`"
        class="px-5 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center shadow-md"
      >
        <i class="fas fa-times mr-2"></i> Cancel
      </RouterLink>
      <button
        type="submit"
        class="px-5 py-3 bg-gradient text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-lg transform hover:-translate-y-0.5 flex items-center"
      >
        <i :class="`fas ${submitIcon} mr-2`"></i> {{ submitText }}
      </button>
    </div>
  </form>
</template>
<script setup>
import InputField from "../base/InputField.vue";
const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
  form: Object,
  onSubmit: Function,
  submitText: String,
  submitIcon: String,
});
</script>
<style scoped></style>
