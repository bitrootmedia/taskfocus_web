<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" fill="none">
    <path d="M3.75 12H20.25" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 3.75V20.25" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script setup>
const props = defineProps({
  size:{
    type: Number,
    default: 24
  }
})
</script>

<style scoped>

</style>