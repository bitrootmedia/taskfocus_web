<template>
  <svg
      :fill="isExactActive ? '#F8D487' : 'white'"
      height="20px"
      width="20px"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <g>
        <path
            d="M36.571,0v512h438.857V0H36.571z M350.041,94.041h31.347v219.429h-104.49v104.49H130.612V94.041h31.347v31.347h188.082
            V94.041z M359.222,344.816l-50.977,50.977v-50.977H359.222z M193.306,31.347h125.388v62.694H193.306V31.347z M444.082,480.653
            H67.918V31.347h94.041v31.347H99.265v386.612h199.798l113.671-113.671V62.694h-62.694V31.347h94.041V480.653z"
        />
      </g>
    </g>
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
