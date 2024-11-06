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
                  @on-click="step = 1"
                  :label="'Task'"
                  version="gray"
                  size="medium"
              />
              <Button
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

              <ul class="mt-3 notifications-wrapper max-h-[300px] overflow-y-auto pr-2">
                <li v-for="task in tasks" :key="task.id" class="flex justify-between items-center gap-x-1 mb-2">
                  <span class="text-[13px] text-light-c font-medium">{{ task.title }}</span>
                  <Button
                      @on-click="task.id === form.selectedTask ? removeItem('task') : assignItem(task,'task')"
                      :label="task.id === form.selectedTask? 'Remove' : 'Assign'"
                      :version="task.id === form.selectedTask ? 'red-small' : 'green-small'"
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

              <ul class="mt-3 max-h-[300px] overflow-y-auto">
                <li v-for="project in projects" :key="project.id"
                    class="flex justify-between items-center gap-x-1 mb-2">
                  <span class="text-[13px] text-light-c font-medium">{{ project.title }}</span>
                  <Button
                      @on-click="project.id === form.selectedProject ? removeItem('project') : assignItem(project,'project')"
                      :label="project.id === form.selectedProject? 'Remove' : 'Assign'"
                      :version="project.id === form.selectedProject ? 'red-small' : 'green-small'"
                      size="small"
                  />
                </li>
              </ul>
            </div>

            <div v-if="step === 3">
              <textarea
                  class="min-h-[150px] w-full px-2 py-2 inline-flex text-black-c outline-0 mb-2 border border-light-bg-c"
                  v-model="form.comment"></textarea>
            </div>
          </div>

          <div v-if="step === 0">
            <div v-if="isEdit" class="flex justify-between items-center mt-8 border-t border-light-bg-c pt-4">
              <Button
                  @on-click="emit('delete')"
                  :label="'Delete'"
                  version="red"
                  size="medium"
              />
              <Button
                  @on-click="updateCardItem"
                  :label="'Update'"
                  version="green"
                  size="medium"
              />
            </div>

            <div v-else class="flex justify-center items-center gap-4 mt-8 border-t border-light-bg-c pt-4">
              <Button
                  @on-click="createNewCardItem"
                  :label="'Create'"
                  version="green"
                  size="medium"
              />
              <Button
                  @on-click="emit('close')"
                  :label="'Close'"
                  version="yellow"
                  size="medium"
              />
            </div>
          </div>

          <div v-else class="flex justify-end gap-x-3 mt-4 border-t border-light-bg-c pt-4">
            <Button
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

const emit = defineEmits(['close', 'create'])
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
  editItem: {
    type: Object,
    default: () => {
    }
  }
})

//Store
const tasksStore = useTasksStore()
const projectStore = useProjectStore()


//State
const step = ref(0)
const tasks = ref([])
const projects = ref([])
const form = ref({
  comment: '',
  selectedTask: null,
  selectedProject: null,
  taskSearch: '',
  projectSearch: '',
})


//Watch
watch(() => props.showModal, (val) => {
  if (val && props.isEdit) {
    form.value = {
      comment: props.editItem?.comment,
      selectedTask: props.editItem?.task?.id,
      selectedProject: props.editItem?.project?.id,
      taskSearch: props.editItem?.task?.title,
      projectSearch: props.editItem?.project?.title,
    }

    if (props.editItem?.task?.id) searchTask()
    if (props.editItem?.project?.id) searchProject()
  }
})


//Methods
const assignItem = (item, version) => {
  if (version === 'task') {
    form.value.selectedTask = item.id
  }
  if (version === 'project') {
    form.value.selectedProject = item.id
  }
}
const removeItem = (version) => {
  if (version === 'task') {
    form.value.selectedTask = null
  }
  if (version === 'project') {
    form.value.selectedProject = null
  }
}

const searchTask = async () => {
  try {
    const options = {
      search: form.value.taskSearch,
    }
    const resp = await tasksStore.fetchTasks(options)
    tasks.value = resp.data.results
  } catch (e) {
    catchErrors(e)
  }
}

const searchProject = async () => {
  try {
    const options = {
      search: form.value.projectSearch,
    }
    const resp = await projectStore.fetchProjects(options)
    projects.value = resp.data.results
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
    taskSearch: '',
    projectSearch: '',
  }
}

const createNewCardItem = async () => {
  emit('create', form.value)
  closeModal()
}

const updateCardItem = async () => {
  emit('update', form.value)
  resetData()
}

</script>
