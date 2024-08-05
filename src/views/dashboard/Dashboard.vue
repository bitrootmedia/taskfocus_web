<template>
  <div class="main-container pt-6 pb-6">
    <div v-if="task" class="working-task text-black-c text-sm">
      Currently working on:
      <span class="underline cursor-pointer" @click="toLink('task')">{{ task.title }}</span>
     <template v-if="task.project?.title">
       in project
       <span class="underline cursor-pointer" @click="toLink('project')">{{task.project.title}}</span>
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
import {catchErrors, pusherEventNames} from "../../utils";
import {onMounted, ref, watch} from "vue";
import {useTasksStore} from "../../store/tasks";
import UrgentTasks from "../../components/Lists/UrgentTasks.vue";
import {usePusher} from "../../composables/usePusher";
import {useCookies} from "vue3-cookies";

const {channel, events, bindEvent, setPusherChannel} = usePusher()
const {cookies} = useCookies();
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

watch(events,(val)=>{
  console.log(val,'changed')
})

onMounted(()=>{
  const user = cookies.get('task_focus_user')
  if (user){
    setPusherChannel(`USR_${user.pk}`)
    bindEvent(pusherEventNames.current_task_update, fetchCurrentTask);
  }
})

// Run Functions
fetchCurrentTask()
</script>
