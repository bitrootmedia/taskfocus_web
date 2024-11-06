<template>
  <div class="bg-white rounded-md px-2 py-2 border border-[#E5E7E7] shadow-sm mb-2 cursor-move relative group">
    <div v-if="cardItem.task" @click="toLink(cardItem.task,'task')">
      Task: <span class="underline cursor-pointer">{{ cardItem.task.title }}</span>
    </div>

    <div v-if="cardItem.project" @click="toLink(cardItem.project,'project')">
      Project: <span class="underline cursor-pointer">{{ cardItem.project.title }}</span>
    </div>

    <span v-if="cardItem.comment">{{ cardItem.comment }}</span>

    <span @click="deleteCardItem"
          class="flex opacity-0 group-hover:opacity-100 transition-all ease-in-out justify-center items-center absolute right-1.5 top-1.5 bg-white rounded-full w-6 h-6 shadow-md">
      <TrashIcon class="cursor-pointer"/>
    </span>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {catchErrors} from "../../utils/index.js";
import {useBoardsStore} from "../../store/boards.js";
import {useToast} from "vue-toastification";
import TrashIcon from "../Svg/TrashIcon.vue";
import {useRouter} from "vue-router";

const emit = defineEmits(['fetchBoard'])
const props = defineProps({
  cardItem: {
    type: Object,
    default: false
  },
})


const router = useRouter()
const boardsStore = useBoardsStore()
const toast = useToast()

//State
const showPanel = ref(false)


//Methods
const toLink = (item, type) => {
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


</script>
