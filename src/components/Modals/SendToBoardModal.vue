<template>
  <div v-if="showModal" ref="componentModalRef" @click.self="emit('close')"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative my-6 mx-auto w-[350px]">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <!--header-->
        <div class="py-3">
          <div class="flex items-center justify-between rounded-t p-3 border-b border-light-bg-c">
            <h3 class="text-[22px] text-black-c font-semibold">
              Send to Board
            </h3>

            <CloseBlackIcon class="cursor-pointer" @click="emit('close')"/>
          </div>
        </div>
        <!--body-->
        <div class="relative p-3 flex-auto">
          <Loader v-if="loading"/>

          <div v-else class="content">
            <div class="relative w-full mb-4">
              <label
                  class="block text-black-c text-xs font-semibold mb-1"
                  htmlFor="grid-label"
              >
                Boards
              </label>
              <select v-model="selectedBoard" placeholder="Select User"
                      class="pl-3 pr-8 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              >
                <option :value="board.id" v-for="(board) in boards" :key="board.id">{{ board.name }}</option>
              </select>
            </div>

            <div class="relative w-full mb-4" v-if="selectedBoard">
              <label
                  class="block text-black-c text-xs font-semibold mb-1"
                  htmlFor="grid-label"
              >
                Cards
              </label>
              <select v-model="selectedCard" placeholder="Select User"
                      class="pl-3 pr-8 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              >
                <option :value="card.id" v-for="(card) in cards" :key="card.id">{{ card.name }}</option>
              </select>
            </div>
          </div>

          <div class="relative w-full">
            <Button
                @on-click="sendToBoard"
                :disabled="btnLoad"
                :label="'Save'"
                version="dark-small"
                size="small"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import Loader from "./../../components/Loader/Loader.vue"
import CloseBlackIcon from "../Svg/CloseBlackIcon.vue";
import Button from '../Button/Button.vue'
import {catchErrors} from "../../utils/index.js";
import {useBoardsStore} from "../../store/boards.js";

const emit = defineEmits(['close'])
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  btnTitle: {
    type: String,
    default: ''
  },
  task: {
    type: Object,
    default: () => {
    }
  },
})


const boardsStore = useBoardsStore()

// State
const componentModalRef = ref()
const loading = ref(false)
const btnLoad = ref(false)
const boards = ref([])
const selectedBoard = ref(null)
const cards = ref([])
const selectedCard = ref([])


watch(selectedBoard, (newVal) => {
  if (newVal) fetchCards()
})


// Methods
const fetchBoards = async () => {
  try {
    loading.value = true
    const resp = await boardsStore.fetchBoards()
    boards.value = resp.data.results
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}
const fetchCards = async () => {
  try {
    const data = {
      id: selectedBoard.value
    }

    const resp = await boardsStore.fetchBoard(data)
    cards.value = resp.data.cards
  } catch (e) {
    catchErrors(e)
  }
}

const sendToBoard = async () => {
  try {
    btnLoad.value = true
    const data = {
      pk: props.task.id,
      card_id: selectedCard.value,
      board_id: selectedBoard.value,
    }

    await boardsStore.sendToBoard(data)
    await toast.success("Successfully created");
    close()
  } catch (e) {
    catchErrors(e)
  } finally {
    btnLoad.value = false
  }
}

const close = () => {
  emit('close')
  reset()
}

const reset = () => {
  selectedBoard.value = null
  selectedCard.value = null
}

const handleClick = (e) => {
  if (e.target.innerHTML === props.btnTitle) return false

  if (!componentModalRef.value === e.target) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('click', handleClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClick)
})


fetchBoards()
</script>
