<template>
  <div class="main-container">
    <Loader v-if="loading"/>

    <div v-else>
      <div class="header flex flex-col md:flex-row justify-between gap-x-2 lg:gap-x-10 mb-10">
        <div class="w-full ">
          <div class="flex justify-between sm:justify-start gap-x-4 sm:gap-x-10 items-center mb-6">
            <div :class="{'w-5/6 sm:w-3/4 md:w-3/6': isEditPanel.title}">
              <h1 v-if="!isEditPanel.title" class="text-3xl font-bold text-blueGray-700 mb-1 cursor-pointer"
                  @click="isEditPanel.title = true">{{ task?.title }}</h1>
              <div v-else class="mb-2">
                <input
                    v-model="form.title"
                    type="text"
                    class=" border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Project Title"
                />
                <span class="text-xs font-medium text-red-600" v-if="v$.title.$error"> {{
                    v$.title.$errors[0].$message
                  }} </span>
              </div>
            </div>

            <div class="flex items-center gap-x-2" v-if="task?.project">
              <span class="text-sm text-blueGray-600 whitespace-nowrap">In project:</span>
              <h2 class="text-lg sm:text-2xl font-bold text-blueGray-700 mb-1 cursor-pointer lg:whitespace-nowrap"
                  @click="router.push(`/dashboard/project/${task.project.id}`)">
                {{ task.project?.title }}</h2>
            </div>
          </div>

          <div class="actions mb-4 flex gap-x-1 sm:gap-x-4 flex-wrap">
            <button
                v-if="!task?.is_closed"
                @click="toggleTask(currentTask?.id === task?.id ? 'stop' : 'work')"
                class="mt-2 bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              {{ currentTask?.id === task?.id ? 'Stop working on this task' : 'Work on this task' }}
            </button>

            <button
                v-if="isAuthOwner && task.is_closed"
                @click="uncloseTask"
                class="mt-2 bg-yellow-600 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Unclose task
            </button>

            <button
                v-else-if="isAuthOwner"
                @click="confirmModal = true"
                class="mt-2 bg-yellow-600 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Close task
            </button>

            <button
                v-if="isAuthOwner"
                @click="showModal = true"
                class="mt-2 bg-blueGray-400 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Change project
            </button>

            <button
                v-if="isAuthOwner"
                @click="showUsersModal = true"
                class="mt-2 bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Manage Task Users
            </button>

            <button
                v-if="isAuthOwner"
                @click="showUsersQueueModal = true"
                class="mt-2 bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Queue
            </button>

            <button
                v-if="showBtn"
                @click="updateMyQueue"
                :class="[!isAuthQueue ? 'bg-blueGray-800' : 'bg-red-800']"
                class="mt-2 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              {{ !isAuthQueue ? 'Add to my queue' : 'Remove from my queue' }}
            </button>

            <button
                v-if="isAuthOwner"
                @click="showReminderModal = true"
                class="mt-2 bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Add Reminder
            </button>
          </div>

          <div class="mb-2 sm:mb-4">
            <div class="text-blueGray-500">
              Task Owner: &nbsp;
              <b :class="{'cursor-pointer': isAuthOwner}" @click="isAuthOwner ? isEditPanel.owner = true : null"
                 v-if="!isEditPanel.owner">
                <span v-if="task.owner?.first_name || task.owner?.last_name">{{
                    task.owner?.first_name
                  }} {{ task.owner?.last_name }}</span>
                <span v-else>{{ task.owner?.username }}</span>
              </b>

              <div v-else class="mb-2 w-80">
                <select v-model="form.owner" placeholder="Select User"
                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  <option :value="user.id" v-for="(user) in users" :key="user.id">{{ user.first_name }}
                    {{ user.last_name }}
                  </option>
                </select>
              </div>

            </div>
          </div>

          <div class="mb-2 sm:mb-4">
            <div class="flex gap-x-1">
              <span class="text-blueGray-500 whitespace-nowrap">Task Access: &nbsp;</span>

              <ul class="flex gap-x-2 flex-wrap">
                <li class="text-blueGray-500 font-bold">
                  {{ task.owner?.first_name }} {{
                    task.owner?.last_name
                  }}(owner){{ haveTaskAccess.length || haveProjectAccess.length ? ',' : '' }}
                </li>

                <li v-if="haveProjectAccess.length" v-for="(item,index) in haveProjectAccess" :key="item.user.id"
                    class="text-blueGray-500 font-bold">
                  {{ item.user.first_name }} {{ item.user.last_name }}<span class="text-blueGray-500 font-bold">(project)</span><span
                    v-if="haveTaskAccessIds.length || index !== haveProjectAccess.length - 1">,</span>
                </li>

                <li v-if="haveTaskAccess.length" v-for="(item,index) in haveTaskAccess" :key="item.user.id"
                    class="text-blueGray-500 font-bold">
                  {{ item.user.first_name }} {{ item.user.last_name }}<span
                    class="text-blueGray-500 font-bold">(task)</span><span
                    v-if="index !== haveTaskAccess.length - 1">,</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="mb-2 sm:mb-4">
            <div class="text-blueGray-500">
              Responsible: &nbsp;
              <b class="cursor-pointer" @click="isEditPanel.user = true" v-if="!isEditPanel.user">
                <span v-if="task.responsible?.first_name || task.responsible?.last_name"> {{
                    task.responsible?.first_name
                  }} {{ task.responsible?.last_name }}</span>
                <span v-else-if="task.responsible?.username"> {{ task.responsible?.username }}</span>
                <span v-else>N/A</span>
              </b>

              <div v-else class="mb-2 w-80">
                <select v-model="form.user" placeholder="Select User"
                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  <option :value="user.id" v-for="(user) in users" :key="user.id">{{ user.first_name }}
                    {{ user.last_name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="mb-2 sm:mb-4">
            <div class="text-blueGray-500">
              ETA:&nbsp;
              <b class="cursor-pointer" v-if="!isEditPanel.eta" @click="isEditPanel.eta = true">
                <span v-if="!task.eta_date">N/A</span>
                <span v-else>{{ convertDayDiff(task.eta_date) }} ({{ task.eta_date }})</span>
              </b>

              <div v-else class="mb-2 w-80">
                <input
                    v-model="form.eta_date"
                    type="date"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Eta"
                />
              </div>
            </div>

          </div>

          <div class="mb-2 sm:mb-4">
            <div class="text-blueGray-500">
              Tag:&nbsp;
              <b class="cursor-pointer" v-if="!isEditPanel.tag" @click="isEditPanel.tag = true">
                <span v-if="!task.tag">N/A</span>
                <span v-else>{{ task.tag }}</span>
              </b>

              <div v-else class="mb-2 w-80">
                <input
                    v-model="form.tag"
                    type="text"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Tag"
                />
              </div>
            </div>

          </div>

          <div class="mb-2 sm:mb-4">
            <div class="text-blueGray-500">
              Status:&nbsp;
              <b class="uppercase cursor-pointer" v-if="!isEditPanel.status"
                 @click="isEditPanel.status = true">{{ task.status || 'N/A' }}
              </b>
              <div v-else class="mb-2 w-80">
                <select v-model="form.status" placeholder="Select User"
                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  <option :value="item[0]" v-for="(item) in dictionary" :key="item[0]">{{ item[1] }}</option>
                </select>
              </div>
            </div>

          </div>

          <div class="mb-2 sm:mb-4">

            <div class="text-blueGray-500">
              Urgency Level:&nbsp;
              <b class="uppercase cursor-pointer" v-if="!isEditPanel.urgency_level"
                 @click="isEditPanel.urgency_level = true">{{ task.urgency_level || 'N/A' }}
              </b>
              <div v-else class="mb-2 w-80">
                <select v-model="form.urgency_level" placeholder="Select User"
                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  <option :value="item[0]" v-for="(item) in urgencyLevels" :key="item[0]">{{ item[1] }}</option>
                </select>
              </div>
            </div>

          </div>

          <div class="mb-2 sm:mb-4">

            <div class="text-blueGray-500">
              Position:&nbsp;
              <b class="uppercase cursor-pointer" v-if="!isEditPanel.position"
                 @click="isEditPanel.position = true">{{ task.position || 'N/A' }}
              </b>
              <div v-else class="mb-2 w-80">
                <input
                    v-model="form.position"
                    type="number"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Position"
                />
              </div>
            </div>

          </div>

          <div class="mb-2 sm:mb-4">
            <div class="text-blueGray-500 inline-flex items-center" v-if="!isEditPanel.progress">
              Progress:

              <div @click="isEditPanel.progress = true" class="cursor-pointer flex items-center">
                <div class=" w-[150px] h-[20px] border-2 border-blueGray-300 ml-3">
                  <span class="progress bg-blueGray-500 block h-[16px]"
                        :style="{width: `${task.progress || 0}%`}"></span>
                </div>
                <span class="ml-2">{{ task.progress || 0 }}%</span>
              </div>
            </div>
            <div v-else class="mb-2 w-80 range-slider">
              <input type="range" min="0" max="100" step="1" v-model="form.progress" @input="updateSlider"
                     :style="{backgroundSize: backgroundSize}">
              <div class="data text-blueGray-500">Progress: {{ form.progress }}/100</div>
            </div>
          </div>

          <div>
            <div class="text-blueGray-500 description-panel">
              Description:
              <b v-if="!task.description && !isEditPanel.description" class="cursor-pointer"
                 @click="isEditPanel.description = true">N/A</b>

              <div v-else>
                <div @click="isEditPanel.description = true" class="inline-flex">
                  <template v-if="!isEditPanel.description">
                    <v-md-preview-html
                        :html="xss.process(VMdEditor.vMdParser.themeConfig.markdownParser.render(task.description))"
                        preview-class="vuepress-markdown-body" class="cursor-pointer"></v-md-preview-html>
                  </template>

                  <div v-else class="w-[800px] mt-[10px]">
                    <v-md-editor v-model="form.description" height="300px"></v-md-editor>
                  </div>
                </div>
              </div>


            </div>

          </div>

          <div v-if="showPanel" class="flex gap-x-4">
            <button
                @click="updateTask"
                class="mt-2 bg-blueGray-800 text-white active:bg-blueGray-600 text-md font-bold px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Update
            </button>
            <button
                @click="resetData"
                class="mt-2 bg-blueGray-800 text-white active:bg-blueGray-600 text-md font-bold px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div class="mb-10" v-if="reminders?.length">
        <Reminders
            :paginate="paginate"
            :reminders="reminders"
            :loading="loadingRem"
            :users="users"
            @update="fetchReminders"
        />
      </div>

      <div class="mb-10">
        <AttachmentsDataTable :task-id="task.id" :is-task="true"/>
      </div>


      <div class="mb-10">
        <CommentsDataTable :task-id="task.id" :task-name="task.title" :is-task="true"/>
      </div>

      <div>
        <LogsDataTable :key="key" :task-id="task.id" :is-task="true"/>
      </div>

      <ProjectsModal
          :show-modal="showModal"
          :project-id="task.project?.id"
          :task-id="task.id"
          @close="showModal = false"
          @update="updateTaskShowData"
      />

      <UserTaskModal
          :show-modal="showUsersModal"
          :task="task"
          :users="usersList"
          :have-task-access="haveTaskAccess"
          :have-task-access-ids="haveTaskAccessIds"
          @close="showUsersModal = false"
          @update="updateTasks"
      />

      <UserQueueModal
          :show-modal="showUsersQueueModal"
          :task="task"
          :users="usersQueue"
          :have-task-access="haveQueueAccess"
          :have-task-access-ids="haveQueueAccessIds"
          @close="showUsersQueueModal = false"
          @update="updateTasksQueue"
      />

      <ReminderModal
          :show-modal="showReminderModal"
          :task="task"
          :users="usersQueue"
          @close="showReminderModal = false"
          @update="fetchReminders"
      />


      <ConfirmCloseModal
          :show-modal="confirmModal"
          @close="confirmModal = false"
          @update="closeTask"
      />
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {catchErrors} from "../../utils";
import {useRoute, useRouter} from "vue-router";
import {useTasksStore} from "../../store/tasks";
import Loader from "./../../components/Loader/Loader.vue"
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {convertDayDiff} from "../../utils";
import ProjectsModal from "../../components/Modals/ProjectsModal.vue";
import AttachmentsDataTable from "../../components/Table/AttachmentsDataTable.vue";
import CommentsDataTable from "../../components/Table/CommentsDataTable.vue";
import LogsDataTable from "../../components/Table/LogsDataTable.vue";
import {useToast} from "vue-toastification";
import {useUserStore} from "../../store/user";
import {useCookies} from "vue3-cookies";
import UserTaskModal from "../../components/Modals/UserTaskModal.vue";
import ConfirmCloseModal from "../../components/Modals/ConfirmCloseModal.vue";
import VMdEditor, {xss} from '@kangc/v-md-editor';
import {useProjectStore} from "../../store/project";
import UserQueueModal from "../../components/Modals/UserQueueModal.vue";
import {useUsersTasksStore} from "../../store/users-tasks";
import ReminderModal from "../../components/Modals/ReminderModal.vue";
import {usePaginate} from "../../composables/usePaginate";
import Reminders from '../../components/Reminders/Reminders.vue'
import config from "../../config";

// ValidationRules
const rules = {
  title: {required},
}

// toggleTask('close')
const defaultEditValues = {
  title: false,
  description: false,
  status: false,
  progress: false,
  eta: false,
  user: false,
  tag: false,
  urgency_level: false,
  position: false,
  owner: false,
}

// State
const taskStore = useTasksStore()
const projectStore = useProjectStore()
const userStore = useUserStore()
const usersTasksStore = useUsersTasksStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const {cookies} = useCookies();

const loading = ref(false)
const loadingRem = ref(false)
const showBtn = ref(false)
const showModal = ref(false)
const showReminderModal = ref(false)
const showUsersModal = ref(false)
const showUsersQueueModal = ref(false)
let confirmModal = ref(false)
const task = ref(null)
const currentTask = ref(null)
const hasAccess = ref(false)
const key = ref(0)
const timer = ref(null)
const backgroundSize = ref('0% 0%')
const reminders = ref([])
const users = ref([])
const usersList = ref([])
const usersQueue = ref([])
const dictionary = ref([])
const urgencyLevels = ref([])
const haveTaskAccess = ref([])
const haveTaskAccessIds = ref([])
const haveQueueAccess = ref([])
const haveQueueAccessIds = ref([])
const haveProjectAccessIds = ref([])
const haveProjectAccess = ref([])
const isEditPanel = ref({...defaultEditValues})
const form = ref({
  title: '',
  description: '',
  eta_date: '',
  status: '',
  user: '',
  owner: '',
  progress: '',
  tag: '',
  urgency_level: '',
  position: '',
})

const v$ = useVuelidate(rules, form)

// Computed
const isAuthQueue = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')
  return haveQueueAccessIds.value.includes(user.pk)
})

