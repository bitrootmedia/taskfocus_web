<template>
  <button
      class="whitespace-nowrap px-2 sm:px-4 py-2 outline-none focus:outline-none ease-linear transition-all duration-150"
      :class="{
          '': version === 'white',
          'text-white active:bg-blueGray-600': version === 'green',
          '': version === 'yellow',
          '': version === 'gray',
      }"
      type="button"
      @click="clickHandler"
  > {{ label }}
  </button>
</template>

<script setup>
const emit = defineEmits(['on-click'])
const props = defineProps({
  rounded: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  //small-xs, medium-13px,
  size: {
    type: String,
    default: ''
  },
  //yellow,green,white,gray
  version: {
    type: String,
    default: ''
  },
  // right/left
  iconPosition: {
    type: String,
    default: ''
  }
})

const clickHandler = () => {
  emit('on-click')
}
</script>

<style scoped>

</style>