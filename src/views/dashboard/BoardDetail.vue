<template>
  <div class="main-container">
    <div class="content mt-6 mb-6">
      <Loader v-if="loading"/>

      <div v-else>
        <div class="flex justify-between items-center">
          <h1 class="font-semibold text-[24px] text-black-c cursor-pointer" v-if="!isUpdate" @click="showInput">
            {{ board.name }}
          </h1>
          <input v-show="isUpdate"
                 id="boardName"
                 class="px-2 py-2 cursor-pointer inline-flex font-semibold text-black-c outline-0 w-[300px]"
                 v-model="boardName"
                 @blur="updateBoard"
          />

          <Button
              v-if="isUpdate"
              @on-click="updateBoard"
              label="Save Name"
              size="medium"
              version="green"
          />

          <div v-else class="flex items-center gap-x-4">
            <Button
                @on-click="showCardModal = true"
                label="Add New Card"
                size="medium"
                version="green"
            />

            <GearDropdown v-if="isAuthOwner" v-model:value="showBoardUsersModal" :board="board" @update="fetchBoard"/>
          </div>
        </div>

        <div v-if="board?.cards?.length" class="mt-8">
          <draggable v-model="board.cards"
                     group="columns"
                     class="px-2 py-2 pb-6 horizontal-wrapper list-group flex flex-row gap-8 overflow-x-auto overflow-y-hidden"
                     item-key="id"
                     ghost-class="ghost"
                     @change="changeDrag">
            <template #item="{element}">
              <div>
                <BoardCard :cards="board.cards" :card="element" @itemDropped="handleItemDrop" @fetchBoard="fetchBoard" class="list-group-item"/>
              </div>
            </template>
          </draggable>
        </div>

        <CreateBoardCard
            :show-modal="showCardModal"
            @close="showCardModal = false"
            @create="createCard"
        />

        <BoardManageUsers
            :show-modal="showBoardUsersModal"
            :users="users"
            :boardUsers="boardUsers"
            @close="showBoardUsersModal = false"
            @update="fetchBoardUsers"
        />

      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from "../../components/Loader/Loader.vue";
import {useBoardsStore} from "../../store/boards.js";
import {ref, computed} from "vue";
import {catchErrors} from "../../utils/index.js";
import {useRoute, useRouter} from "vue-router";
import Button from "../../components/Button/Button.vue";
import CreateBoardCard from "../../components/Modals/CreateBoardCard.vue";
import {useToast} from "vue-toastification";
import BoardCard from "../../components/Board/BoardCard.vue";
import draggable from 'vuedraggable'
import BoardManageUsers from "../../components/Modals/BoardManageUsers.vue";
import GearDropdown from "../../components/Board/GearDropdown.vue";
import {useUserStore} from "../../store/user.js";
import {useCookies} from "vue3-cookies";


//Store
const {cookies} = useCookies();
const route = useRoute()
const toast = useToast()
const usersStore = useUserStore()
const boardsStore = useBoardsStore()


//State
const loading = ref(true);
const showCardModal = ref(false);
const showBoardUsersModal = ref(false);
const isUpdate = ref(false)
const users = ref([])
const boardUsers = ref([])
const board = ref('')
const boardName = ref('')


// Computed
const isAuthOwner = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')

  const boardOwnerId = board.value.owner
  return user.pk === boardOwnerId
})

//Methods
const changeDrag = async (e) => {
  try {
    const current = e.moved.element
    const newIndex = e.moved.newIndex
    const data = {
      card: current.id,
      position: newIndex,
    }

    await boardsStore.updateBoardCardMove(data)
  } catch (e) {
    catchErrors(e)
  }
}

const showInput = () => {
  isUpdate.value = true

  const input = document.getElementById('boardName')
  setTimeout(() => {
    input.focus()
  }, 100)
}

const createCard = async (input) => {
  try {
    const data = {
      board: route.params.id,
      name: input,
      position: board.value.cards.length || 0,
    }
    await boardsStore.createBoardCard(data)
    toast.success("Successfully created!");
    await fetchBoard()
  } catch (e) {
    catchErrors(e)
  }
}

const updateBoard = async () => {
  try {
    const data = {
      id: route.params.id,
      name: boardName.value
    }
    await boardsStore.updateBoard(data)
    toast.success("Successfully updated!");
    await fetchBoard()
    isUpdate.value = false
  } catch (e) {
    catchErrors(e)
  }
}

const fetchUsers = async () => {
  try {
    const resp = await usersStore.fetchUsers()
    const authUser = cookies.get('task_focus_user')?.pk
    users.value = resp.data.results.filter((item) => item.id !== authUser)
  } catch (e) {
    catchErrors(e)
  }
}

const fetchBoardUsers = async () => {
  try {
    const data = {
      id: route.params.id
    }
    const resp = await boardsStore.fetchBoardUsers(data)
    boardUsers.value = resp.data.results.map((item) => item.user)
  } catch (e) {
    catchErrors(e)
  }
}

const fetchBoard = async () => {
  try {
    const data = {
      id: route.params.id
    }
    const resp = await boardsStore.fetchBoard(data)
    resp.data.cards.sort((a, b) => a.position - b.position);
    resp.data.cards.forEach(card => {
      card.card_items.sort((a, b) => a.position - b.position);
    });

    board.value = resp.data
    boardName.value = board.value.name
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

//Run functions
fetchBoard()
fetchBoardUsers()
fetchUsers()
</script>

<style scoped>

</style>
