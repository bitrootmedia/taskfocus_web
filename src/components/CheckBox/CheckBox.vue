<template>
  <div class="inline-flex items-center gap-x-1">
    <input
        :id="id"
        :checked="value ? 'on' : ''"
        :value="value"
        @input="$emit('update:value', $event.target.checked)"
        type="checkbox"
        class="accent-green-c w-4 h-4 border-0 flex pl-8 pr-3 py-3 rounded-[6px] text-sm ease-linear transition-all duration-150 cursor-pointer"
    />
    <label :for="id" class="text-sm text-[#474D66] cursor-pointer whitespace-nowrap">{{label}}</label>
  </div>
</template>

<script setup>
const props = defineProps({
  label:{
    type: String,
    default: ''
  },
  id:{
    type: String,
    default: ''
  }
})
</script>
