<template>
  <div class="content mt-6">
    <div class="border-2 border-blueGray-300 rounded-[4px] px-4 py-4">
      <div class="text-left mb-4">
        <h4 class="text-xl font-bold inline-flex text-blueGray-800 cursor-pointer"
            @click="toLink(`/dashboard/users-tasks/}`)">
          {{ user.first_name }} {{ user.last_name }}</h4>
      </div>

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
                <p class="flex text-center px-4 justify-center py-8 text-blueGray-500 font-medium">
                  No data found
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
                            <span @click.stop="toLink(`/dashboard/task/${element.task?.id}`)"
                                  class="cursor-pointer">{{ element.task.title || '-' }}</span>
                  </td>
                  <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <span @click.stop="toLink(`/dashboard/project/${element.task.project?.id}`)"
                                  class="cursor-pointer">{{ element.task.project?.title || '-' }}</span>
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
  </div>
</template>

<script setup>
import DataTable from "../Table/DataTable.vue"
import draggable from 'vuedraggable'
import Loader from '../Loader/Loader.vue'
import Pagination from "../Pagination/Pagination.vue"
import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";
import {useUsersTasksStore} from "../../store/users-tasks";
import {catchErrors} from "../../utils";
import {useCookies} from "vue3-cookies";
import config from "../../config";
import {usePaginate} from "../../composables/usePaginate";

const {cookies} = useCookies();
const router = useRouter()
const route = useRoute()
const usersTasksStore = useUsersTasksStore()

// State
const isDragDisabled = false
const loading = ref(false)
const userTasks = ref([])
const user = ref({})


// Computed
const headers = computed(() => {
  return [
    {id: 1, label: 'Task', sorting: false, sortLabel: 'task'},
    {id: 2, label: 'Project', sorting: false, sortLabel: 'project'},
  ]
})


// Methods
const toLink = (link) => {
  router.push(link)
}

const changeDrag = async (e) => {
  try {
    const newIndex = e.moved.newIndex
    let aboveItemId = null
    let belowItemId = null

    if (newIndex !== 0) {
      const findItem = userTasks.value.find((item, index) => index === newIndex - 1)
      aboveItemId = findItem?.id
    }

    if (newIndex !== userTasks.value.length) {
      const nextItem = userTasks.value.find((item, index) => index === newIndex + 1)
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

const fetchUserTaskQueue = async () => {
  try {
    loading.value = true
    const userData = cookies.get('task_focus_user')
    const id = userData.pk
    if (id) {
      const options = {
        pagination: paginate.pagination.value,
        query: paginate.query.value,
        id
      }
      const resp = await usersTasksStore.fetchUsersTasks(options)
      userTasks.value = resp.data.results
      user.value = userData
      paginate.updatePagination(resp)
    }
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

// Composables
const options = {
  pageSize: config.USER_TASKS_QUEUES_LIST
}
const paginate = usePaginate(fetchUserTaskQueue, options)
fetchUserTaskQueue()
</script>

