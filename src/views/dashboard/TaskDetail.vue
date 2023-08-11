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

            <div class="flex items-center gap-x-2" v-if="task?.project?.id">
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
                :class="[currentTask?.id === task?.id ? 'bg-orange-400' : 'bg-blueGray-800']"
                class="mt-2  whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              {{ currentTask?.id === task?.id ? 'Stop working on this task' : 'Work on this task' }}
            </button>

            <button
                v-if="isAuthOwner && task.is_closed"
                @click="uncloseTask"
                class="mt-2 bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Unclose task
            </button>

            <button
                v-else-if="isAuthOwner"
                @click="confirmModal = true"
                class="mt-2 bg-orange-400 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Close task
            </button>

            <button
                v-if="isAuthOwner || isAuthProjectOwner"
                @click="showOwnersModal = true"
                class="mt-2 bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >Change Owner
            </button>

            <button
                v-if="isAuthOwner"
                @click="showModal = true"
                class="mt-2 bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >Change project
            </button>

            <button
                v-if="isAuthOwner"
                @click="showUsersModal = true"
                class="mt-2 bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >Manage Task Users
            </button>

            <button
                v-if="isAuthOwner"
                @click="showUsersQueueModal = true"
                class="mt-2 bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >Queue
            </button>

            <button
                v-if="showBtn"
                @click="updateMyQueue"
                :class="[isAuthQueue ? 'bg-orange-400' : 'bg-blueGray-800']"
                class="mt-2 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              {{ !isAuthQueue ? 'Add to my queue' : 'Remove from my queue' }}
            </button>

            <button
                @click="showReminderModal = true"
                class="mt-2 bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >Add Reminder
            </button>
          </div>

          <div class="mb-5" v-if="reminders?.length">
            <Reminders
                :paginate="paginate"
                :reminders="reminders"
                :loading="loadingRem"
                :users="users"
                @update="fetchReminders"
            />
          </div>

          <div class="flex flex-col lg:flex-row lg:gap-x-20">
            <div class="lg:w-1/2 order-1 lg:order-1">
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

              <div class="text-blueGray-500 description-panel">
                Description:
                <b v-if="!task.description && !isEditPanel.description" class="cursor-pointer"
                   @click="isEditPanel.description = true">N/A</b>

                <div v-else>
                  <div @click="isEditPanel.description = true"
                       :class="[`${!isEditPanel.description ? 'inline-flex' : 'flex w-full'}`]">
                    <template v-if="!isEditPanel.description" class="w-full">
                      <v-md-preview-html
                          :html="xss.process(VMdEditor.vMdParser.themeConfig.markdownParser.render(task.description))"
                          preview-class="vuepress-markdown-body" class="cursor-pointer"></v-md-preview-html>
                    </template>

                    <div v-else class="w-full mt-[10px]">
                      <v-md-editor v-model="form.description" height="300px" :disabled-menus="[]"
                                   @upload-image="handleUploadImage"></v-md-editor>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            <div class="lg:w-1/2 order-2 lg:order-2 mt-3 lg:mt-0">
              <div class="mb-2 sm:mb-4">
                <div class="text-blueGray-500">
                  <span class="w-[80px] inline-block">Tag:</span>
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
                  <span class="w-[80px] inline-block">Est Hours:</span>
                  <b class="cursor-pointer" v-if="!isEditPanel.estimated_work_hours"
                     @click="isEditPanel.estimated_work_hours = true">
                    <span v-if="!task.estimated_work_hours">N/A</span>
                    <span v-else>{{ task.estimated_work_hours }}</span>
                  </b>

                  <div v-else class="mb-2 w-80">
                    <input
                        v-model="form.estimated_work_hours"
                        type="number"
                        patern="[0-9]"
                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Est Hours"
                    />
                  </div>
                </div>
              </div>

              <div class="mb-2 sm:mb-4">
                <div class="text-blueGray-500">
                  <span class="w-[80px] inline-block">Status:</span>
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


                <div class="text-blueGray-500 flex items-center">
                  <span class="w-[80px] inline-block">Urgent:</span>

                  <Switch v-model:value="form.is_urgent"/>
                </div>

              </div>

              <div class="mb-2 sm:mb-4">

                <div class="text-blueGray-500">
                  <span class="w-[80px] inline-block">Position:</span>
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
                  <span class="w-[80px] inline-block">Progress:</span>

                  <div @click="isEditPanel.progress = true" class="cursor-pointer flex items-center">
                    <div class=" w-[150px] h-[20px] border-2 border-blueGray-300">
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
            </div>
          </div>
        </div>
      </div>

      <div class="mb-10">
        <AttachmentsDataTable :task-id="task.id" :is-task="true"/>
      </div>

      <div class="mb-10">
        <CommentsDataTable :task-id="task.id" :task-name="task.title" :is-task="true"/>
      </div>

      <div>
        <TrackerDataTable :key="key" :task-id="task.id" :is-task="true"/>
      </div>

      <div>
        <LogsDataTable :key="key" :task-id="task.id" :is-task="true"/>
      </div>

      <ProjectsModal
          :show-modal="showModal"
          :project-id="task?.project?.id"
          :task-id="task.id"
          :btn-title="'Change project'"
          @close="showModal = false"
          @update="updateTaskShowData"
      />

      <UserTaskModal
          :show-modal="showUsersModal"
          :task="task"
          :users="usersList"
          :have-task-access="haveTaskAccess"
          :have-task-access-ids="haveTaskAccessIds"
          :btn-title="'Manage Task Users'"
          @close="showUsersModal = false"
          @update="updateTasks"
      />

      <OwnersModal
          :show-modal="showOwnersModal"
          :task="task"
          :users="usersList"
          :have-task-access="haveTaskAccess"
          :have-task-access-ids="haveTaskAccessIds"
          :btn-title="'Change Owners'"
          @close="showOwnersModal = false"
          @update="updateTaskOwner"
      />


      <UserQueueModal
          :show-modal="showUsersQueueModal"
          :task="task"
          :users="usersQueue"
          :have-task-access="haveQueueAccess"
          :have-task-access-ids="haveQueueAccessIds"
          :btn-title="'Queue'"
          @close="showUsersQueueModal = false"
          @update="updateTasksQueue"
      />

      <ReminderModal
          :show-modal="showReminderModal"
          :task="task"
          :users="usersQueue"
          :btn-title="'Add Reminder'"
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
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {catchErrors} from "../../utils";
import {useRoute, useRouter} from "vue-router";
import {useTasksStore} from "../../store/tasks";
import Loader from "./../../components/Loader/Loader.vue"
import {required, helpers} from "@vuelidate/validators";
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
import OwnersModal from "../../components/Modals/OwnersModal.vue";
import {useAttachmentsStore} from "../../store/attachments";
import TrackerDataTable from "../../components/Table/TrackerDataTable.vue";
import moment from "moment";
import Switch from '../../components/Switch/Switch.vue'

