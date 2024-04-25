<template>
  <div class="flex justify-between items-center" @click="$emit('update:value',!value)">
    <div
        class="w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out cursor-pointer border"
        :class="{ 'bg-green-c border-transparent': value, 'border-light-bg-c': !value}">
      <div class="w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out"
           :class="{ 'translate-x-[18px] bg-white': value, 'bg-light-c': !value}"></div>
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