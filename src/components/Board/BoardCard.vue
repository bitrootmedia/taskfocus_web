<template>
  <div class="border border-[#B7B7B7] px-3 py-2 rounded-md shadow-md min-w-[300px] max-w-[300px] h-fit cursor-move">
    <div class="flex justify-between items-center gap-4 border-b border-[#E5E7E7] pb-2">
      <span class="min-w-[120px] cursor-pointer font-semibold" v-if="!isUpdate" @click="showInput">{{
          card.name
        }}</span>

      <input v-show="isUpdate"
             :id="`cardName-${card.name}`"
             class="px-2 cursor-pointer inline-flex text-black-c outline-0 w-[200px]"
             v-model="cardName"
             @blur="updateBoardCard"
      />

      <TrashIcon v-if="!isUpdate" class="cursor-pointer" @click="deleteCard"></TrashIcon>

      <SaveIcon v-else class="cursor-pointer" @click="updateBoardCard"></SaveIcon>
    </div>

    <div class="mt-4">
      <div class="content notifications-wrapper overflow-y-auto max-h-[500px] pr-1">
        <div>
          <draggable v-model="card.card_items"
                     group="items"
                     class="list-group"
                     item-key="id"
                     ghost-class="ghost"
                     @change="changeDrag"
                     @end="onDragEnd"
          >
            <template #item="{element}">
              <div :data-column-id="card.id">
                <BoardCardItem :cardItem="element" @fetchBoard="emit('fetchBoard')" class="list-group-item"/>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div
          class="flex items-center gap-1 cursor-pointer font-semibold mt-2 px-2 py-1 hover:bg-light-bg-c transition-all duration-150 ease-in-out"
          @click="showNewPanel = true">
        <PlusIcon size="12"/>
        <span class="text-light-c text-sm">Add new card item</span>
      </div>
    </div>
  </div>

  <NewCardItem
      :show-modal="showNewPanel"
      @close="showNewPanel = false"
      @create="saveCardItem"
  />
</template>

<script setup>
import TrashIcon from "../Svg/TrashIcon.vue";
import SaveIcon from "../Svg/SaveIcon.vue";
import {catchErrors} from "../../utils/index.js";
import {useBoardsStore} from "../../store/boards.js";
import {useToast} from "vue-toastification";
import {ref} from "vue";
import PlusIcon from "../Svg/PlusIcon.vue";
import BoardCardItem from "./BoardCardItem.vue";
import draggable from 'vuedraggable'
import NewCardItem from "../Modals/NewCardItem.vue";

const emit = defineEmits(['fetchBoard'])
const props = defineProps({
  card: {
    type: Object,
    default: false
  },
  cards: {
    type: Array,
    default: false
  },
})


//Store
const toast = useToast()
const boardsStore = useBoardsStore()

//State
const isUpdate = ref(false)
const cardName = ref(props.card.name || '')
const showNewPanel = ref(false);


//Methods
const onDragEnd = async (event) => {
  if (!event.pullMode) return

  try {
    const eventTo = event.to
    const newIndex = event.newDraggableIndex

    const newColumnId = eventTo.children[0]?.getAttribute('data-column-id')
    const currentCard = props.cards.find((item) => item.id === newColumnId)
    const currentItem = currentCard.card_items[newIndex]

    const data = {
      item: currentItem.id,
      card: newColumnId,
      position: newIndex,
    }

    await boardsStore.updateBoardCardItemMove(data)
  } catch (e) {
    catchErrors(e)
  }
}

const changeDrag = async (e) => {
  if (!e.moved) return

  try {
    const current = e.moved.element
    const newIndex = e.moved.newIndex
    const data = {
      item: current.id,
      card: props.card.id,
      position: newIndex,
    }

    await boardsStore.updateBoardCardItemMove(data)
  } catch (e) {
    catchErrors(e)
  }
}

const saveCardItem = async (form) => {
  try {
    const data = {
      card: props.card.id,
      comment: form.comment || '',
      board: form.selectedBoard || null,
      task: form.selectedTask || null,
      project: form.selectedProject || null,
      position: props.card.card_items.length || 0
    }

    await boardsStore.createBoardCardItem(data)
    emit('fetchBoard')
    toast.success("Successfully created!");
  } catch (e) {
    catchErrors(e)
  }
}

const showInput = () => {
  isUpdate.value = true

  const input = document.getElementById(`cardName-${props.card.name}`)
  setTimeout(() => {
    input.focus()
  }, 100)
}

const deleteCard = async () => {
  try {
    const data = {
      id: props.card.id
    }
    await boardsStore.deleteBoardCard(data)
    emit('fetchBoard')
    toast.success("Successfully deleted!");
  } catch (e) {
    catchErrors(e)
  }
}

const updateBoardCard = async () => {
  try {
    const data = {
      id: props.card.id,
      name: cardName.value
    }
    await boardsStore.updateBoardCard(data)
    emit('fetchBoard')
    toast.success("Successfully updated!");
    isUpdate.value = false
  } catch (e) {
    catchErrors(e)
  }
}
</script>

<style scoped>

</style>
