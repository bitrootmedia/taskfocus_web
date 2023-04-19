<template>
  <div class="flex" :class="[position === 'right' ? 'justify-start' : 'justify-end']">
    <div class="inline-flex gap-x-1 items-center">
      <span class="text-sm text-blueGray-600 cursor-pointer" v-if="pagination.prev" @click="paginate(pagination.prev)">Prev</span>
      <span class="text-md text-blueGray-600 font-medium">{{ pagination.current || 1 }}/{{ pagination.total }}</span>
      <span class="text-sm text-blueGray-600 cursor-pointer" v-if="pagination.next" @click="paginate(pagination.next)">Next</span>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['update:query'])
const props = defineProps({
  query: {
    type: String,
    default: 'page=1&page_size=10'
  },
  pagination: {
    type: Object,
    default: () => {
    }
  },
  position: {
    type: String,
    default: 'left'
  }
})


const paginate = (link) => {
  emit('update:query',link.split('?')[1])
}
</script>
