<template>
  <div class="main-container pt-6 pb-6">
    <div v-if="task" class="working-task text-black-c text-sm">
      Currently working on:
      <router-link :to="`/dashboard/task/${task.id}`"
                   class="underline cursor-pointer">
        {{ task.title }}
      </router-link>
      <template v-if="task.project?.title">
        in project
        <router-link :to="`/dashboard/project/${task.project.id}`"
                     class="underline cursor-pointer">
          {{ task.project.title }}
        </router-link>
      </template>
    </div>

    <div class="content">
      <div class="mb-10 flex flex-col md:flex-row gap-0 md:gap-8">
        <UrgentTasks/>

        <div class="w-full">
          <PinnedTasks :pinnedTasks="pinnedTasks" :loading="loading"/>
          <Pagination
              v-if="paginate.pagination.value.total > 1 && !loading"
              :pagination="paginate.pagination.value"
              v-model:query="paginate.query.value"
          />
        </div>

        <PinnedBoards/>
      </div>

      <div class="mb-10">
        <UserTasksQueue/>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserTasksQueue from "../../components/Table/UserTasksQueue.vue";
import {catchErrors, pusherEventNames} from "../../utils";
import {onMounted, ref} from "vue";
import {useTasksStore} from "../../store/tasks";
import UrgentTasks from "../../components/Lists/UrgentTasks.vue";
import PinnedTasks from "../../components/Lists/PinnedTasks.vue";
import {usePusher} from "../../composables/usePusher";
import {useCookies} from "vue3-cookies";
import Pagination from "../../components/Pagination/Pagination.vue";
import {usePaginate} from "../../composables/usePaginate";
import config from "../../config/index.js";
import PinnedBoards from "../../components/Lists/PinnedBoards.vue";

const {bindEvent, setPusherChannel} = usePusher()
const {cookies} = useCookies();
const tasksStore = useTasksStore()
const task = ref(null)
const loading = ref(true)
const pinnedTasks = ref([])

// Methods
const fetchCurrentTask = async () => {
  try {
    const resp = await tasksStore.fetchWorkingTask()
    if (resp.data && Object.keys(resp.data).length) {
      task.value = resp.data
    }
  } catch (e) {
    catchErrors(e)
  }
}

const fetchPinnedTasks = async () => {
  try {
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
    }

    const resp = await tasksStore.fetchPinnedTasks(options)
    pinnedTasks.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const user = cookies.get('task_focus_user')
  if (user) {
    setPusherChannel(`USR_${user.pk}`)
    bindEvent(pusherEventNames.current_task_update, fetchCurrentTask);
  }
})

// Composables
const options = {
  pageSize: config.PINED
}
const paginate = usePaginate(fetchPinnedTasks, options)

// Run Functions
fetchCurrentTask()
fetchPinnedTasks()
</script>
