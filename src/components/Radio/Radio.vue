<template>
  <div class="inline-flex items-center gap-x-1">
    <input
        :id="id"
        :value="value"
        @input="$emit('update:value', version)"
        type="radio"
        :name="name"
        class="accent-green-c w-4 h-4 border-0 flex pl-8 pr-3 py-3 rounded text-sm ease-linear transition-all duration-150 cursor-pointer"
    />
    <label :for="id"
           class="text-sm text-[#474D66] cursor-pointer whitespace-nowrap">{{ label }}</label>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  version: {
    type: [String,Number],
    default: ''
  }
})
</script>

<style scoped>

</style>