// ValidationRules
const rules = {
  title: {required},
  estimated_work_hours: {
    asyncValidator: (val) => {
      helpers.withParams(
          {type: 'maxDecimals', max: length},
          value =>
              !helpers.req(value) ||
              new RegExp(
                  `^\\s*-?(\\d+(\\.\\d{1,${1}})?|\\.\\d{1,${1}})\\s*$`
              ).test(val)
      )
    }
  }
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
  is_urgent: false,
  position: false,
  owner: false,
  estimated_work_hours: false,
}

// State
const taskStore = useTasksStore()
const projectStore = useProjectStore()
const userStore = useUserStore()
const attachmentStore = useAttachmentsStore()
const usersTasksStore = useUsersTasksStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const {cookies} = useCookies();

const loading = ref(false)
const loadingRem = ref(false)
const showBtn = ref(false)
const showModal = ref(false)
let showReminderModal = ref(false)
let showUsersModal = ref(false)
let showUsersQueueModal = ref(false)
let showOwnersModal = ref(false)
let confirmModal = ref(false)
let toggleActive = ref(false)
let firstLoad = ref(false)
const task = ref(null)
const currentTask = ref(null)
const key = ref(0)
const timer = ref(null)
const backgroundSize = ref('0% 0%')
const reminders = ref([])
const users = ref([])
const usersList = ref([])
const usersQueue = ref([])
const dictionary = ref([])
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
  estimated_work_hours: '',
  status: '',
  user: '',
  owner: '',
  progress: '',
  tag: '',
  is_urgent: '',
  position: '',
})

const v$ = useVuelidate(rules, form)

// Computed
const isAuthQueue = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')
  return haveQueueAccessIds.value.includes(user.pk)
})

const isAuthProjectOwner = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')
  return haveProjectAccessIds.value.includes(user.pk)
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

//Watch



watch(showPanel, (val) => {
  if (val) {
    const obj = {
      show: true,
      close: resetData,
      update: updateTask,
    }
    userStore.setShowPanel(obj)
  }
})


// Methods
const handleUploadImage = async (event, insertImage, files) => {
  try {
    const file = files[0]
    const formData = new FormData();
    formData.append(file.name, file);

    if (task.value.project.id) {
      formData.append('project_id', task.value.project.id);
    }
    if (task.value.id) {
      formData.append('task_id', task.value.id);
    }

    const resp = await attachmentStore.uploadAttachments(formData)
    if (resp.data.attachments[0].file_path) {
      insertImage({
        url: resp.data.attachments[0].file_path,
      });
    }
  } catch (e) {
    catchErrors(e)
  }
}

