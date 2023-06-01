<template>
  <div v-if="loading" class="mt-4">
    <Loader />
  </div>

  <div v-else class="mt-4">
    <div class="header flex items-center gap-x-6 mb-4">
      <h2 class="font-bold text-xl block text-blueGray-700">Urgent Tasks</h2>
    </div>

    <div class="content">
      <ul>
        <li v-for="task in tasks" :key="task.id"
            class="w-full lg:w-[700px] mb-3 border border-blueGray-300 rounded-[4px] px-4 py-3 cursor-pointer" @click="router.push(`/dashboard/task/${task.id}`)">
          <p class="text-blueGray-500 mb-1">
            <span>Title: </span> <b> {{ task.title }}</b>
          </p>
          <p class="text-blueGray-500 mb-1">
            <span> Status: </span> <b> {{ task.status || 'N/A' }}</b>
          </p>
          <div class="flex items-center text-blueGray-500 mb-1">
            <span>Progress: </span>

            <div class="cursor-pointer flex items-center">
              <div class=" w-[150px] h-[20px] border-2 border-blueGray-300 ml-3">
                  <span class="progress bg-blueGray-500 block h-[16px]"
                        :style="{width: `${task.progress || 0}%`}"></span>
              </div>
              <span class="ml-2">{{ task.progress || 0 }}%</span>
            </div>
          </div>

          <div class="description-panel">
            <v-md-preview-html
                :html="xss.process(VMdEditor.vMdParser.themeConfig.markdownParser.render(task.description))"
                preview-class="vuepress-markdown-body"></v-md-preview-html>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {useTasksStore} from "../../store/tasks";
import Loader from '../Loader/Loader.vue'
import {catchErrors} from "../../utils";
import {ref} from "vue";
import VMdEditor, {xss} from '@kangc/v-md-editor';
import {useRouter} from "vue-router";

const router = useRouter()
const tasksStore = useTasksStore()
const loading = ref(true)
const tasks = ref([])

//Methods
const fetchTasks = async () => {
  try {
    const options = {
      is_urgent: true
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

