<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8.25 15C10.9424 15 13.125 12.8174 13.125 10.125C13.125 7.43261 10.9424 5.25 8.25 5.25C5.55761 5.25 3.375 7.43261 3.375 10.125C3.375 12.8174 5.55761 15 8.25 15Z" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.5698 5.43173C15.2403 5.24281 15.9436 5.19978 16.6321 5.30552C17.3207 5.41126 17.9786 5.66333 18.5615 6.04475C19.1444 6.42616 19.6389 6.92807 20.0115 7.51666C20.3841 8.10525 20.6263 8.76685 20.7217 9.45692C20.8171 10.147 20.7635 10.8495 20.5645 11.5171C20.3655 12.1847 20.0258 12.8019 19.5682 13.3272C19.1107 13.8524 18.5458 14.2735 17.9118 14.5621C17.2777 14.8507 16.5892 15.0001 15.8926 15.0001" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M1.5 18.5059C2.26133 17.4229 3.27206 16.539 4.44687 15.9288C5.62167 15.3186 6.92604 15.0001 8.24987 15C9.57369 14.9999 10.8781 15.3184 12.0529 15.9285C13.2278 16.5386 14.2386 17.4225 15 18.5054" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.8926 15C17.2166 14.999 18.5213 15.3171 19.6962 15.9273C20.8712 16.5375 21.8819 17.4218 22.6426 18.5054" :stroke="isExactActive ? '#F8D487' : 'white'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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