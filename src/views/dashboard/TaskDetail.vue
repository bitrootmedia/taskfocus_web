<template>
  <Loader v-if="loading"/>

  <div v-else class="flex flex-col sm:flex-row">
    <div class="left-side pt-6">
      <div>
        <div class="main-container pb-8">
          <div>
            <FormList
                :block-name="blockName"
                :key="keyList"
                :task-id="task.id"
                v-model="form.blocks"
                @edit="isEditPanel.blocks = true"
            />
          </div>

          <div class="mb-5" v-if="reminders?.length">
            <Reminders
                :show-links="true"
                :paginate="paginate"
                :reminders="reminders"
                :loading="loadingRem"
                :users="users"
                @update="fetchReminders"
            />
          </div>

          <div class="mb-10">
            <NotesDataTable :showCreateBtn="false" v-model:showBtnResult="writeNote" :task-id="task.id"/>
          </div>

          <div class="mb-10">
            <CommentsDataTable :showCreateBtn="false" v-model:showBtnResult="writeComment" :task-id="task.id" :task-name="task.title" :is-task="true"/>
          </div>

          <div class="mb-10">
            <AttachmentsDataTable :task-id="task.id" :is-task="true"/>
          </div>

          <div v-if="showTimeTracker">
            <TrackerDataTable :key="keyTracker" :task-id="task.id" :is-task="true" :can-edit="true"/>
          </div>

          <div v-if="showLogs">
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
              :users="usersQueue"
              :all-users="usersList"
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

          <ResponsiblesModal
              :show-modal="showResponsiblesModal"
              :task="task"
              :users="users"
              :btn-title="'Change Owners'"
              @close="showResponsiblesModal = false"
              @update-users="fetchUsers"
              @update="updateResponsibles"
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
    </div>

    <div class="right-side bg-white">
      <div class="right-side-content w-full bg-white py-6 px-[14px]">
        <div class="flex flex-col mb-3 border-b border-light-bg-c">
          <div class="cursor-pointer inline-flex font-semibold text-[22px] text-black-c" contenteditable="true" @input="saveData($event)">
            {{ task.title }}
          </div>

          <div class="flex gap-x-4 sm:gap-x-10 items-center flex-wrap pb-2" v-if="task?.project?.id">
            <div class="flex items-center gap-x-2">
              <span class="text-sm text-light-c whitespace-nowrap">In project:</span>
              <h2 class="text-md font-semibold text-black-c cursor-pointer lg:whitespace-nowrap"
                  @click="router.push(`/dashboard/project/${task.project.id}`)">
                {{ task.project?.title }}</h2>
            </div>
          </div>

          <div class="flex sm:items-center flex-wrap flex-col sm:flex-row pb-3" :class="{'border-light-bg-c border-t pt-3': task?.project?.id}">
            <h3 class="text-[34px] text-black-c pb-3 w-full text-center" v-if="currentTaskTotalTime">
              {{ currentTaskTotalTime?.hours || '00' }}hs {{ currentTaskTotalTime?.minutes || "00" }}m
            </h3>

              <Button
                  v-if="isAuthOwner && task.is_closed"
                  class="w-full justify-center mb-2"
                  @on-click="uncloseTask"
                  label="Reopen Task"
                  size="medium"
                  version="green"
              />

              <Button
                  v-else-if="isAuthOwner"
                  class="w-full justify-center mb-2"
                  @on-click="confirmModal = true"
                  label="Close Task"
                  size="medium"
                  version="green"
              />

            <Button
                class="w-full justify-center mb-2"
                v-if="!task?.is_closed"
                @on-click="toggleTask(currentTask?.id === task?.id ? 'stop' : 'work')"
                :disabled="btnLoad"
                :label="currentTask?.id === task?.id ? 'Stop working on this task' : 'Work on this task'"
                version="yellow"
                size="medium"
            />

            <Button
                class="w-full justify-center"
                @on-click="showTimeTracker = !showTimeTracker"
                :label="showTimeTracker ? 'Hide time tracking' : 'Show time tracking'"
                version="yellow"
                size="medium"
            />

            <Button
                class="w-full justify-center mt-2"
                @on-click="showLogs = !showLogs"
                :label="showLogs ? 'Hide logs' : 'Show logs'"
                version="yellow"
                size="medium"
            />

            <div class="mt-2">
              <div class="inline-flex items-center" v-if="!isEditPanel.progress">
                <span class="inline-block text-light-c text-sm mr-2">Progress:</span>

                <div class="cursor-pointer flex items-center">
                  <div class="w-[180px] sm:w-[120px] h-2 bg-blueGray-200 rounded-md">
                        <span class="progress block h-2 rounded-md flex items-center justify-center"
                              :style="{width: `${task.progress || 0}%`, background: `${bgConvert(task.progress)}`}">
                        </span>
                  </div>
                </div>

                <PencilSmallIcon class="cursor-pointer ml-1" @click="isEditPanel.progress = true"/>
              </div>
              <div v-else class="w-[250px] range-slider">
                <input type="range" min="0" max="100" step="1" v-model="form.progress" @input="updateSlider"
                       :style="{backgroundSize: backgroundSize}">
                <div class="data text-light-c text-sm">Progress: {{ form.progress }}/100</div>
              </div>
            </div>

            <div class="flex items-center gap-x-1 mt-2">
              <span class="text-sm text-light-c">Responsible:</span>
              <div class="flex items-center gap-x-1">
                        <span v-if="task.responsible?.first_name || task.responsible?.last_name"
                              class="text-sm text-black-c font-semibold"> {{
                            task.responsible?.first_name
                          }} {{ task.responsible?.last_name }}
                        </span>
                <span v-else-if="task.responsible?.username"
                      class="text-sm text-black-c font-semibold"> {{ task.responsible?.username }}</span>
                <span v-else class="text-sm text-black-c font-semibold">N/A</span>

                <PencilSmallIcon class="cursor-pointer" @click="showResponsiblesModal = true"/>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row lg:gap-x-20">
          <div class="w-full">
            <div class="flex flex-col sm:flex-row sm:items-center flex-wrap gap-y-2 gap-x-12 mb-2">
              <div class="flex items-center gap-x-1">
                <span class="inline-block text-sm text-light-c">Tag:</span>
                <div class="flex items-center gap-x-1" v-if="!isEditPanel.tag">
                  <span v-if="!task.tag" class="text-sm text-black-c font-semibold">N/A</span>
                  <span v-else class="text-sm text-black-c font-semibold">{{ task.tag }}</span>
                  <PencilSmallIcon class="cursor-pointer" @click="isEditPanel.tag = true"/>
                </div>

                <input
                    v-else
                    v-model="form.tag"
                    type="text"
                    class="px-3 py-[5px] w-full sm:w-[150px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring ease-linear transition-all duration-150"
                    placeholder="Tag"
                />
              </div>

              <div class="flex items-center gap-x-1">
                <span class="inline-block text-sm text-light-c">Status:</span>
                <div v-if="!isEditPanel.status"
                     class="uppercase text-sm text-black-c font-semibold flex items-center gap-x-1">
                  <span>{{ task.status || 'N/A' }}</span>
                  <PencilSmallIcon class="cursor-pointer" @click="isEditPanel.status = true"/>
                </div>
                <select v-else v-model="form.status" placeholder="Select User"
                        class="pl-3 pr-8 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  <option :value="item[0]" v-for="(item) in dictionary" :key="item[0]">{{ item[1] }}</option>
                </select>
              </div>

              <div class="flex items-center gap-x-1">
                <span class="inline-block text-sm text-light-c">Position:</span>
                <div v-if="!isEditPanel.position"
                     class="uppercase cursor-pointer text-sm text-black-c font-semibold flex items-center gap-x-1">
                  <span>{{ task.position || 'N/A' }}</span>
                  <PencilSmallIcon class="cursor-pointer" @click="isEditPanel.position = true"/>
                </div>
                <input
                    v-else
                    v-model="form.position"
                    type="number"
                    class="px-3 py-[5px] w-full sm:w-[150px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring ease-linear transition-all duration-150"
                    placeholder="Position"
                />
              </div>

              <div class="flex items-center gap-x-1">
                <span class="inline-block text-sm text-light-c">Urgent:</span>

                <Switch v-model:value="form.is_urgent"/>
              </div>

              <div class="flex gap-x-1 flex-wrap">
                  <span class="text-sm text-light-c whitespace-nowrap">Task Access:</span>

                  <ul class="flex gap-x-2 flex-wrap">
                    <li class="text-sm text-black-c font-semibold">
                      {{ task.owner?.first_name }} {{
                        task.owner?.last_name
                      }}(owner){{ haveTaskAccess.length || haveProjectAccess.length ? ',' : '' }}
                    </li>

                    <li v-if="haveProjectAccess.length" v-for="(item,index) in haveProjectAccess" :key="item.user.id"
                        class="text-sm text-black-c font-semibold">
                      {{ item.user.first_name }} {{ item.user.last_name }}<span
                        class="text-sm text-black-c font-semibold">(project)</span><span
                        v-if="haveTaskAccessIds.length || index !== haveProjectAccess.length - 1">,</span>
                    </li>

                    <li v-if="haveTaskAccess.length" v-for="(item,index) in haveTaskAccess" :key="item.user.id"
                        class="text-sm text-black-c font-semibold">
                      {{ item.user.first_name }} {{ item.user.last_name }}<span
                        class="text-sm text-black-c font-semibold">(task)</span><span
                        v-if="index !== haveTaskAccess.length - 1">,</span>
                    </li>
                  </ul>
                </div>
            </div>

            <div class="text-blueGray-500 description-panel mt-2" v-if="task.description">
              Description:
              <b v-if="!task.description && !isEditPanel.description" class="cursor-pointer"
                 @click="isEditPanel.description = true">N/A</b>

              <div v-else>
                <div @click="isEditPanel.description = true"
                     :class="[`${!isEditPanel.description ? 'inline-flex' : 'flex w-full'}`]">
                  <template v-if="!isEditPanel.description" class="w-full">
                    <v-md-preview :text="task.description" class="cursor-pointer"></v-md-preview>
                  </template>

                  <div v-else class="w-full mt-[10px]">
                    <v-md-editor v-model="form.description" height="350px" :disabled-menus="[]"
                                 @upload-image="handleUploadImage"></v-md-editor>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div
            class="actions mb-3 flex justify-between flex-col sm:flex-row gap-x-6 bg-white">

          <div class="flex flex-wrap gap-1">
            <Button
                class="w-full justify-center"
                v-if="isAuthOwner || isAuthProjectOwner"
                @on-click="showOwnersModal = true"
                label="Change Owner"
                size="medium"
                version="gray"
                rounded
            />
            <Button
                class="w-full justify-center"
                v-if="isAuthOwner"
                @on-click="showModal = true"
                label="Change Project"
                size="medium"
                version="gray"
                rounded
            />
            <Button
                class="w-full justify-center"
                v-if="isAuthOwner"
                @on-click="showUsersModal = true"
                label="Manage Task Users"
                size="medium"
                version="gray"
                rounded
            />
            <Button
                class="w-full justify-center"
                v-if="isAuthOwner"
                @on-click="showUsersQueueModal = true"
                label="Queue"
                size="medium"
                version="gray"
                rounded
            />
            <Button
                class="w-full justify-center"
                v-if="showBtn"
                @on-click="updateMyQueue"
                :label="!isAuthQueue ? 'Add to my queue' : 'Remove from my queue'"
                size="medium"
                :disabled="btnLoad"
                version="gray"
                rounded
            />
            <Button
                class="w-full justify-center"
                @on-click="showReminderModal = true"
                label="Add Reminder"
                size="medium"
                version="gray"
                rounded
            />
            <Button
                class="w-full justify-center"
                @on-click="generateTag"
                :disabled="btnLoad"
                label="Tag ID Generator"
                size="medium"
                version="gray"
                rounded
            />
          </div>
        </div>

        <div class="flex align-center mt-4 flex-wrap">
          <div class="flex gap-x-4 gap-y-2 flex align-center flex-wrap">
            <div
                class="w-full border border-light-bg-c bg-white rounded-[6px] px-3 py-2 h-8 flex items-center gap-x-2 cursor-pointer"
                @click="addNewForm('markdown')">
              <MarkdownIcon/>
              <span class="tooltip-text text-[13px] font-semibold text-black-c">Create markdown</span>
            </div>

            <div
                class="w-full border border-light-bg-c bg-white rounded-[6px] px-3 py-2 h-8 flex items-center gap-x-2 cursor-pointer"
                @click="addNewForm('checklist')">
              <ChecklistIcon/>
              <span class="tooltip-text text-[13px] font-semibold text-black-c">Create checklist</span>
            </div>

            <div
                class="w-full border border-light-bg-c bg-white rounded-[6px] px-3 py-2 h-8 flex items-center gap-x-2 cursor-pointer"
                @click="addNewForm('image')">
              <ImageIcon/>
              <span class="tooltip-text text-[13px] font-semibold text-black-c">Add image</span>
            </div>

            <div
                class="w-full border border-light-bg-c bg-white rounded-[6px] px-3 py-2 h-8 flex items-center gap-x-2 cursor-pointer"
                 @click="writeComment = true">

              <PlusIcon />
              <span class="tooltip-text text-[13px] font-semibold text-black-c">Add comment</span>
            </div>
            <div
                class="w-full border border-light-bg-c bg-white rounded-[6px] px-3 py-2 h-8 flex items-center gap-x-2 cursor-pointer"
                @click="writeNote = true">

              <NotesIcon />
              <span class="tooltip-text text-[13px] font-semibold text-black-c">Add private note</span>
            </div>
          </div>
        </div>
      </div>
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
import ProjectsModal from "../../components/Modals/ProjectsModal.vue";
import AttachmentsDataTable from "../../components/Table/AttachmentsDataTable.vue";
import CommentsDataTable from "../../components/Table/CommentsDataTable.vue";
import LogsDataTable from "../../components/Table/LogsDataTable.vue";
import {useToast} from "vue-toastification";
import {useUserStore} from "../../store/user";
import {useCookies} from "vue3-cookies";
import UserTaskModal from "../../components/Modals/UserTaskModal.vue";
import VMdEditor from '@kangc/v-md-editor';
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
import ResponsiblesModal from './../../components/Modals/ResponsiblesModal.vue'
import FormList from './../../components/FormList/FormList.vue'
import NotesDataTable from "../../components/Table/NotesDataTable.vue"
import Button from "../../components/Button/Button.vue";
import PencilSmallIcon from "../../components/Svg/PencilSmallIcon.vue";
import MarkdownIcon from "../../components/Svg/MarkdownIcon.vue";
import ImageIcon from "../../components/Svg/ImageIcon.vue";
import ChecklistIcon from "../../components/Svg/ChecklistIcon.vue";
import PlusIcon from "../../components/Svg/PlusIcon.vue"
import NotesIcon from "../../components/Svg/NotesIcon.vue"
import CloseIcon from "../../components/Svg/CloseIcon.vue"
import ConfirmCloseModal from './../../components/Modals/ConfirmCloseModal.vue'

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
  blocks: false
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

