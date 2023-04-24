<template>
  <div class="main-container">
    <div class="actions flex gap-x-6">
      <button
          @click="router.push('/dashboard/create-task')"
          class="bg-yellow-600 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
          type="button"
      >
        Create Task
      </button>
    </div>

    <div v-if="task" class="working-task mt-4">
      Currently working on:
      <span class="underline cursor-pointer text-blue-500" @click="toLink('task')">{{ task.title }}</span>
     <template v-if="task.project?.title">
       in project
       <span class="underline cursor-pointer text-blue-500" @click="toLink('project')">{{task.project.title}}</span>
     </template>
    </div>

    <div class="content">
      <div class="mb-10">
        <TasksDataTable :hide-create="true"/>
      </div>

      <div class="mb-10">
        <CommentsDataTable :hide-create="true"/>
      </div>

      <div class="mb-10">
        <LogsDataTable :hide-create="true"/>
      </div>

      <div>
        <AttachmentsDataTable :hide-create="true"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import TasksDataTable from './../../components/Table/TasksDataTable.vue'
import CommentsDataTable from './../../components/Table/CommentsDataTable.vue'
import LogsDataTable from './../../components/Table/LogsDataTable.vue'
import AttachmentsDataTable from './../../components/Table/AttachmentsDataTable.vue'
import {catchErrors} from "../../utils";
import {ref} from "vue";
import {useTasksStore} from "../../store/tasks";

const router = useRouter()
const tasksStore = useTasksStore()
const task = ref(null)

// Methods
const toLink = (type)=>{
  if (type === 'task') return router.push(`/dashboard/task/${task.value.id}`)
  else return router.push(`/dashboard/project/${task.value.project.id}`)
}

const fetchCurrentTask = async()=>{
  try{
    const resp = await tasksStore.fetchWorkingTask()
    if (resp.data && Object.keys(resp.data).length){
      task.value = resp.data
    }
  }catch (e) {
    catchErrors(e)
  }
}

// Run Functions
fetchCurrentTask()
</script>
