<template>
  <div class="main-container pt-6 pb-6">
    <h2 class="flex font-semibold text-xl block text-black-c mb-3" v-if="currentUser">{{ currentUser.first_name }}
      {{ currentUser.last_name }}</h2>

    <div v-if="currentTask" class="working-task mb-3 text-black-c text-sm">
      Currently working on:
      <span class="underline cursor-pointer" @click="toLinkPage('task')">{{
          currentTask.title
        }}</span>
      <template v-if="currentTask.project?.title">
        in project
        <span class="underline cursor-pointer"
              @click="toLinkPage('project')">{{ currentTask.project.title }}</span>
      </template>
    </div>

    <ul class="inline-flex align-center overflow-hidden mb-3 mt-2">
      <li v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id" class="text-black-c text-lg cursor-pointer px-4 pt-2 pb-1"
          :class="{'border-b-2 border-green-c font-semibold': activeTab === tab.id}">
        {{ tab.label }}
      </li>
    </ul>


    <Loader v-if="loading"/>

    <template v-else>
      <template v-if="activeTab === 1">
        <div class="mb-8">
          <UrgentTasksDataTable :is-task="true" :user-id="route.params.id"/>
        </div>
        <div class="content mb-8">
          <h2 class="font-semibold text-lg text-black-c block mb-3">Queue</h2>
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
                    <p class="flex justify-center py-8 px- text-black-c font-medium">
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
      </template>

      <div class="mb-8" v-else-if="activeTab === 2">
        <TrackerDataTable :hide-create="true" :user-id="currentUser.id"/>
      </div>

      <template v-else-if="activeTab === 3">
        <div class="accesses mt-4 mb-8">
          <h2 class="font-semibold text-lg text-black-c block mb-3">Project Access</h2>
          <DataTable :headers="headersProject">
            <template v-slot:tableBody>
              <tr v-if="loading">
                <td :colspan="headersProject.length">
                  <div class="flex justify-center py-1 text-blueGray-500 font-medium">
                    <Loader/>
                  </div>
                </td>
              </tr>

              <template v-else>
                <tr v-if="!projectsAccess.length">
                  <td :colspan="headersProject.length">
                    <p class="flex justify-center py-8 px- text-black-c font-medium">
                      No data found
                    </p>
                  </td>
                </tr>

                <draggable
                    v-else
                    tag="tbody"
                    :disabled="true"
                    v-model="projectsAccess"
                    item-key="id"
                    group="id"
                >
                  <template #item="{element}">
                    <tr :class="{'cursor-move': false}">
                      <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <span @click.stop="toLink(`/dashboard/project/${element.id}`)"
                            class="cursor-pointer">{{ element.title || '-' }}</span>
                      </td>
                    </tr>
                  </template>
                </draggable>
              </template>
            </template>
          </DataTable>
          <Pagination
              v-if="paginateProject.pagination.value.total > 1 && !loading"
              :pagination="paginateProject.pagination.value"
              v-model:query="paginateProject.query.value"
          />
        </div>

        <div class="accesses">
          <h2 class="font-semibold text-lg text-black-c block mb-3">Tasks Access</h2>
          <DataTable :headers="headersTask">
            <template v-slot:tableBody>
              <tr v-if="loading">
                <td :colspan="headersTask.length">
                  <div class="flex justify-center py-1 text-blueGray-500 font-medium">
                    <Loader/>
                  </div>
                </td>
              </tr>

              <template v-else>
                <tr v-if="!tasksAccess.length">
                  <td :colspan="headersTask.length">
                    <p class="flex justify-center py-8 px- text-black-c font-medium">
                      No data found
                    </p>
                  </td>
                </tr>

                <draggable
                    v-else
                    tag="tbody"
                    :disabled="true"
                    v-model="tasksAccess"
                    item-key="id"
                    group="id"
                >
                  <template #item="{element}">
                    <tr :class="{'cursor-move': false}">
                      <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <span @click.stop="toLink(`/dashboard/task/${element.id}`)"
                            class="cursor-pointer">{{ element.title || '-' }}</span>
                      </td>
                    </tr>
                  </template>
                </draggable>
              </template>
            </template>
          </DataTable>
          <Pagination
              v-if="paginateTask.pagination.value.total > 1 && !loading"
              :pagination="paginateTask.pagination.value"
              v-model:query="paginateTask.query.value"
          />
        </div>
      </template>
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
import UrgentTasksDataTable from '../../components/Table/UrgentTasksDataTable.vue'
import TrackerDataTable from '../../components/Table/TrackerDataTable.vue'
import Pagination from "./../../components/Pagination/Pagination.vue"
import {usePaginate} from "../../composables/usePaginate";
import draggable from 'vuedraggable'
import {useUserStore} from "../../store/user";
import {useTasksStore} from "../../store/tasks";
import {useProjectStore} from "../../store/project";
import config from "../../config";

