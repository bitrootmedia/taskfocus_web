<template>
  <label
      v-if="label"
      class="block text-xs text-black-c font-semibold mb-1"
      :for="label"
  >
    {{ label }}
  </label>

    <SearchIcon v-if="leftIcon" class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-1 left-2"/>
    <input
        :id="label"
        :value="value"
        @input="$emit('update:value', $event.target.value)"
        :type="type"
        :class="leftIcon ? 'pl-8' : 'pl-3'"
        class="pr-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        :placeholder="placeholder"
    />
</template>

<script setup>
import SearchIcon from "../Svg/SearchIcon.vue";

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  value:{
    type: [String,Number],
    default: ''
  },
  type:{
    type: String,
    default: 'text'
  },
  label:{
    type: String,
    default: ''
  },
  leftIcon:{
    type: Boolean,
    default: false
  },

})


</script>