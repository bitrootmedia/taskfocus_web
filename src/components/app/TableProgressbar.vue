<template>
  <div v-if="progress">
    <span class="text-light-c font-bold text-xs">{{ progress }}%</span>
    <div class="bg-light-bg-c h-2 w-full rounded-[10px] mt-[2px]">
      <div class="bg-green-c h-2 block rounded-[10px]" :style="{width: `${progress || 0}%`}"></div>
    </div>
  </div>

  <div v-else>
    <span class="text-light-c text-sm">{{ progress }}%</span>
  </div>

</template>

<script setup>

const props = defineProps({
  progress:{
    type: Number,
    default: 0
  }
})
</script>