const updateTaskShowData = () => {
  fetchTask(true)

  setTimeout(() => {
    fetchProjectAccess()
    fetchTaskAccess()
    fetchQueueAccess()
  }, 500)

  setTimeout(() => {
    fetchUsers()
  }, 700)
}
const updateTasks = (owner) => {
  fetchTask(true)
  fetchTaskAccess()

  setTimeout(() => {
    fetchUsers()
  }, 700)
}

const updateTasksQueue = () => {
  fetchTask(true)
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
    toast.success("Queue updated");
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
    toast.success("Queue updated");
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

    const message = type !== 'stop' ? `Started working on task ${task.value.title}` : `Stopped working on task ${task.value.title}`
    await toast.success(message);
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
    if (task.value.project?.id) {
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

const fetchTask = async (noLoad = false) => {
  try {
    const id = route.params.id
    if (id) {
      if (!noLoad) loading.value = true
      const resp = await taskStore.fetchTaskById({id})
      task.value = {...resp.data}

      Object.keys(resp.data).forEach((key) => {
        form.value[key] = resp.data[key]
      })

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

const fetchProject = async () => {
  const project = task.value?.project
  if (!project) return

  if (!haveProjectAccessIds.value.includes(project.owner.id)) {
    const obj = {
      project: project.id,
      user: project.owner
    }

    haveProjectAccessIds.value.push(project.owner.id)
    haveProjectAccess.value.push(obj)
  }
}

const fetchDictionary = async () => {
  try {
    const resp = await taskStore.fetchDictionary()
    dictionary.value = resp.data.task_status_choices
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
  hidePanel()

  isEditPanel.value = {...defaultEditValues}
  form.value = {...task.value}

  if (task.value.responsible?.id) form.value.user = task.value.responsible.id
  if (task.value.owner?.id) form.value.owner = task.value.responsible.id

  backgroundSize.value = `${task.value.progress || 0}% 100%`
}

const hidePanel = () => {
  const obj = {
    show: false,
    close: null,
    update: null,
  }
  userStore.setShowPanel(obj)
}

const updateTaskOwner = async (owner) => {
  try {
    const data = {
      id: task.value.id,
      owner
    }

    await taskStore.updateTaskOwner(data)
    await toast.success("Successfully owner updated");
    await updateTaskShowData()
  } catch (e) {
    catchErrors(e)
  }
}

const updateTask = async (noLoad) => {
  if (!task.value.id) return

  try {
    const data = {
      id: task.value.id,
      title: form.value.title,
      description: form.value.description,
      estimated_work_hours: form.value.estimated_work_hours,
      status: form.value.status,
      responsible: form.value.user,
      owner: form.value.owner,
      progress: form.value.progress,
      tag: form.value.tag,
      is_urgent: form.value.is_urgent,
      position: form.value.position,
    }

    await taskStore.updateTask(data)
    await toast.success("Task updated");
    isEditPanel.value = {...defaultEditValues}
    await hidePanel()
    await fetchTask(noLoad)
  } catch (e) {
    catchErrors(e)
  }
}

watch(() => form.value.is_urgent, (newValue,oldValue) => {
  if (firstLoad.value) return updateTask(true)

  firstLoad.value = true
})

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

    // if (task.value?.owner?.id !== task.value?.project?.owner?.id && task.value?.project?.owner?.id) {
    //   users.value.push(task.value?.project?.owner)
    // }

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
        list.push(item)
        ids.push(item.user.id)
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
    const projectId = task.value?.project?.id
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

      await fetchProject()
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

      if (!resp.data.results.length) return taskStore.expiredRemindersCount = false
      resp.data.results.forEach((reminder) => {
        if (reminderCheck(reminder.reminder_date) === 'today') {
          return taskStore.expiredRemindersCount = true
        }

        return taskStore.expiredRemindersCount = false
      })
    }
  } catch (e) {
    catchErrors(e)
  } finally {
    loadingRem.value = false
  }
}

const reminderCheck = (date) => {
  const isToday = moment(0, "HH").diff(date, "days") >= 0
  const isTmr = moment(0, "HH").diff(date, "days") === -1

  if (isToday) return 'today'
  if (isTmr) return 'tmr'

  return ''
}

const routeLeave = (e) => {
  e.preventDefault();

  if (userStore.showPanel.show) return (e.returnValue = "");
}

onMounted(() => {
  window.addEventListener('beforeunload', routeLeave)

  timer.value = setInterval(() => {
    key.value += 1
  }, 15000)

  setTimeout(() => {
    fetchProjectAccess()
    fetchTaskAccess()
    fetchQueueAccess()
  }, 500)

  setTimeout(() => {
    showBtn.value = true

    fetchUsers()
  }, 700)
})


onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', routeLeave)
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
