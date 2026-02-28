<template>
  <div class="relative w-full">
    <input
        type="text"
        class="px-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        placeholder="Global Search..."
        @input="emit('update:globalSearch',$event.target.value)"
    />
  </div>
</template>

<script setup>
const emit = defineEmits([''])
</script>
