<template>
  <div class="data-table-wrapper">
    <div
        class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded"
    >
      <div class="block w-full overflow-x-auto pb-10 md:pb-0">
        <table class="items-center w-full bg-transparent border-collapse">
          <thead>
          <tr>
            <th
                v-for="header in headers" :key="header.id"
                class="px-3 h-[54px] align-middle border border-solid py-3 text-xs bg-blueGray-50 text-blueGray-500 border-blueGray-100 uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              <div :class="{'flex gap-x-1 items-center justify-between': header.sorting}">
                {{ header.label }}

                <span class="flex flex-col h-[20px] text-blueGray-300 hover:text-blueGray-600 cursor-pointer" v-if="header.sorting" @click="sortTitle(header)">
                  <i class="fas fa-sort-up text-sm h-[2px]" :class="{'text-blueGray-600': order === true && active === header.sortLabel}"/>
                  <i class="fas fa-sort-down text-sm h-[2px]" :class="{'text-blueGray-600': order === false && active === header.sortLabel}"/>
              </span>
              </div>
            </th>
          </tr>
          </thead>

          <slot name="tableBody"></slot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";

const emit = defineEmits(['sorting'])
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  headers: {
    type: Array,
    default: () => []
  }
})

const order = ref(null)
const active = ref('')

const sortTitle = (header)=>{
  order.value = !order.value
  active.value = header.sortLabel
  const label = order.value ? header.sortLabel : `-${header.sortLabel}`
  emit('sorting', label)
}
</script>