const keyList = ref(0)
const btnLoad = ref(false)
const loading = ref(false)
const loadingRem = ref(false)
const showBtn = ref(false)
const showModal = ref(false)
let showReminderModal = ref(false)
let showUsersModal = ref(false)
let showUsersQueueModal = ref(false)
let showResponsiblesModal = ref(false)
let showOwnersModal = ref(false)
let toggleActive = ref(false)
let firstLoad = ref(false)
const blockName = ref('')
const task = ref(null)
const currentTaskTotalTime = ref(null)
const currentTask = ref(null)
const key = ref(0)
const keyTracker = ref(0)
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
  blocks: [],
})
const writeComment = ref(false)
const writeNote = ref(false)
const showLogs = ref(false)
const showTimeTracker = ref(false)
let confirmModal = ref(false)

const v$ = useVuelidate(rules, form)

// Computed
const isAuthQueue = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')
  return haveQueueAccessIds.value.includes(user.pk)
})

const isAuthProjectOwner = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  if (!task.value.project) return false

  const user = cookies.get('task_focus_user')
  const projectOwnerId = task.value.project.owner.id

  return user.pk === projectOwnerId
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

watch(() => form.value.is_urgent, (newValue, oldValue) => {
  if (firstLoad.value) return updateTask(true)

  firstLoad.value = true
})