const isAuthOwner = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')
  const taskOwnerId = task.value.owner.id

  return user.pk === taskOwnerId
})


const showPanel = computed(() => {
  const arr = Object.values(isEditPanel.value)
  return arr.includes(true)
})


// Methods
const updateTaskShowData = () => {
  fetchTask()

  setTimeout(() => {
    fetchProjectAccess()
    fetchTaskAccess()
    fetchQueueAccess()
  }, 300)

  setTimeout(() => {
    fetchUsers()
  }, 700)
}
const updateTasks = () => {
  fetchTask()
  fetchTaskAccess()

  setTimeout(() => {
    fetchUsers()
  }, 700)
}

const updateTasksQueue = () => {
  fetchTask()
  fetchQueueAccess()

  setTimeout(() => {
    fetchUsers()
  }, 700)
}


const updateMyQueue = () => {
  if (isAuthQueue.value) return removeUser()

  assignUser()
}

const assignUser = async () => {
  try {
    const user = cookies.get('task_focus_user')
    const data = {
      task: task.value.id,
      user: user.pk
    }

    await usersTasksStore.assignUserToQueue(data)
    toast.success("Successfully assigned");
    updateTasksQueue()
  } catch (e) {
    catchErrors(e)
  }
}

const removeUser = async () => {
  try {
    const user = cookies.get('task_focus_user')

    const data = {
      task: task.value.id,
      user: user.pk
    }
    await usersTasksStore.removeUserFromQueue(data)
    toast.success("Successfully removed");
    updateTasksQueue()
  } catch (e) {
    catchErrors(e)
  }
}

