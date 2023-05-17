<template>
  <div class="content mt-4">
    <h2 class="font-bold text-xl block text-blueGray-700 mb-4">Tasks</h2>

    <div class="header flex flex-col justify-between mb-4 gap-y-3">
      <button
          v-if="!hideCreate"
          @click="createTask"
          class="whitespace-nowrap w-fit bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
          type="button"
      >
        Create Task
      </button>

      <div class="w-full flex gap-x-6">
        <div class="relative w-full md:w-2/4">
          <i class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-[12px] left-[8px]"/>
          <input
              v-model="filter.search.value"
              type="text"
              class="border-0 pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Search"
          />
        </div>

      </div>

            <div class="flex items-center">
              <input
                  id="hideClosed"
                  v-model="hideClosed"
                  type="checkbox"
                  class="border-0 flex pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm ease-linear transition-all duration-150 cursor-pointer"
                  placeholder="Search"
              />
              <label for="hideClosed" class="text-md text-blueGray-500 font-medium cursor-pointer ml-2 whitespace-nowrap">Hide closed tasks</label>
            </div>
    </div>

    <DataTable :headers="headers" @sorting="sorting">
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
              @change="changeDrag"
          >
            <template #item="{element}">
              <tr :class="{'cursor-move': !isDragDisabled}">
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                   <span v-if="element.title" class="cursor-pointer" @click="toLink(element)">{{
                       element.title
                     }}</span>
                  <span v-else>-</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span>{{ element.status || '-' }}</span>
                </td>

                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    v-if="hideCreate">
                   <span v-if="element.project?.title" class="cursor-pointer" @click="toLink(element.project,true)">{{
                       element.project.title
                     }}</span>
                  <span v-else>-</span>
                </td>

                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span>{{ element.urgency_level || '-' }}</span>
                </td>

                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <span v-if="element.owner?.first_name || element.owner?.last_name">{{
                              element.owner?.first_name
                            }} {{ element.owner?.last_name }}</span>
                  <span v-else>{{ element.owner?.username }}</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <span v-if="element.responsible?.first_name || element.responsible?.last_name">{{
                              element.responsible?.first_name
                            }} {{ element.responsible?.last_name }}</span>
                  <span v-else>{{ element.responsible?.username || '-' }}</span>

                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span>{{ convertDayDiff(element.eta_date) }}</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span>{{ element.tag || '-' }}</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span>{{ element.progress || 0 }}%</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span class="block">{{ element.is_closed ? 'Yes' : 'No' }}</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {{ convertDate(element.created_at) }}
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
import {computed, ref, watch} from "vue";
import {useTasksStore} from "../../store/tasks";
import {catchErrors} from "../../utils";
import draggable from 'vuedraggable'
import {convertDate, convertDayDiff} from "../../utils";
import {useRouter} from "vue-router";
import {usePaginate} from "../../composables/usePaginate";
import {useFilter} from "../../composables/useFilter";

const props = defineProps({
  projectId: {
    type: String,
    default: ''
  },
  projectTitle: {
    type: String,
    default: ''
  },
  haveProjectAccessIds: {
    type: Array,
    default: () => []
  },
  hideCreate: {
    type: Boolean,
    default: false
  },
})

const tasksStore = useTasksStore()
const router = useRouter()

const isDragDisabled = false
const loading = ref(false)
const tasks = ref([])
const tempData = ref([])
const hideClosed = ref(true)


// Watch
watch(() => props.haveProjectAccessIds, (newValue, oldValue) => {
  if (JSON.stringify(newValue.sort()) !== JSON.stringify(oldValue.sort())) {
    fetchTasks()
  }
})

watch( hideClosed, (newValue, oldValue) => {
    fetchTasks()
})


// Computed
const headers = computed(() => {
  const list = [
    {id: 1, label: 'Title', sorting: true, sortLabel: 'title'},
    {id: 2, label: 'Status', sorting: true, sortLabel: 'status'},
    {id: 3, label: 'Urgency Level', sorting: true, sortLabel: 'status'},
    {id: 4, label: 'Owner', sorting: true, sortLabel: 'owner'},
    {id: 5, label: 'Responsible', sorting: true, sortLabel: 'responsible'},
    {id: 6, label: 'ETA', sorting: true, sortLabel: 'eta'},
    {id: 7, label: 'Tag', sorting: true, sortLabel: 'tag'},
    {id: 8, label: 'Progress', sorting: true, sortLabel: 'progress'},
    {id: 9, label: 'Closed', sorting: true, sortLabel: 'is_closed'},
    {id: 10, label: 'Created at', sorting: true, sortLabel: 'created_at'},
  ]

  const projectObj = {id: 11, label: 'Project', sorting: true, sortLabel: 'project'}
  if (props.hideCreate) list.splice(2, 0, projectObj)

  return list
})


// Methods
const fetchTasks = async (label = null) => {
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      search: filter.search.value,
      id: props.projectId,
      sorting: label,
      isClosed: hideClosed.value
    }
    const resp = await tasksStore.fetchTasks(options)
    tasks.value = resp.data.results
    tempData.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
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

    if (newIndex !== tempData.value.length){
      const nextItem = tempData.value.find((item, index) => index === newIndex + 1)
      belowItemId = nextItem?.id
    }

    const data = {
      id: e.moved.element.id,
      task_above_id: aboveItemId,
      task_below_id: belowItemId,
    }

    await tasksStore.updateOrder(data)
  } catch (e) {
    catchErrors(e)
  }

}

const sorting = (label) => {
  fetchTasks(label)
}

const toLink = (item, isProject) => {
  const type = isProject ? 'project' : 'task'
  router.push(`/dashboard/${type}/${item.id}`)
}

const createTask = () => {
  const obj = {
    id: props.projectId,
    name: props.projectTitle,
  }
  localStorage.setItem('tempProject', JSON.stringify(obj))
  router.push('/dashboard/create-task')
}

// Composables
const paginate = usePaginate(fetchTasks, null)
const filter = useFilter(tasks, fetchTasks)

// Run Functions
fetchTasks()

</script>
