<template>
  <div v-if="loading" class="mt-4">
    <Loader/>
  </div>

  <div v-else-if="tasks.length" class="mt-4 w-full">
    <div class="content w-full">
      <h3 class="font-bold mb-2 block md:hidden">Urgent Tasks</h3>

      <ul>

        <li v-for="task in tasks" :key="task.id">
          <router-link :to="`/dashboard/task/${task.id}`"
                       class="w-full mb-3 border border-light-bg-c rounded-[4px] px-4 py-3 cursor-pointer bg-[#E44B2A] flex justify-between items-center">
            <div>
              <p class="text-black-c mb-1">
                <span class="font-semibold text-white"> {{ task.title }}</span>
              </p>
              <div class="mt-1 text-sm text-white flex space-x-2">
                <span v-if="task.status" class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {{task.status}}
                </span>

                <span v-if="task.urgency_level" class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                  {{task.urgency_level}}
                </span>

                <span v-if="task.tag" class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                  {{task.tag}}
                </span>

              </div>
              <div class="mt-1 text-sm text-white" v-if="task?.project?.id">
            <span class="block">
              Project
              <span class="underline"
                    @click.stop="toLink(`/dashboard/project/${task.project.id}`)">{{ task.project.title }}</span>
            </span>
              </div>
            </div>
            <span class="text-xl text-white">&#9888;</span>
          </router-link>

        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {useTasksStore} from "../../store/tasks";
import Loader from '../Loader/Loader.vue'
import {catchErrors} from "../../utils";
import {computed, ref} from "vue";
import VMdEditor, {xss} from '@kangc/v-md-editor';
import {useRouter} from "vue-router";
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies()
const router = useRouter()
const tasksStore = useTasksStore()
const loading = ref(true)
const tasks = ref([])

const currentUser = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')

  if (user) return user

  return null
})

//Methods
const toLink = (link) => {
  router.push(link)
}

const fetchTasks = async () => {
  try {
    const options = {
      is_urgent: true,
      responsible: currentUser.value,
    }
    const resp = await tasksStore.fetchTasks(options)
    tasks.value = resp.data.results
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

// Run Functions
fetchTasks()
</script>

