<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 6.75V12H17.25" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 20.25C16.5563 20.25 20.25 16.5563 20.25 12C20.25 7.44365 16.5563 3.75 12 3.75C7.44365 3.75 3.75 7.44365 3.75 12C3.75 16.5563 7.44365 20.25 12 20.25Z" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18.364 2.4541L21.546 5.63608" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2.4541 5.63608L5.63608 2.4541" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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