// Methods
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

const addNewForm = (name) => {
  blockName.value = name
}

const bgConvert = (progress) => {
  return '#349C91'

  // if (progress < 25) return '#349C91'
  // if (progress < 50) return '#349C91'
  // if (progress < 75) return '#349C91'
  // if (progress >= 75) return '#349C91'
}

const generateTag = () => {
  const tag = Math.random().toString(36).slice(2, 7).toUpperCase();
  navigator.clipboard.writeText(tag)

  toast.success("New tag id generated and copied");
}


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
    btnLoad.value = true
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
  } finally {
    btnLoad.value = false
  }
}

const updateResponsibles = (userId) => {
  form.value.user = userId
  updateTask(true)
}

const removeUser = async () => {
  try {
    btnLoad.value = true
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
  } finally {
    btnLoad.value = false
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
    btnLoad.value = true
    if (type === 'stop') currentTask.value = null
    const resp = type === 'stop' ? await taskStore.stopTask({id: task.value.id}) : await taskStore.startTask({id: task.value.id})

    const message = type !== 'stop' ? `Started working on task ${task.value.title}` : `Stopped working on task ${task.value.title}`
    await toast.success(message);
    await fetchCurrentTask()
    keyTracker.value += 1
  } catch (e) {
    catchErrors(e)
  } finally {
    btnLoad.value = false
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

      await fetchTaskTotalTime()
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

  fetchTask()
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
      blocks: form.value.blocks,
    }

    await taskStore.updateTask(data)
    await toast.success("Task updated");
    keyList.value += 1
    isEditPanel.value = {...defaultEditValues}
    await hidePanel()
    await fetchTask(noLoad)
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
        // if (item.user.id !== user.pk) {
        list.push(item)
        ids.push(item.user.id)
        // }
      })

      haveProjectAccess.value = list
      haveProjectAccessIds.value = ids

      await fetchProject()
    }
  } catch (e) {
    catchErrors(e)
  }
}

