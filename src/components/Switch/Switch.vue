<template>
  <div class="flex justify-between items-center" @click="$emit('update:value',!value)">
    <div class="w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out cursor-pointer" :class="{ 'bg-green-400': value}">
      <div class="bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out" :class="{ 'translate-x-6': value,}"></div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['update:value'])
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
})

</script>