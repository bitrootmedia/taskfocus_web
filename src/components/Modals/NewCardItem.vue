<template>
  <div v-if="showModal"
       class="cursor-default overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative my-6 mx-auto w-[390px]">
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <div class="py-3">
          <div class="flex items-center justify-between rounded-t p-3 border-b border-light-bg-c">
            <h2 class="text-[22px] text-black-c font-semibold">{{ isEdit ? "Edit" : 'Create New' }} Card Item</h2>
            <CloseBlackIcon class="cursor-pointer" @click="emit('close')"/>
          </div>
        </div>

        <div class="relative p-4 flex-auto">
          <div class="relative w-full">
            <div v-if="step === 0" class="flex items-center gap-4">
              <Button
                  v-if="!isEdit"
                  @on-click="step = 1"
                  :label="'Task'"
                  version="gray"
                  size="medium"
              />
              <Button
                  v-if="!isEdit"
                  @on-click="step = 2"
                  :label="'Project'"
                  version="gray"
                  size="medium"
              />
              <Button
                  @on-click="step = 3"
                  :label="'Text'"
                  version="gray"
                  size="medium"
              />

              <Button
                  @on-click="step = 4"
                  :label="'Board'"
                  version="gray"
                  size="medium"
              />
            </div>

            <div v-if="step === 1">
              <div class="w-full">
                <span class="text-black-c font-semibold text-sm mb-1 block">Search tasks</span>

                <div class="relative w-full">
                  <SearchIcon class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-1 left-2"/>
                  <input
                      v-model="form.taskSearch"
                      type="text"
                      class="w-full pl-9 pr-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring ease-linear transition-all duration-150"
                      placeholder="Search..."
                      @input="searchTask"
                  />
                </div>
              </div>

              <ul class="mt-3 notifications-wrapper max-h-[320px] overflow-y-auto pr-2">
                <li v-for="task in tasks" :key="task.id" class="flex justify-between items-center gap-x-1 mb-2">
                  <span class="text-[13px] text-light-c font-medium">{{ task.title }}</span>
                  <Button
                      @on-click="assignItem(task,'task')"
                      :label="'Assign'"
                      :version="'green-small'"
                      size="small"
                  />
                </li>
              </ul>
            </div>

            <div v-if="step === 2">
              <div class="w-full">
                <span class="text-black-c font-semibold text-sm mb-1 block">Search projects</span>

                <div class="relative w-full">
                  <SearchIcon class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-1 left-2"/>
                  <input
                      v-model="form.projectSearch"
                      type="text"
                      class="w-full pl-9 pr-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring ease-linear transition-all duration-150"
                      placeholder="Search..."
                      @input="searchProject"
                  />
                </div>
              </div>

              <ul class="mt-3 max-h-[320px] overflow-y-auto">
                <li v-for="project in projects" :key="project.id"
                    class="flex justify-between items-center gap-x-1 mb-2">
                  <span class="text-[13px] text-light-c font-medium">{{ project.title }}</span>
                  <Button
                      @on-click="assignItem(project,'project')"
                      :label="'Assign'"
                      :version="'green-small'"
                      size="small"
                  />
                </li>
              </ul>
            </div>

            <div v-if="step === 3">
              <form @submit="createNewCardItem($event)">
                <textarea
                    class="min-h-[150px] w-full px-2 py-2 inline-flex text-black-c outline-0 mb-2 border border-light-bg-c"
                    v-model="form.comment"></textarea>
              </form>
            </div>

            <div v-if="step === 4">
              <div class="w-full">
                <span class="text-black-c font-semibold text-sm mb-1 block">Search boards</span>

                <div class="relative w-full">
                  <SearchIcon class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-1 left-2"/>
                  <input
                      v-model="form.boardSearch"
                      type="text"
                      class="w-full pl-9 pr-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring ease-linear transition-all duration-150"
                      placeholder="Search..."
                      @input="searchBoard"
                  />
                </div>
              </div>

              <ul class="mt-3 notifications-wrapper max-h-[320px] overflow-y-auto pr-2">
                <li v-for="board in boards" :key="board.id" class="flex justify-between items-center gap-x-1 mb-2">
                  <span class="text-[13px] text-light-c font-medium">{{ board.name }}</span>
                  <Button
                      @on-click="assignItem(board,'board')"
                      :label="'Assign'"
                      :version="'green-small'"
                      size="small"
                  />
                </li>
              </ul>
            </div>
          </div>

          <div class="flex justify-center items-center gap-4 mt-8 border-t border-light-bg-c pt-4">
            <Button
                v-if="step === 3"
                @on-click="createNewCardItem"
                :label="isEdit ? 'Update' : 'Create'"
                version="green"
                size="medium"
            />
            <Button
                v-if="step !== 0 && !isEdit"
                @on-click="step = 0"
                :label="'Back'"
                version="yellow"
                size="medium"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</template>

