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

      <div class="flex items-center flex-wrap gap-x-4 gap-y-3">
        <div class="flex gap-x-6">
          <div class="relative w-full ">
            <i class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-[12px] left-[8px]"/>
            <input
                v-model="filter.search.value"
                type="text"
                class="border-0 pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Search by task"
            />
          </div>

        </div>

        <div>
          <select v-model="form.status"
                  class="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
          >
            <option class="" value="" disabled selected>Select Status</option>
            <option :value="status.label" v-for="(status) in statuses" :key="status.id">
              {{ status.label }}
            </option>
          </select>
        </div>

        <div class="flex gap-x-6">
          <div class="relative w-full ">
            <i class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-[12px] left-[8px]"/>
            <input
                v-model="filter.projectSearch.value"
                type="text"
                class="border-0 pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Search by project"
            />
          </div>

        </div>

        <div>
          <select v-model="form.owner"
                  class="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
          >
            <option class="" value="" disabled selected>Select Owner</option>
            <option :value="user.id" v-for="(user) in users" :key="user.id">
              {{user.first_name ? `${user.first_name} ${user.last_name}` : `${user.username}`}}
            </option>
          </select>
        </div>

        <div>
          <select v-model="form.responsibleUser"
                  class="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
          >
            <option class="" value="" disabled selected>Select Responsible</option>
            <option :value="user.id" v-for="(user) in users" :key="user.id">
              {{user.first_name ? `${user.first_name} ${user.last_name}` : `${user.username}`}}
            </option>
          </select>
        </div>

        <div class="flex gap-x-6">
          <div class="relative w-full ">
            <i class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-[12px] left-[8px]"/>
            <input
                v-model="filter.tagSearch.value"
                type="text"
                class="border-0 pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Search by tag"
            />
          </div>

        </div>

        <div class="flex gap-x-6">
          <div class="relative w-full ">
            <i class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-[12px] left-[8px]"/>
            <input
                v-model="form.createdAtAfter"
                :type="typeAfter"
                @focus="typeAfter='date'"
                @blur="typeAfter='text'"
                class="border-0 pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Created at after"
            />
          </div>
        </div>

        <div class="flex gap-x-6">
          <div class="relative w-full ">
            <i class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-[12px] left-[8px]"/>
            <input
                v-model="form.createdAtBefore"
                :type="typeBefore"
                @focus="typeBefore='date'"
                class="border-0 pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Created at before"
            />
          </div>
        </div>

      </div>


      <div>
        <div class="inline-flex items-center mr-6">
          <input
              id="hideClosed"
              v-model="form.hideClosed"
              type="checkbox"
              class="border-0 flex pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm ease-linear transition-all duration-150 cursor-pointer"
              placeholder="Search"
          />
          <label for="hideClosed" class="text-md text-blueGray-500 font-medium cursor-pointer ml-2 whitespace-nowrap">Hide
            closed tasks</label>
        </div>

        <div class="inline-flex items-center mr-6">
          <input
              id="showCurrentUser"
              v-model="form.showCurrentUser"
              type="checkbox"
              class="border-0 flex pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm ease-linear transition-all duration-150 cursor-pointer"
              placeholder="Search"
          />
          <label for="showCurrentUser"
                 class="text-md text-blueGray-500 font-medium cursor-pointer ml-2 whitespace-nowrap">Just mine</label>
        </div>

        <div class="inline-flex items-center mr-6">
          <input
              id="urgent"
              v-model="form.isUrgent"
              type="checkbox"
              class="border-0 flex pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm ease-linear transition-all duration-150 cursor-pointer"
              placeholder="Search"
          />
          <label for="urgent"
                 class="text-md text-blueGray-500 font-medium cursor-pointer ml-2 whitespace-nowrap">Urgent tasks</label>
        </div>
      </div>

      <div>
        <span class="underline text-blueGray-500 cursor-pointer font-medium text-sm" @click="clearFilters">Clear all filters</span>
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
import {computed, ref, watch} from "vue";
import {useTasksStore} from "../../store/tasks";
import {catchErrors} from "../../utils";
import draggable from 'vuedraggable'
import {convertDate, convertDayDiff, convertDayDiffCon} from "../../utils";
import {useRouter} from "vue-router";
import {usePaginate} from "../../composables/usePaginate";
import {useFilter} from "../../composables/useFilter";
import {useCookies} from "vue3-cookies";
import {useUserStore} from "../../store/user";

const statuses = [
  {id: 0, label: 'NONE'},
  {id: 1, label: 'ON HOLD'},
  {id: 2, label: 'OPEN'},
  {id: 3, label: 'IN PROGRESS'},
  {id: 4, label: 'IDEA'},
  {id: 5, label: 'TO VERIFY'},
  {id: 6, label: 'BLOCKER'},
  {id: 7, label: 'DONE'}
]

const defaultValues = {
  hideClosed: true,
  showCurrentUser: false,
  isUrgent: false,
  status: '',
  owner: '',
  responsibleUser: '',
  createdAtAfter: '',
  createdAtBefore: '',
}

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
const usersStore = useUserStore()
const router = useRouter()
const {cookies} = useCookies();

const isDragDisabled = false
const loading = ref(false)
const typeAfter = ref('text')
const typeBefore = ref('text')
const tasks = ref([])
const users = ref([])
const tempData = ref([])
const form = ref({
  hideClosed: true,
  showCurrentUser: false,
  isUrgent: false,
  status: '',
  owner: '',
  responsibleUser: '',
  createdAtAfter: '',
  createdAtBefore: '',
})


// Watch
watch(() => props.haveProjectAccessIds, (newValue, oldValue) => {
  if (JSON.stringify(newValue.sort()) !== JSON.stringify(oldValue.sort())) {
    fetchTasks()
  }
})

watch(()=>form.value, (newValue, oldValue) => {
  fetchTasks()
},{ deep: true })


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

const currentUser = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')

  if (user) return user

  return null
})


// Methods
const fetchTasks = async (label = null) => {
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      search: filter.search.value,
      tag: filter.tagSearch.value,
      projectSearch: filter.projectSearch.value,
      id: props.projectId,
      sorting: label || "-updated_at",
      isClosed: form.value.hideClosed,
      is_urgent: form.value.isUrgent,
      status: form.value.status,
      owner: form.value.owner,
      responsibleUser: form.value.responsibleUser,
      createdAtAfter: form.value.createdAtAfter,
      createdAtBefore: form.value.createdAtBefore,
      responsible: form.value.showCurrentUser ? currentUser.value : null,
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

const fetchUsers = async () => {
  try {
    const resp = await usersStore.fetchUsers()
    users.value.push({
      id: 0,
      first_name: 'None',
      last_name: '',
      username: '',
    })
    users.value = [...users.value,...resp.data.results]
  } catch (e) {
    catchErrors(e)
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

const clearFilters = ()=>{
  form.value = {
    hideClosed: true,
    showCurrentUser: false,
    isUrgent: false,
    status: '',
    owner: '',
    responsibleUser: '',
    createdAtAfter: '',
    createdAtBefore: '',
}
  filter.resetAll()
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
fetchUsers()

</script>
