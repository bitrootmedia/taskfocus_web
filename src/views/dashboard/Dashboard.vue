<template>
  <div class="main-container">
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
        <UrgentTasks />
      </div>

      <div class="mb-10">
        <UserTasksQueue />
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import UserTasksQueue from "../../components/Table/UserTasksQueue.vue";
import {catchErrors} from "../../utils";
import {ref} from "vue";
import {useTasksStore} from "../../store/tasks";
import UrgentTasks from "../../components/Lists/UrgentTasks.vue";

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
