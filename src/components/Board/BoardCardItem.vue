<template>
  <div
      class="flex justify-between bg-white rounded-md px-2 py-2 border border-[#E5E7E7] shadow-sm mb-2 cursor-move relative group">
    <div v-if="cardItem.task" @click="toLink(cardItem.task,'task')">
      Task: <span class="underline cursor-pointer">{{ cardItem.task.title }}</span>
    </div>

    <div v-if="cardItem.project" @click="toLink(cardItem.project,'project')">
      Project: <span class="underline cursor-pointer">{{ cardItem.project.title }}</span>
    </div>

    <div v-if="cardItem.board" @click="toLink(cardItem.board,'board')">
      Board: <span class="underline cursor-pointer">{{ cardItem.board.name }}</span>
    </div>

    <span v-if="cardItem.comment">{{ cardItem.comment }}</span>

    <div
        class="flex opacity-0 group-hover:opacity-100 transition-all ease-in-out justify-center items-center bg-white rounded-full w-6 h-6 shadow-md">
      <IconDropdown v-model:panel="showEditPanel" :cardItem="cardItem" @deleteCardItem="deleteCardItem" @convertTextToTask="convertToTask"/>
    </div>

    <NewCardItem
        :show-modal="showEditPanel"
        is-edit
        :editItem="cardItem"
        @close="showEditPanel = false"
        @create="saveCardItem"
        @update="updateCardItem"
    />
  </div>
</template>

<script setup>
import {ref} from "vue";
import {catchErrors} from "../../utils/index.js";
import {useBoardsStore} from "../../store/boards.js";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import IconDropdown from "../Dropdowns/IconDropdown.vue";
import {useTasksStore} from "../../store/tasks.js";
import NewCardItem from "../Modals/NewCardItem.vue";

const emit = defineEmits(['fetchBoard'])
const props = defineProps({
  cardItem: {
    type: Object,
    default: false
  },
})


const router = useRouter()
const boardsStore = useBoardsStore()
const taskStore = useTasksStore()
const toast = useToast()

//State
const showPanel = ref(false)
const showEditPanel = ref(false)

//Methods
const toLink = (item, type) => {
  if (item.title === '*****') return toast.error(`You dont have access to this ${type}!`);
  router.push(`/dashboard/${type}/${item.id}`)
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

const convertToTask = async () => {
  try {
    const data = {
      title: props.cardItem.comment,
    }
    const resp = await taskStore.createTask(data)
    await saveCardItem(resp.data.id)
    await deleteCardItem()
    emit('fetchBoard')
    toast.success("Successfully converted!");
    close()
  } catch (e) {
    catchErrors()
  }
}

const saveCardItem = async (taskId) => {
  try {
    const data = {
      card: props.cardItem.card,
      task: taskId,
      comment: '',
      project: null,
      position: props.cardItem.position || 0
    }

    await boardsStore.createBoardCardItem(data)
  } catch (e) {
    catchErrors(e)
  }
}

const updateCardItem = async(form)=>{
  try{
    const data = {
      id: props.cardItem.id,
      card: props.cardItem.card,
      task: null,
      comment: form.comment,
      project: null,
      position: props.cardItem.position || 0
    }

    await boardsStore.updateBoardCardItem(data)
    emit('fetchBoard')
  }catch (e) {
    catchErrors(e)
  }
}


</script>