<script setup>
import Button from '../Button/Button.vue'
import Input from "../Input/Input.vue";
import {watch, ref} from "vue";
import CloseBlackIcon from "../Svg/CloseBlackIcon.vue";
import SearchIcon from "../Svg/SearchIcon.vue";
import {catchErrors} from "../../utils/index.js";
import {useTasksStore} from "../../store/tasks.js";
import {useProjectStore} from "../../store/project.js";
import {useBoardsStore} from "../../store/boards.js";

const emit = defineEmits(['close', 'create', 'update'])
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  activeId: {
    type: String,
    default: ''
  },
  comment: {
    type: String,
    default: ''
  },
  editItem: {
    type: Object,
    default: () => {
    }
  }
})

//Store
const boardsStore = useBoardsStore()
const tasksStore = useTasksStore()
const projectStore = useProjectStore()


//State
const step = ref(props.isEdit ? 3 : 0)
const firstLoadBoard = ref(false)
const firstLoadTask = ref(false)
const firstLoadProject = ref(false)
const boards = ref([])
const tasks = ref([])
const projects = ref([])
const form = ref({
  comment: '',
  selectedTask: null,
  selectedProject: null,
  selectedBoard: null,
  taskSearch: '',
  boardSearch: '',
  projectSearch: '',
})


//Watch
watch(() => props.showModal, (val) => {
  if (val && props.isEdit) {
    form.value = {
      comment: props.editItem?.comment,
      selectedTask: props.editItem?.task?.id,
      selectedProject: props.editItem?.project?.id,
      selectedBoard: props.editItem?.board?.id,
      boardSearch: props.editItem?.board?.name,
      taskSearch: props.editItem?.task?.title,
      projectSearch: props.editItem?.project?.title,
    }

    if (props.editItem?.task?.id) searchTask()
    if (props.editItem?.project?.id) searchProject()
    if (props.editItem?.board?.id) searchBoard()
  } else if (val) {
    searchTask()
    searchProject()
    searchBoard()
  }
})


//Methods
const assignItem = (item, version) => {
  if (version === 'task') form.value.selectedTask = item.id
  if (version === 'project') form.value.selectedProject = item.id
  if (version === 'board') form.value.selectedBoard = item.id

  createNewCardItem()
}

const searchTask = async () => {
  try {
    const options = {
      search: form.value.taskSearch,
      query: 'page=1&page_size=10'
    }

    if (!firstLoadTask.value) delete options.search

    const resp = await tasksStore.fetchTasks(options)
    tasks.value = resp.data.results
    if (!firstLoadTask.value) firstLoadTask.value = true
  } catch (e) {
    catchErrors(e)
  }
}

const searchBoard = async () => {
  try {
    const options = {
      search: form.value.boardSearch,
      query: 'page=1&page_size=10'
    }

    if (!firstLoadBoard.value) delete options.search

    const resp = await boardsStore.fetchBoards(options)
    boards.value = resp.data.results
    if (!firstLoadBoard.value) firstLoadBoard.value = true
  } catch (e) {
    catchErrors(e)
  }
}

const searchProject = async () => {
  try {
    const options = {
      search: form.value.projectSearch,
      query: 'page=1&page_size=10'
    }

    if (!firstLoadProject.value) delete options.search
    const resp = await projectStore.fetchProjects(options)
    projects.value = resp.data.results
    if (!firstLoadProject.value) firstLoadProject.value = true
  } catch (e) {
    catchErrors(e)
  }
}

const closeModal = () => {
  emit('close')
  resetData()
}

const resetData = () => {
  projects.value = []
  tasks.value = []
  step.value = 0
  form.value = {
    comment: '',
    selectedTask: null,
    selectedProject: null,
    selectedBoard: null,
    taskSearch: '',
    boardSearch: '',
    projectSearch: '',
  }
}

const createNewCardItem = async (e) => {
  if (e) e.preventDefault()

  if (props.isEdit) emit('update', form.value)
  else emit('create', form.value)
  closeModal()
}
</script>