const updateSlider = (e) => {
  let clickedElement = e.target,
      min = clickedElement.min,
      max = clickedElement.max,
      val = clickedElement.value;

  backgroundSize.value = (val - min) * 100 / (max - min) + '% 100%';
}
const toggleTask = async (type) => {
  try {
    if (type === 'stop') currentTask.value = null
    const resp = type === 'stop' ? await taskStore.stopTask({id: task.value.id}) : await taskStore.startTask({id: task.value.id})
    await toast.success(resp.data.message);
    await fetchCurrentTask()
  } catch (e) {
    catchErrors(e)
  }
}

const closeTask = async (notes) => {
  try {
    const data = {
      id: task.value.id,
      closing_message: notes
    }

    const resp = await taskStore.closeTask(data)
    confirmModal.value = false
    await toast.success(resp.data.message);
    if (task.value.project) {
      return await router.push(`/dashboard/project/${task.value.project.id}`)
    }
    await router.push(`/dashboard`)
  } catch (e) {
    catchErrors(e)
  }
}

const uncloseTask = async () => {
  try {
    const resp = await taskStore.unCloseTask({id: task.value.id})
    await toast.success(resp.data.message);
    await fetchTask()
  } catch (e) {
    catchErrors(e)
  }
}

const fetchTask = async () => {
  try {
    const id = route.params.id
    if (id) {
      loading.value = true
      const resp = await taskStore.fetchTaskById({id})
      task.value = {...resp.data}
      form.value = {...resp.data}

      if (!resp.data.eta_date) form.value.eta_date = new Date().toISOString().slice(0, 10)
      if (resp.data.responsible?.id) form.value.user = resp.data.responsible.id
      if (resp.data.responsible?.id) form.value.owner = resp.data.responsible.id
      backgroundSize.value = `${resp.data.progress || 0}% 100%`
    }

  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

const fetchDictionary = async () => {
  try {
    const resp = await taskStore.fetchDictionary()
    dictionary.value = resp.data.task_status_choices

    const arr = [null, 'NONE']
    urgencyLevels.value = [arr, ...resp.data.task_urgency_level_choices]
  } catch (e) {
    catchErrors(e)
  }
}

const fetchCurrentTask = async () => {
  try {
    const resp = await taskStore.fetchWorkingTask()
    if (resp.data && Object.keys(resp.data).length) {
      currentTask.value = resp.data
    }
  } catch (e) {
    catchErrors(e)
  }
}

const resetData = () => {
  isEditPanel.value = {...defaultEditValues}
  form.value = {...task.value}

  if (task.value.responsible?.id) form.value.user = task.value.responsible.id
  if (task.value.owner?.id) form.value.owner = task.value.responsible.id
  form.value.eta_date = new Date().toISOString().slice(0, 10)
  backgroundSize.value = `${task.value.progress || 0}% 100%`
}

const updateTask = async () => {
  try {
    const data = {
      id: task.value.id,
      title: form.value.title,
      description: form.value.description,
      eta_date: form.value.eta_date,
      status: form.value.status,
      responsible: form.value.user,
      owner: form.value.owner,
      progress: form.value.progress,
      tag: form.value.tag,
      urgency_level: form.value.urgency_level,
      position: form.value.position,
    }


    await taskStore.updateTask(data)
    await toast.success("Successfully task updated");
    isEditPanel.value = {...defaultEditValues}
    await fetchTask()
  } catch (e) {
    catchErrors(e)
  }
}

const fetchUsers = async () => {
  try {
    const resp = await userStore.fetchUsers()
    users.value = [
      {
        first_name: 'None',
        last_name: null,
        id: null,
        username: "None"
      }
    ]

    const arrIds = [...new Set([...haveTaskAccessIds.value, ...haveProjectAccessIds.value])];
    const tempArr = []
    resp.data.results.forEach((item) => {
      if (arrIds.includes(item.id) || item.id === task.value?.owner?.id) {
        tempArr.push(item)
      }
    })

    users.value = [...users.value, ...tempArr]
    usersQueue.value = tempArr

    if (task.value?.owner?.id !== task.value?.project?.owner?.id && task.value?.project?.owner?.id) {
      users.value.push(task.value?.project?.owner)
    }

    usersList.value = resp.data.results.filter((item) => item.id !== task.value?.owner?.id)
  } catch (e) {
    catchErrors(e)
  }
}

const fetchTaskAccess = async () => {
  try {
    const id = route.params.id
    if (id) {
      const resp = await taskStore.fetchTaskAccess({id})
      const user = cookies.get('task_focus_user')
      const list = []
      const ids = []
      resp.data.results.forEach((item) => {
        if (item.user.id !== user.pk) {
          list.push(item)
          ids.push(item.user.id)
        } else {
          hasAccess.value = true
        }
      })
      haveTaskAccess.value = list
      haveTaskAccessIds.value = ids
    }
  } catch (e) {
    catchErrors(e)
  }
}

const fetchProjectAccess = async () => {
  try {
    const projectId = task.value.project?.id
    if (projectId) {
      const resp = await projectStore.fetchProjectAccess({id: projectId})
      const user = cookies.get('task_focus_user')
      const list = []
      const ids = []
      resp.data.results.forEach((item) => {
        if (item.user.id !== user.pk) {
          list.push(item)
          ids.push(item.user.id)
        }
      })

      haveProjectAccess.value = list
      haveProjectAccessIds.value = ids
    }
  } catch (e) {
    catchErrors(e)
  }
}

const fetchQueueAccess = async () => {
  try {
    const id = route.params.id
    if (id) {
      const resp = await usersTasksStore.fetchUsersTasksQueue({id})
      const list = []
      const ids = []
      resp.data.users.forEach((item) => {
        list.push(item)
        ids.push(item.id)
      })
      haveQueueAccess.value = list
      haveQueueAccessIds.value = ids
    }
  } catch (e) {
    catchErrors(e)
  }
}

const fetchReminders = async () => {
  try {
    const id = route.params.id
    if (id) {
      loadingRem.value = true
      const options = {
        pagination: paginate.pagination.value,
        query: paginate.query.value,
        id
      }

      const resp = await taskStore.fetchReminders(options)
      reminders.value = resp.data.results
      paginate.updatePagination(resp)
    }
  } catch (e) {
    catchErrors(e)
  } finally {
    loadingRem.value = false
  }
}

onMounted(() => {
  timer.value = setInterval(() => {
    key.value += 1
  }, 15000)

  setTimeout(() => {
    fetchProjectAccess()
    fetchTaskAccess()
    fetchQueueAccess()
  }, 300)

  setTimeout(() => {
    showBtn.value = true

    fetchUsers()
  }, 700)
})


// Run Functions
const options = {
  pageSize: config.REMINDERS
}
const paginate = usePaginate(fetchReminders, options)

fetchTask()
fetchDictionary()
fetchCurrentTask()
fetchReminders()
</script>
