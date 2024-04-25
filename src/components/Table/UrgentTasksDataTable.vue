<template>
  <div class="content mt-4">
    <h2 class="font-semibold text-lg text-black-c block mb-3">Urgent Tasks</h2>

    <div class="header flex flex-col justify-between mb-4 gap-y-3">
      <div class="w-full flex gap-x-6">
        <div class="relative w-[250px]">
          <Input placeholder="Search" v-model:value="filter.search.value" leftIcon/>
        </div>
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
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {{ convertDate(element.updated_at) }}
                </td>
                <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span>{{ element.position || '-' }}</span>
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
import {useTasksStore} from "../../store/tasks";
import {catchErrors} from "../../utils";
import draggable from 'vuedraggable'
import {convertDate} from "../../utils";
import {useRouter} from "vue-router";
import {usePaginate} from "../../composables/usePaginate";
import {useFilter} from "../../composables/useFilter";
import {useCookies} from "vue3-cookies";
import config from "../../config";
import Input from '../Input/Input.vue'

const props = defineProps({
  taskId: {
    type: String,
    default: ''
  },
  userId: {
    type: String,
    default: ''
  },
  isTask:{
    type: Boolean,
    default: false
  }
})

const tasksStore = useTasksStore()
const router = useRouter()
const {cookies} = useCookies();

const isDragDisabled = false
const loading = ref(false)
const tasks = ref([])
const tempData = ref([])
const hideClosed = ref(true)

// Computed
const headers = computed(() => {
  const list = [
    {id: 1, label: 'Title', sorting: true, sortLabel: 'title'},
    {id: 2, label: 'Status', sorting: true, sortLabel: 'status'},
    {id: 4, label: 'Owner', sorting: true, sortLabel: 'owner'},
    {id: 5, label: 'Responsible', sorting: true, sortLabel: 'responsible'},
    {id: 7, label: 'Tag', sorting: true, sortLabel: 'tag'},
    {id: 8, label: 'Progress', sorting: true, sortLabel: 'progress'},
    {id: 9, label: 'Closed', sorting: true, sortLabel: 'is_closed'},
    {id: 10, label: 'Created at', sorting: true, sortLabel: 'created_at'},
    {id: 12, label: 'Updated at', sorting: true, sortLabel: 'updated_at'},
    {id: 13, label: 'Position', sorting: true, sortLabel: 'position'},
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
      sorting: label || "-updated_at",
      isClosed: hideClosed.value,
      is_urgent: true,
    }

    if (props.userId){
      options.responsible = {
        pk: props.userId
      }
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
    const oldIndex = e.moved.oldIndex
    let aboveItemId = null
    let belowItemId = null

    if (+newIndex > +oldIndex) {
      // top-bottom
      if (newIndex !== 0) {
        const findItem = tempData.value.find((item, index) => index === newIndex)
        aboveItemId = findItem?.id
      }

      if (newIndex !== tempData.value.length) {
        const nextItem = tempData.value.find((item, index) => index === newIndex + 1)
        belowItemId = nextItem?.id
      }
    } else {
      // bottom-top
      if (newIndex !== 0) {
        const findItem = tempData.value.find((item, index) => index === newIndex - 1)
        aboveItemId = findItem?.id
      }

      if (newIndex !== tempData.value.length) {
        const nextItem = tempData.value.find((item, index) => index === newIndex)
        belowItemId = nextItem?.id
      }
    }

    const data = {
      id: e.moved.element.id,
      task_above_id: aboveItemId,
    }

    if (props.projectId) data.project_id = props.projectId
    else data.user_task_queue_id = belowItemId

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

// Composables
const options = {
  pageSize: config.URGENT_TASKS
}
const paginate = usePaginate(fetchTasks, options)
const filter = useFilter(tasks, fetchTasks)

// Run Functions
fetchTasks()
</script>
