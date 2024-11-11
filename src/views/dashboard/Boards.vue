<template>
  <div class="bg-white border-b border-[#E5E7E7] px-6 py-6 mb-[30px]">
    <div class="header flex flex-col justify-between gap-y-3">
      <form @submit="createBoard($event)" class="flex items-center gap-x-3 gap-y-3">
        <div class="flex gap-x-6 w-full">
          <div class="relative w-full">
            <SearchIcon class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-1 left-2"/>
            <input
                v-model="filter.search.value"
                type="text"
                class="pl-9 pr-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Search by project"
            />
          </div>

        </div>

        <button
            @click="router.push(`/dashboard/create-board`)"
            class="whitespace-nowrap bg-orange-c flex items-center justify-center gap-x-1 px-3 py-1 text-[13px] font-medium rounded-[6px] hover:bg-orange-c-900 outline-none focus:outline-none ease-linear transition-all duration-150"
            type="button"
        >
          New board
          <PlusIcon/>
        </button>
      </form>
    </div>
  </div>

  <div class="main-container">
    <div class="content mb-6">
      <Loader v-if="loading"/>

      <div v-else>
        <div class="mb-6">
          <DataTable :headers="headers">
            <template v-slot:tableBody>
              <tr v-if="loading">
                <td :colspan="headers.length">
                  <div class="flex justify-center py-1 text-blueGray-500 font-medium">
                    <Loader/>
                  </div>
                </td>
              </tr>

              <template v-else>
                <tr v-if="!boards.length">
                  <td :colspan="headers.length">
                    <p class="flex text-center px-4 justify-center py-8 text-black-c font-medium">
                      No data found
                    </p>
                  </td>
                </tr>

                <draggable
                    v-else
                    tag="tbody"
                    :disabled="isDragDisabled"
                    v-model="boards"
                    @start="drag = true"
                    @end="drag = false"
                    item-key="id">
                  <template #item="{element}">
                    <tr :class="{'cursor-move': !isDragDisabled}">
                      <td class="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap">
                        <router-link :to="`/dashboard/board/${element.id}`" class="p-4">{{
                            element.name || '-'
                          }}
                        </router-link>
                      </td>
                      <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {{ userName(element.owner) }}
                      </td>
                    </tr>
                  </template>
                </draggable>
              </template>
            </template>
          </DataTable>
        </div>


        <Pagination
            v-if="paginate.pagination.value.total > 1 && !loading"
            :pagination="paginate.pagination.value"
            v-model:query="paginate.query.value"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from "../../components/Loader/Loader.vue";
import {computed, ref} from "vue";
import {catchErrors} from "../../utils/index.js";
import {useBoardsStore} from "../../store/boards.js";
import {usePaginate} from "../../composables/usePaginate";
import Pagination from "../../components/Pagination/Pagination.vue";
import Input from "../../components/Input/Input.vue";
import Button from "../../components/Button/Button.vue";
import {useToast} from "vue-toastification";
import {useCookies} from "vue3-cookies";
import DataTable from "../../components/Table/DataTable.vue";
import draggable from 'vuedraggable'
import {useUserStore} from "../../store/user.js";
import {useRouter} from "vue-router";
import {useFilter} from "../../composables/useFilter.js";
import SearchIcon from "../../components/Svg/SearchIcon.vue";
import PlusIcon from "../../components/Svg/PlusIcon.vue";
import CheckBox from "../../components/CheckBox/CheckBox.vue";


//Store
const toast = useToast()
const router = useRouter()
const boardsStore = useBoardsStore()
const usersStore = useUserStore()
const {cookies} = useCookies();

//State
const loading = ref(true)
const name = ref('')
const boards = ref([])
const users = ref([])
const isDragDisabled = true
let drag = ref(false)
const headers = [
  {id: 1, label: 'Name',},
  {id: 2, label: 'Owner'},
]


const authUser = computed(() => {
  if (!cookies.get('task_focus_user')) return ''
  return cookies.get('task_focus_user')
})


//Methods
const userName = (id) => {
  const findItem = users.value.find((item) => item.id === id)
  if (!findItem) return 'N/A'

  return findItem.first_name || findItem.last_name ? findItem.first_name + '' + findItem.last_name : findItem.username
}

const createBoard = async (e) => {
  if (e) e.preventDefault()
  try {
    if (!name.value.length) return toast.error("Name is required");

    const data = {
      name: name.value,
      owner: authUser.value.pk
    }

    const resp = await boardsStore.createBoard(data)
    await router.push(`/dashboard/board/${resp.data.id}`)
    toast.success("Successfully created!");
  } catch (e) {
    catchErrors(e)
  }
}

const fetchBoards = async () => {
  try {
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      search: filter.search.value,
    }

    const resp = await boardsStore.fetchBoards(options)
    boards.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

const fetchUsers = async () => {
  try {
    const resp = await usersStore.fetchUsers()
    users.value = resp.data.results
  } catch (e) {
    catchErrors(e)
  }
}


// Composables
const paginate = usePaginate(fetchBoards, null)
const filter = useFilter(boards, fetchBoards)

//Run functions
fetchBoards()
fetchUsers()
</script>
