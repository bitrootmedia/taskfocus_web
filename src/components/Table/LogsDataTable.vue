<template>
  <div class="content mt-4">
    <h2 class="font-semibold text-lg text-black-c block mb-[10px]">Logs</h2>

    <div class="header flex flex-col md:flex-row w-full sm:w-[250px] items-baseline md:items-center justify-between mb-[10px] gap-y-3">
      <div class="relative w-full">
        <SearchIcon class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-1 left-2"/>
        <input
            v-model="filter.search.value"
            type="text"
            class="pl-9 pr-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Search"
        />
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
          <tr v-if="!logs.length">
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
              v-model="logs"
              item-key="id"
              group="id"
          >
            <template #item="{element}">
              <tr :class="{'cursor-move': !isDragDisabled}">
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {{ convertDateTime(element.created_at) }}
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span v-if="element.user?.first_name || element.user?.last_name">{{
                      element.user?.first_name
                    }} {{ element.user?.last_name }}</span>
                  <span v-else>{{ element.user?.username }}</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    v-if="hideCreate">
                   <span v-if="element.project?.title" class="cursor-pointer" @click="toLink(element.project,true)">{{
                       element.project.title
                     }}</span>
                  <span v-else>-</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" v-if="!isTask">
                  <span v-if="element.task" class="cursor-pointer" @click="toLink(element.task)">{{ element.task.title }}</span>
                  <span v-else>-</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4" v-if="isTask">
                  <span v-if="isTask && element.project" class="cursor-pointer" @click="toLink(element.project,true)">{{ element.project.title }}</span>
                  <span v-else>-</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    width="30%">
                  <span class="truncate block w-[150px] md:w-[300px]">{{ element.message }}</span>
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
import {useFilter} from "../../composables/useFilter";
import {useToast} from "vue-toastification";
import {useLogsStore} from "../../store/logs";
import SearchIcon from "../Svg/SearchIcon.vue";

const props = defineProps({
  projectId: {
    type: String,
    default: ''
  },
  taskId: {
    type: String,
    default: ''
  },
  hideCreate: {
    type: Boolean,
    default: false
  },
  isTask: {
    type: Boolean,
    default: false
  },
})


const logsStore = useLogsStore()
const toast = useToast()
const router = useRouter()

const isDragDisabled = true
const loading = ref(false)
const logs = ref([])


// Computed
const headers = computed(() => {
  const list = [
    {id: 1, label: 'Created at', sorting: true, sortLabel: 'created_at'},
    {id: 2, label: 'User', sorting: true, sortLabel: 'author'},
    {id: 3, label: 'Task', sorting: true, sortLabel: 'task'},
    {id: 4, label: 'Message', sorting: true, sortLabel: 'content'},
  ]

  const projectObj = {id: 5, label: 'Project', sorting: true, sortLabel: 'project'}
  if (props.isTask) list.splice(2, 1, projectObj)
  else if (props.hideCreate) list.splice(2, 0, projectObj)

  return list
})


// Methods
const fetchLogs = async (label = null) => {
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      search: filter.search.value,
      id: props.projectId || props.taskId,
      type: props.isTask ? 'task' : 'project',
      sorting: label
    }
    const resp = await logsStore.fetchLogs(options)
    logs.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

const sorting = (label) => {
  fetchLogs(label)
}

const toLink = (item, isProject = false) => {
  const type = isProject ? 'project' : 'task'
  router.push(`/dashboard/${type}/${item.id}`)
}

// Composables
const paginate = usePaginate(fetchLogs, null)
const filter = useFilter(logs, fetchLogs)

// Run Functions
fetchLogs()

</script>
