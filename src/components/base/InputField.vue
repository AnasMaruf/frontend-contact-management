<template>
  <div :class="class">
    <label class="block text-gray-300 text-sm font-medium mb-2">{{
      label
    }}</label>
    <div class="relative">
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <i :class="`fas ${icon} text-gray-500`"></i>
      </div>
      <input
        :type="type"
        :value="modelValue"
        class="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  icon: String,
  placeholder: String,
  type: {
    type: String,
    default: "text",
  },
  class: {
    type: String,
    default: "",
  },
});
defineEmits(["update:modelValue"]);
</script>