const route = useRoute()
const router = useRouter()
const usersTasksStore = useUsersTasksStore()
const userStore = useUserStore()
const tasksStore = useTasksStore()
const projectStore = useProjectStore()


// State
const isDragDisabled = false
const loading = ref(false)
const tempData = ref([])
const userTasks = ref([])
const projectsAccess = ref([])
const tasksAccess = ref([])
const currentUser = ref(null)
const currentTask = ref(null)
const activeTab = ref(1)


// Computed
const tabs = computed(() => {
  return [
    {id: 1, label: 'Tasks'},
    {id: 2, label: 'Time Tracker'},
    {id: 3, label: 'Access'},
  ]
})
const headers = computed(() => {
  return [
    {id: 2, label: 'Task', sorting: false, sortLabel: 'task'},
    {id: 1, label: 'Project', sorting: false, sortLabel: 'project'},
  ]
})

const headersProject = computed(() => {
  return [
    {id: 1, label: 'Project', sorting: false, sortLabel: 'project'},
  ]
})

const headersTask = computed(() => {
  return [
    {id: 1, label: 'Task', sorting: false, sortLabel: 'task'},
  ]
})


// Methods
const toLinkPage = (type) => {
  if (type === 'task') return router.push(`/dashboard/task/${currentTask.value.id}`)
  else return router.push(`/dashboard/project/${currentTask.value.project.id}`)
}
const toLink = (link) => {
  router.push(link)
}
const fetchUser = async () => {
  try {
    const id = route.params.id
    if (id) {
      const resp = await userStore.fetchCurrentUser({id})
      currentUser.value = resp.data

      await fetchCurrentTask()
    }
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

const fetchTasksAccess = async () => {
  try {
    const id = route.params.id
    if (id) {
      const options = {
        pagination: paginateTask.pagination.value,
        query: paginateTask.query.value,
        userId: id
      }
      const resp = await tasksStore.fetchTasks(options)
      tasksAccess.value = resp.data.results
      paginateTask.updatePagination(resp)
    }

  } catch (e) {
    catchErrors(e)
  }
}

const fetchProjectAccess = async () => {
  try {
    const id = route.params.id
    if (id) {
      const options = {
        pagination: paginateProject.pagination.value,
        query: paginateProject.query.value,
        userId: id
      }
      const resp = await projectStore.fetchProjects(options)
      projectsAccess.value = resp.data.results
      paginateProject.updatePagination(resp)
    }

  } catch (e) {
    catchErrors(e)
  }
}

const fetchCurrentTask = async () => {
  try {
    const resp = await tasksStore.fetchWorkingTask({id: currentUser.value.id})
    if (resp.data && Object.keys(resp.data).length) {
      currentTask.value = resp.data
    }
  } catch (e) {
    catchErrors(e)
  }
}

// Composables
const options = {
  pageSize: config.USER_TASKS_QUEUES_LIST
}
const paginate = usePaginate(fetchUsersTask, options)
const paginateTask = usePaginate(fetchTasksAccess, null)
const paginateProject = usePaginate(fetchProjectAccess, null)

fetchUsersTask()
fetchUser()
fetchTasksAccess()
fetchProjectAccess()
</script>
