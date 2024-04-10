<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M10.125 4.5H4.5V10.125H10.125V4.5Z" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19.5 4.5H13.875V10.125H19.5V4.5Z" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.125 13.875H4.5V19.5H10.125V13.875Z" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19.5 13.875H13.875V19.5H19.5V13.875Z" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script setup>
const props = defineProps({
  isExactActive: {
    type: Boolean,
    required: false
  }
})
</script>
