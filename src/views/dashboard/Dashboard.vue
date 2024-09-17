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
      <div class="mb-10 flex flex-col md:flex-row gap-0 md:gap-8">
        <UrgentTasks />

        <PinnedTasks :pinnedTasks="pinnedTasks" :loading="loading"/>
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
import {onMounted, ref} from "vue";
import {useTasksStore} from "../../store/tasks";
import UrgentTasks from "../../components/Lists/UrgentTasks.vue";
import PinnedTasks from "../../components/Lists/PinnedTasks.vue";
import {usePusher} from "../../composables/usePusher";
import {useCookies} from "vue3-cookies";

const {channel, events, bindEvent, setPusherChannel} = usePusher()
const {cookies} = useCookies();
const router = useRouter()
const tasksStore = useTasksStore()
const task = ref(null)
const loading = ref(true)
const pinnedTasks = ref([])

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

const fetchPinnedTasks = async ()=>{
  try{
    const resp = await tasksStore.fetchPinnedTasks()
    pinnedTasks.value = resp.data.results
    console.log(resp.data.results,'resp')
  }catch (e) {
    catchErrors(e)
  }finally {
    loading.value = false
  }
}

onMounted(()=>{
  const user = cookies.get('task_focus_user')
  if (user){
    setPusherChannel(`USR_${user.pk}`)
    bindEvent(pusherEventNames.current_task_update, fetchCurrentTask);
  }
})

// Run Functions
fetchCurrentTask()
fetchPinnedTasks()
</script>
