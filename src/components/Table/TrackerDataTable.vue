<template>
  <div class="content mt-4">
    <h2 class="font-semibold text-lg text-black-c block mb-[10px]">Time Tracker</h2>

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
              <p class="flex text-center px-4 justify-center py-8 text-black-c font-medium">
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
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    v-if="!taskId">
                  <router-link v-if="element.task" :to="`/dashboard/task/${element.task?.id}`" class="p-4">{{
                      element.task.title || '-'
                    }}
                  </router-link>
                  <span v-else>-</span>
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {{ element.started_at ? convertDateTimezone(element.started_at) : '' }}
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {{ element.stopped_at ? convertDateTimezone(element.stopped_at) : '-' }}
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  <span class="truncate block">
                    {{ convertHumanTime(element.total_time) }}
                  </span>
                </td>
                <td v-if="canEdit"
                    class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                >
                  <Button v-if="isOwner(element)" label="Edit" version="white" size="small"
                          @on-click="openModal(element)"/>
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


    <TimeTrackerModal
        :show-modal="showEditModal"
        :task="current"
        :btn-title="'Edit'"
        @close="showEditModal = false"
        @update="fetchTasksTracker"
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
import {convertDateTimezone} from "../../utils";
import {useRouter} from "vue-router";
import {usePaginate} from "../../composables/usePaginate";
import {useToast} from "vue-toastification";
import {useTasksStore} from "../../store/tasks";
import {useFilter} from "../../composables/useFilter";
import {convertHumanTime} from "../../utils";
import TimeTrackerModal from '../Modals/TimeTrackerModal.vue'
import {useCookies} from "vue3-cookies";
import Button from "../Button/Button.vue";
import DownloadIcon from "../Svg/DownloadIcon.vue";

const props = defineProps({
  taskId: {
    type: String,
    default: ''
  },
  userId: {
    type: String,
    default: ''
  },
  canEdit: {
    type: Boolean,
    default: false
  },
})


const tasksStore = useTasksStore()
const toast = useToast()
const router = useRouter()
const {cookies} = useCookies();

const isDragDisabled = true
const loading = ref(false)
let showEditModal = ref(false)
const current = ref(null)
const tasks = ref([])


// Computed
const headers = computed(() => {
  const list = [
    {id: 1, label: 'User', sorting: true, sortLabel: 'user'},
    {id: 2, label: 'Task started', sorting: true, sortLabel: 'started_at'},
    {id: 3, label: 'Task stopped', sorting: true, sortLabel: 'stopped_at'},
    {id: 4, label: 'Total time', sorting: true, sortLabel: 'total_time'},
  ]

  const taskObj = {id: 5, label: 'Task', sorting: true, sortLabel: 'task'}
  const taskEdit = {id: 6, label: 'Action', sorting: false}
  if (!props.taskId) list.splice(1, 0, taskObj)

  if (props.canEdit) list.splice(4, 0, taskEdit)

  return list
})


// Methods
const isOwner = (element) => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')

  return element.user.id === user.pk
}

const openModal = (item) => {
  current.value = item
  showEditModal.value = true
}

const fetchTasksTracker = async (label = null) => {
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      search: filter.search.value,
      sorting: label || "-updated_at",
      id: props.taskId
    }

    if (props.userId) options.user = props.userId

    const resp = await tasksStore.fetchTasksTracker(options)
    tasks.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

const sorting = (label) => {
  fetchTasksTracker(label)
}

// Composables
const paginate = usePaginate(fetchTasksTracker, null)
const filter = useFilter(tasks, fetchTasksTracker)

// Run Functions
fetchTasksTracker()

</script>
