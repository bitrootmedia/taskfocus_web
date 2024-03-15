<template>
  <button
      class="w-fit inline-flex items-center gap-x-1 whitespace-nowrap px-[15px] outline-none focus:outline-none ease-linear transition-all duration-150"
      :class="{
          'btn-white bg-white border border-[#E5E7E7] text-black-c hover:bg-black-c hover:text-white': version === 'white',
          'btn-green bg-green-c text-white hover:bg-black-c hover:text-white h-8': version === 'green',
          'border border-orange-c text-black-c bg-orange-c hover:bg-orange-c-900 h-8': version === 'yellow',
          'border border-[#E5E7E7] hover:bg-black-c hover:text-white h-8': version === 'gray',
          'rounded-[6px]': !rounded,
          'rounded-[20px]': rounded,
          'text-xs font-semibold': size === 'small',
          'text-[13px] font-medium': size === 'medium',
          'py-[3px]': icon,
          'py-2': !icon,
      }"
      :disabled="disabled"
      type="button"
      @click="clickHandler"
  >
    <slot name="left-icon"></slot>
    {{ label }}
    <slot name="right-icon"></slot>
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
  icon: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
})

const clickHandler = () => {
  emit('on-click')
}
</script>

<style >
.btn-white:hover svg path{
  stroke: white;
}
</style>