<template>
  <div class="content mt-4">
    <h2 class="font-bold text-xl block text-blueGray-700 mb-4">Tasks Tracker</h2>

<!--    <div class="header flex flex-col md:flex-row items-baseline md:items-center justify-between mt-4 mb-4 gap-y-3">-->
<!--      <div class="relative w-full md:w-2/4">-->
<!--        <i class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-[12px] left-[8px]"/>-->
<!--        <input-->
<!--            v-model="filter.search.value"-->
<!--            type="text"-->
<!--            class="border-0 pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"-->
<!--            placeholder="Search"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->

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
          <tr v-if="!tasks.length">
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
              v-model="tasks"
              item-key="id"
              group="id"
          >
            <template #item="{element}">
              <tr :class="{'cursor-move': !isDragDisabled}">
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span v-if="element.user?.first_name || element.user?.last_name">{{
                      element.user?.first_name
                    }} {{ element.user?.last_name }}</span>
                  <span v-else>{{ element.user?.username }}</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" v-if="!taskId">
                  <span v-if="element.task" class="cursor-pointer" @click="toLink(element.task)">{{ element.task.title }}</span>
                  <span v-else>-</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {{ element.started_at ? convertDateTime(element.started_at) : '' }}
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {{ element.stopped_at ? convertDateTime(element.stopped_at) : '-' }}
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    width="30%">
                  <span class="truncate block w-[150px] md:w-[300px]">
                    {{convertHumanTime(element.total_time)}}
                  </span>
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

<script setup>
import Loader from './../Loader/Loader.vue'
import DataTable from "./DataTable.vue"
import Pagination from './../Pagination/Pagination.vue'
import {computed, ref} from "vue";
import {catchErrors} from "../../utils";
import draggable from 'vuedraggable'
import {convertDateTime} from "../../utils";
import {useRouter} from "vue-router";
import {usePaginate} from "../../composables/usePaginate";
import {useToast} from "vue-toastification";
import {useTasksStore} from "../../store/tasks";
import {useFilter} from "../../composables/useFilter";
import {convertHumanTime} from "../../utils";

const props = defineProps({
  taskId: {
    type: String,
    default: ''
  },
})


const tasksStore = useTasksStore()
const toast = useToast()
const router = useRouter()

const isDragDisabled = true
const loading = ref(false)
const tasks = ref([])


// Computed
const headers = computed(() => {
  const list = [
    {id: 1, label: 'User', sorting: false},
    {id: 2, label: 'Task started',  sorting: false},
    {id: 3, label: 'Task stopped',  sorting: false},
    {id: 4, label: 'Total time', sorting: false},
  ]

  const taskObj = {id: 5, label: 'Task', sorting: false}
  if (!props.taskId) list.splice(1, 0, taskObj)

  return list
})

// Methods


const fetchTasksTracker = async (label = null) => {
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      search: filter.search.value,
      id: props.taskId
    }
    const resp = await tasksStore.fetchTasksTracker(options)
    tasks.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

const toLink = (item) => {
  router.push(`/dashboard/task/${item.id}`)
}

// Composables
const paginate = usePaginate(fetchTasksTracker, null)
const filter = useFilter(tasks, fetchTasksTracker)

// Run Functions
fetchTasksTracker()

</script>
