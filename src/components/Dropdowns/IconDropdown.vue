<template>
  <div class="relative" ref="componentRef" @scroll="scrollHandler">
    <SettingsIcon :id="`setting-icon-${cardItem.id}`" :isExactActive="true" class="cursor-pointer"
                  @click="showDropdown = !showDropdown"/>

    <ul ref="dropdown" v-if="showDropdown"
        :style="dropdownStyle"
        class="z-[1000] fixed bg-white border border-[#E5E7E7] rounded-md shadow-sm min-w-[100px] py-2">
      <li class="text-sm flex items-center gap-x-1 py-1 px-4 whitespace-nowrap cursor-pointer hover:bg-light-bg-c transition-all ease-in-out"
          @click="emit('deleteCardItem')">
        Delete Card Item
      </li>
      <li v-if="cardItem.comment"
          class="text-sm flex items-center gap-x-1 py-1 px-4 whitespace-nowrap cursor-pointer hover:bg-light-bg-c transition-all ease-in-out"
          @click="emit('convertTextToTask')">
        Convert to task
      </li>

      <li v-if="cardItem.comment"
          class="text-sm flex items-center gap-x-1 py-1 px-4 whitespace-nowrap cursor-pointer hover:bg-light-bg-c transition-all ease-in-out"
          @click="openEditPanel">
        Edit
      </li>
    </ul>
  </div>
</template>

<script setup>
import SettingsIcon from "../Svg/SettingsIcon.vue";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";

const emit = defineEmits(['deleteCardItem', 'convertTextToTask'])
const props = defineProps({
  cardItem: {
    type: Object,
    required: () => {
    }
  }
})


//State
const showDropdown = ref(false)
const dropdownStyle = ref({});
const componentRef = ref()

//watch
watch(showDropdown, (val) => {
  if (val) {
    const item = document.getElementById(`setting-icon-${props.cardItem.id}`)
    const triggerRect = item.getBoundingClientRect();
    dropdownStyle.value = {
      top: `${triggerRect.top + 30}px`,
      left: `${triggerRect.left - 120}px`,
    };
  }
})


//Methods
const close = () => {
  showDropdown.value = false
}

const openEditPanel = ()=>{
  emit('update:panel',true)
  close()
}

const handleOutsideClick = (e) => {
  if (!componentRef.value.contains(e.target)) close()
}

onMounted(() => {
  window.addEventListener('click', handleOutsideClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleOutsideClick)
})
</script>
