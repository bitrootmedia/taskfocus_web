<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18.75 21H5.24927C5.05036 21 4.85959 20.921 4.71894 20.7803C4.57828 20.6397 4.49927 20.4489 4.49927 20.25V3.75C4.49927 3.55109 4.57828 3.36032 4.71894 3.21967C4.85959 3.07902 5.05036 3 5.24927 3H14.25L19.5 8.25V20.25C19.5 20.3485 19.4806 20.446 19.4429 20.537C19.4052 20.628 19.35 20.7107 19.2803 20.7803C19.2107 20.85 19.128 20.9052 19.037 20.9429C18.946 20.9806 18.8485 21 18.75 21Z" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.875 3V8.625H19.5007" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.75 14.25H14.25" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 12V16.5" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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