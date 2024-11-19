<template>
  <nav
      v-if="userStore.showPanel.show || titleData.isEdit"
      class="sticky top-0 bg-white border-b border-[#E5E7E7] w-full z-[3] md:flex-row md:flex-nowrap md:justify-start hidden md:flex items-center pl-[50px] pr-4 pt-[30px] pb-[27px]"
  >
    <div
        class="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap"
    >
      <div class="flex justify-between items-center flex-n] main-container pl-0 flex-nowrap gap-2">
        <input v-if="route.name === 'Task Detail'"
               class="w-full cursor-pointer inline-flex font-semibold text-[22px] text-black-c outline-0"
               v-model="taskTitle"
               @input="changeTitle($event,'task')"/>
        <input v-else-if="route.name === 'Project Detail'"
               class="w-full cursor-pointer inline-flex font-semibold text-[22px] text-black-c outline-0"
               v-model="projectTitle"
               @input="changeTitle($event,'project')"/>
        <a
            v-else
            class="text-black text-[22px] uppercase hidden md:inline-block font-semibold"
            href="javascript:void(0)"
        >
          {{ route.name || 'Dashboard' }}
        </a>

        <div class="hidden md:flex gap-x-4 flex-wrap md:flex-nowrap">
          <Button
              @on-click="titleData.isEdit ? saveData() : userStore.showPanel.update()"
              label="Save Changes"
              size="medium"
              version="yellow"
          />
          <Button
              @on-click="discardChanges"
              label="Discard Changes"
              size="medium"
              version="green"
          />
        </div>
      </div>
    </div>
  </nav>
</template>


<script setup>
import {useUserStore} from "../../store/user";
import {useRoute} from "vue-router";
import {ref, watch} from "vue";
import Button from '../Button/Button.vue'
import {useTasksStore} from "../../store/tasks";
import {catchErrors} from "../../utils";
import {useProjectStore} from "../../store/project";

const userStore = useUserStore()
const taskStore = useTasksStore()
const projectStore = useProjectStore()
const route = useRoute()
const task = ref({})
const project = ref({})
const taskTitle = ref('')
const projectTitle = ref('')
const titleData = ref({
  isEdit: false,
  type: 'task',
  planText: ''
});


//Watch
watch(taskStore.$state, (val) => {
  if (Object.keys(val.task).length) {
    task.value = val.task
    taskTitle.value = val.task.title
  }
})

watch(projectStore.$state, (val) => {
  if (Object.keys(val.project).length) {
    project.value = val.project
    projectTitle.value = val.project.title
  }
})

// Methods
const discardChanges = () => {
  titleData.value = {
    ...titleData.value,
    isEdit: false,
    plainText: task.value.title,
  }
  taskTitle.value = task.value.title
  userStore.showPanel.close()
}

const updateProjectTitle = async (title) => {
  try {
    const data = {
      id: project.value.id,
      title: title,
    }
    await projectStore.updateProject(data)
    userStore.showPanel.close()
  } catch (e) {
    if (e.response?.data?.title[0] === 'This field may not be blank.') {
      projectTitle.value = project.value.title
    }
    catchErrors(e)
  }
}

const updateTask = async (title) => {
  try {
    const data = {
      id: taskStore.$state.task.id,
      title: title,
    }

    await taskStore.updateTask(data)
    titleData.value = {
      ...titleData.value,
      isEdit: false,
      plainText: '',
    }
    userStore.showPanel.close()
  } catch (e) {
    if (e.response?.data?.title[0] === 'This field may not be blank.') {
      taskTitle.value = task.value.title
    }
    catchErrors(e)
  }
}

const changeTitle = (e, type) => {
  titleData.value = {isEdit: true, type}
}

const saveData = async () => {
  const {type} = titleData.value

  if (type === 'task') {
    return await updateTask(taskTitle.value)
  }

  await updateProjectTitle(projectTitle.value)
}
</script>

<style scoped>
.main-container {
  padding-left: 0 !important;
}
</style>