const uncloseTask = async () => {
  try {
    const resp = await taskStore.unCloseTask({id: task.value.id})
    await taskStore.fetchTaskById({id: task.value.id})
    await toast.success(resp.data.message);
    await fetchTask()
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

const fetchTaskTotalTime = async () => {
  try {
    const resp = await taskStore.fetchTaskTime({id: task.value.id})
    currentTaskTotalTime.value = resp.data.total_time
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

const saveData = async(e)=>{
  await updateTaskTitle(e.target.innerHTML)
}

const updateTaskTitle = async (title) => {
  try {
    const data = {
      id: task.value.id,
      title: title,
    }

    await taskStore.updateTask(data)
    await toast.success("Task title updated");
  } catch (e) {
    catchErrors(e)
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
  }, 600)

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

<style scoped>
.left-side{
  width: calc(100% - 252px);
}
.right-side{
  width: 252px;
}

.right-side > div{
  position: sticky;
  top: 91px;
}
@media (max-width: 767px) {
  .right-side > div{
    top: 75px;
    z-index: 1;
  }
}

@media (max-width: 600px) {
  .right-side{
    order: 1;
    width: 100%;
  }
  .right-side > div{
    position: static;
  }
  .left-side{
    width: 100%;
    order: 2
  }
}

.right-side-content{
  height: calc(100vh - 91px);
  overflow-y: scroll;
}
</style>
