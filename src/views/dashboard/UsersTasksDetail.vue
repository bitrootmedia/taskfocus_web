<template>
  <div class="main-container">

    <h2 class="text-xl font-bold inline-flex text-blueGray-800 mb-6" v-if="currentUser">{{ currentUser.first_name }}
      {{ currentUser.last_name }}</h2>

    <Loader v-if="loading"/>

    <template v-else>
      <div class="content">
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
              <tr v-if="!userTasks.length">
                <td :colspan="headers.length">
                  <p class="flex justify-center py-8 px- text-blueGray-500 font-medium">
                    Sorry, but we can't find any information
                  </p>
                </td>
              </tr>

              <draggable
                  v-else
                  tag="tbody"
                  :disabled="isDragDisabled"
                  v-model="userTasks"
                  item-key="id"
                  group="id"
                  @change="changeDrag"
              >
                <template #item="{element}">
                  <tr :class="{'cursor-move': !isDragDisabled}">
                    <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <span @click.stop="toLink(`/dashboard/project/${element.task.project?.id}`)"
                            class="cursor-pointer">{{ element.task.project?.title || '-' }}</span>
                    </td>
                    <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <span @click.stop="toLink(`/dashboard/task/${element.task?.id}`)"
                            class="cursor-pointer">{{ element.task.title || '-' }}</span>
                    </td>
                  </tr>
                </template>
              </draggable>
            </template>
          </template>
        </DataTable>

        <Pagination
            v-if="paginate.pagination.value.total > 1 && !loading"
            :pagination="paginate.pagination.value"
            v-model:query="paginate.query.value"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import {catchErrors} from "../../utils";
import {useRoute, useRouter} from 'vue-router'
import {useUsersTasksStore} from "../../store/users-tasks";
import Loader from '../../components/Loader/Loader.vue'
import DataTable from '../../components/Table/DataTable.vue'
import Pagination from "./../../components/Pagination/Pagination.vue"
import {usePaginate} from "../../composables/usePaginate";
import draggable from 'vuedraggable'
import {useUserStore} from "../../store/user";

const route = useRoute()
const router = useRouter()
const usersTasksStore = useUsersTasksStore()
const userStore = useUserStore()


// State
const isDragDisabled = false
const loading = ref(false)
const tempData = ref([])
const userTasks = ref([])
const currentUser = ref(null)


// Computed
const headers = computed(() => {
  return [
    {id: 1, label: 'Project', sorting: false, sortLabel: 'created_at'},
    {id: 2, label: 'Task', sorting: false, sortLabel: 'author'},
  ]
})


// Methods
const toLink = (link) => {
  router.push(link)
}
const fetchUser = async () => {
  try {
    const id = route.params.id
    if (id) {
      const resp = await userStore.fetchCurrentUser({id})
      currentUser.value = resp.data
    }
  } catch (e) {
    catchErrors(e)
  }
}
const changeDrag = async (e) => {
  try {
    const newIndex = e.moved.newIndex
    let aboveItemId = null
    let belowItemId = null

    if (newIndex !== 0) {
      const findItem = tempData.value.find((item, index) => index === newIndex)
      aboveItemId = findItem?.id
    }

    if (newIndex !== tempData.value.length) {
      const nextItem = tempData.value.find((item, index) => index === newIndex + 1)
      belowItemId = nextItem?.id
    }

    const data = {
      id: e.moved.element.id,
      task_above_id: aboveItemId,
      user_task_queue_id: belowItemId,
    }
    await usersTasksStore.updateOrder(data)
  } catch (e) {
    catchErrors(e)
  }
}

const fetchUsersTask = async () => {
  try {

    const id = route.params.id
    if (id) {
      loading.value = true
      const options = {
        pagination: paginate.pagination.value,
        query: paginate.query.value,
        id
      }
      const resp = await usersTasksStore.fetchUsersTasks(options)
      userTasks.value = resp.data.results
      tempData.value = resp.data.results
      paginate.updatePagination(resp)
    }

  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

// Composables
const paginate = usePaginate(fetchUsersTask, null)
fetchUsersTask()
fetchUser()
</script>
