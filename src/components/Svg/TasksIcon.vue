<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M10.125 12.125H20.2499" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.125 6.125H20.2499" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.125 18.125H20.25" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.75 5.75L5.25 5V10.2494" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.85314 14.4267C3.92441 14.258 4.03016 14.1062 4.16359 13.9809C4.29703 13.8555 4.4552 13.7595 4.62795 13.6989C4.8007 13.6384 4.98422 13.6146 5.1667 13.6292C5.34918 13.6437 5.5266 13.6963 5.68756 13.7835C5.84853 13.8707 5.98947 13.9906 6.10135 14.1355C6.21322 14.2804 6.29355 14.4471 6.33718 14.6249C6.38081 14.8026 6.38677 14.9876 6.35468 15.1678C6.32259 15.3481 6.25316 15.5196 6.15084 15.6714L3.75 18.8751H6.375" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
