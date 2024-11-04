<template>
  <div class="main-container">
    <div class="content mt-6 mb-6">
      <Loader v-if="loading"/>

      <div v-else>
        <div class="header flex items-center gap-x-4">
          <div class="relative w-[250px]">
            <Input placeholder="Title of Board" v-model:value="name"/>
          </div>

          <Button
              @on-click="createBoard"
              label="Create Board"
              size="medium"
              version="green"
          />
        </div>

        <div class="mt-6 mb-6">
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


//Store
const toast = useToast()
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

const createBoard = async () => {
  try {
    if (!name.value.length) return toast.error("Name is required");

    const data = {
      name: name.value,
      owner: authUser.value.pk
    }

    await boardsStore.createBoard(data)
    await fetchBoards()
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

//Run functions
fetchBoards()
fetchUsers()
</script>
