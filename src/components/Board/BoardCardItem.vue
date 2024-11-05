<template>
  <div class="bg-white rounded-md px-2 py-2 border border-[#E5E7E7] shadow-sm mb-2 cursor-pointer"
       >
    {{ cardItem.comment }}
  </div>

<!--  <NewCardItem-->
<!--      :show-modal="showPanel"-->
<!--      :isEdit="true"-->
<!--      :editItem="editItem"-->
<!--      @close="showPanel = false"-->
<!--      @delete="deleteCardItem"-->
<!--      @update="updateCard"-->
<!--  />-->
</template>

<script setup>
import {ref} from "vue";
import {catchErrors} from "../../utils/index.js";
import {useBoardsStore} from "../../store/boards.js";
import {useToast} from "vue-toastification";
import NewCardItem from "../Modals/NewCardItem.vue";

const emit = defineEmits(['fetchBoard'])
const props = defineProps({
  cardItem: {
    type: Object,
    default: false
  },
})


const boardsStore = useBoardsStore()
const toast = useToast()

//State
const showPanel = ref(false)
const editItem = ref(null)


//Methods
const openModal = (item) => {
  showPanel.value = true
  editItem.value = item
}

const updateCard = async (form) => {
  try {
    const data = {
      id: props.cardItem.id,
      card: props.cardItem.card,
      comment: form.comment,
      task: form.selectedTask,
      project: form.selectedProject,
      position: props.cardItem.position
    }

    await boardsStore.updateBoardCardItem(data)
    emit('fetchBoard')
    toast.success("Successfully updated!");
    showPanel.value = false
  } catch (e) {
    catchErrors(e)
  }
}

const deleteCardItem = async () => {
  try {
    await boardsStore.deleteBoardCardItem({id: props.cardItem.id})
    emit('fetchBoard')
    toast.success("Successfully deleted!");
    showPanel.value = false
  } catch (e) {
    catchErrors(e)
  }
}


</script>
