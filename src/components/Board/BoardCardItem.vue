<template>
  <div class="bg-white rounded-md px-2 py-2 border border-[#E5E7E7] shadow-sm mb-2 cursor-pointer"
       @click="showPanel = true">
    {{ cardItem.comment }}
  </div>
</template>

<script setup>
import {ref} from "vue";
import Button from "../Button/Button.vue";
import {useBoardsStore} from "../../store/boards.js";
import {useToast} from "vue-toastification";

const emit = defineEmits(['fetchBoard'])
const props = defineProps({
  cardItem: {
    type: Object,
    default: false
  },
})

//State
const showPanel = ref(false)


//Methods
// const deleteCardItem = async () => {
//   try {
//     await boardsStore.deleteBoardCardItem({id: props.cardItem.id})
//     emit('fetchBoard')
//     toast.success("Successfully deleted!");
//     showPanel.value = false
//   } catch (e) {
//     console.log(e, 'e')
//     catchErrors(e)
//   }
// }


</script>
