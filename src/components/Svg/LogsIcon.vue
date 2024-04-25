<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18.75 3H5.24996C5.05106 3 4.8603 3.07903 4.71965 3.21968C4.57901 3.36033 4.5 3.55109 4.5 3.75V20.25C4.5 20.4489 4.57901 20.6397 4.71965 20.7803C4.8603 20.921 5.05106 21 5.24996 21H14.2503L19.5 15.75V3.75C19.5 3.55109 19.421 3.36033 19.2803 3.21968C19.1397 3.07903 18.9489 3 18.75 3V3Z" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.25 21V15.75H19.5007" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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