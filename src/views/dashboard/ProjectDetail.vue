<template>
  <div class="main-container">
    <Loader v-if="loading"/>
    <div v-else class="content">
      <div class="header flex flex-col md:flex-row justify-between gap-x-2 lg:gap-x-10">
        <div class="w-full md:w-2/4">
          <div>
            <h1 v-if="!isEditTitle" class="text-3xl font-bold text-blueGray-700 mb-4 cursor-pointer"
                @click="isEditTitle = true">{{ project.title }}</h1>
            <div v-else class="mb-2">
              <input
                  v-model="form.title"
                  type="text"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Project Title"
              />
              <span class="text-xs font-medium text-red-600" v-if="v$.title.$error"> {{
                  v$.title.$errors[0].$message
                }} </span>
            </div>
          </div>
          <div class="description-panel">
            <div class="mb-2 sm:mb-4">
              <div class="text-blueGray-500">
                <span class="w-[80px] inline-block">Tag:</span>
                <b class="cursor-pointer" v-if="!isEditTag" @click="isEditTag = true">
                  <span v-if="!project.tag">N/A</span>
                  <span v-else>{{ project.tag }}</span>
                </b>

                <div v-else class="mb-2 w-80">
                  <input
                      v-model="form.tag"
                      type="text"
                      class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Tag"
                  />
                </div>
              </div>
            </div>

            <div class="mb-2 sm:mb-4">
              <div class="text-blueGray-500 inline-flex items-center" v-if="!isEditProgress">
                <span class="w-[80px] inline-block">Progress:</span>

                <div @click="isEditProgress = true" class="cursor-pointer flex items-center">
                  <div class=" w-[150px] h-[20px] border-2 border-blueGray-300">
                  <span class="progress bg-blueGray-500 block h-[16px]"
                        :style="{width: `${project.progress || 0}%`}"></span>
                  </div>
                  <span class="ml-2">{{ project.progress || 0 }}%</span>
                </div>
              </div>
              <div v-else class="mb-2 w-80 range-slider">
                <input type="range" min="0" max="100" step="1" v-model="form.progress" @input="updateSlider"
                       :style="{backgroundSize: backgroundSize}">
                <div class="data text-blueGray-500">Progress: {{ form.progress }}/100</div>
              </div>
            </div>

            <div class="mb-2 sm:mb-4">
              <div class="text-blueGray-500 inline-flex items-center">
                <span class="w-[80px] inline-block">Closed:</span>

                <Switch v-model:value="form.is_closed"/>
              </div>
            </div>

            <div class="mb-2 sm:mb-4">
              <div v-if="!isEditDesc" class="text-blueGray-500 cursor-pointer w-fit" @click="isEditDesc = true">
                <v-md-preview v-if="project.description" :text="project.description" class="cursor-pointer"></v-md-preview>
                <span v-else>No Description</span>
              </div>
              <div v-else class="mt-[10px]">
                <div>
                  <v-md-editor v-model="form.description"></v-md-editor>
                </div>
              </div>
            </div>
          </div>


          <div v-if="isEditTitle || isEditDesc || isEditTag || isEditProgress" class="flex gap-x-4">
            <button
                @click="updateProject"
                :disabled="btnLoad"
                class="mt-2 bg-blueGray-800 text-white active:bg-blueGray-600 text-md font-bold px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Update
            </button>

            <button
                @click="resetData"
                class="mt-2 bg-blueGray-800 text-white active:bg-blueGray-600 text-md font-bold px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Close
            </button>
          </div>

        </div>

        <div class="users mt-6 md:mt-0 w-full md:w-2/6">
          <div class="flex justify-between items-center gap-x-2">
            <div class="flex gap-x-1 flex-col">
              <span class="text-blueGray-500 ">Access: </span>
              <ul class="flex gap-x-2 flex-wrap">
                <li class="text-blueGray-500 mb-1" :class="{'cursor-pointer': isAuthOwner}"
                    @click="isAuthOwner ? showOwnersModal = true : null">
                  <b>
                    <span v-if="project.owner?.first_name || project.owner?.last_name">{{
                        project.owner?.first_name
                      }} {{ project.owner?.last_name }}(owner)</span>
                    <span v-else>{{ project.owner?.username }}(owner)</span>
                    <span v-if="haveProjectAccess.length">,</span>
                  </b>
                </li>

                <li v-if="haveProjectAccess.length" v-for="(item,index) in haveProjectAccess" :key="item.user.id"
                    class="text-blueGray-500 font-medium">
                  {{ item.user.first_name }} {{ item.user.last_name }}<span
                    v-if="index !== haveProjectAccess.length - 1">,</span>
                </li>
              </ul>
            </div>

            <button
                v-if="isAuthOwner"
                @click="showModal = true"
                class="bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >Manage Project Users
            </button>
          </div>
        </div>

        <UsersModal
            :show-modal="showModal"
            :project="project"
            :users="users"
            :have-project-access="haveProjectAccess"
            :have-project-access-ids="haveProjectAccessIds"
            :btn-title="'Manage Project Users'"
            @close="showModal = false"
            @update="fetchProjectAccess"
        />

        <OwnersModal
            :show-modal="showOwnersModal"
            :users="users"
            :btn-title="'Change Owners'"
            @close="showOwnersModal = false"
            @update="updateProjectOwner"
        />
      </div>

      <div class="mt-6 sm:mt-8" v-if="project.id">
        <div class="mb-10">
          <TasksDataTable
              :project-id="project.id"
              :project-title="project.title"
              :have-project-access-ids="haveProjectAccessIds"
          />
        </div>

        <div class="mb-10">
          <AttachmentsDataTable :project-id="project.id"/>
        </div>

        <div class="mb-10">
          <CommentsDataTable :project-id="project.id" :project-name="project.title"/>
        </div>

        <div class="mb-10">
          <LogsDataTable :project-id="project.id"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router'
import {computed, ref, watch} from "vue";
import {catchErrors} from "../../utils";
import {useProjectStore} from "../../store/project";
import Loader from "./../../components/Loader/Loader.vue"
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {useToast} from "vue-toastification";
import {useUserStore} from "../../store/user";
import {useCookies} from "vue3-cookies";
import UsersModal from "../../components/Modals/UsersModal.vue";
import TasksDataTable from "../../components/Table/TasksDataTable.vue";
import AttachmentsDataTable from "../../components/Table/AttachmentsDataTable.vue";
import CommentsDataTable from "../../components/Table/CommentsDataTable.vue";
import LogsDataTable from "../../components/Table/LogsDataTable.vue";
import VMdEditor from '@kangc/v-md-editor';
import OwnersModal from '../../components/Modals/OwnersModal.vue'
import Switch from '../../components/Switch/Switch.vue'

// ValidationRules
const rules = {
  title: {required},
  description: {required},
}

const route = useRoute()
const router = useRouter()
const toast = useToast()
const projectStore = useProjectStore()
const userStore = useUserStore()
const {cookies} = useCookies();

// State
const btnLoad = ref(false)
const loading = ref(false)
let isEditTitle = ref(false)
let isEditDesc = ref(false)
let isEditTag = ref(false)
let isEditProgress = ref(false)
let showModal = ref(false)
let showOwnersModal = ref(false)
let firstLoad = ref(false)
const project = ref({})
const haveProjectAccess = ref([])
const haveProjectAccessIds = ref([])
const users = ref([])
const backgroundSize = ref('0% 0%')
const form = ref({
  title: '',
  description: '',
  tag: '',
  progress: '',
  is_closed: '',
})

const v$ = useVuelidate(rules, form)


// Watch
watch(() => form.value.is_closed, (newValue,oldValue) => {
  if (firstLoad.value) return updateProject()

  firstLoad.value = true
})


// Computed
const isAuthOwner = computed(() => {
  if (!cookies.get('task_focus_user')) return ''

  const user = cookies.get('task_focus_user')
  const projectOwnerId = project.value.owner?.id
  return user.pk === projectOwnerId
})

// Methods
const updateSlider = (e) => {
  let clickedElement = e.target,
      min = clickedElement.min,
      max = clickedElement.max,
      val = clickedElement.value;

  backgroundSize.value = (val - min) * 100 / (max - min) + '% 100%';
}

const updateProjectOwner = async (owner) => {
  try {
    if (owner) {
      const data = {
        id: project.value.id,
        owner
      }

      await projectStore.updateProjectOwner(data)
      await toast.success("Successfully owner updated");
      await router.push('/dashboard/projects')
    }
  } catch (e) {
    catchErrors(e)
  }
}


const resetData = () => {
  isEditDesc.value = isEditTitle.value = false
  isEditTag.value = isEditTag.value = false
  isEditProgress.value = isEditProgress.value = false
  backgroundSize.value = `${project.value.progress || 0}% 100%`
  form.value = {...project.value}
}

const fetchProject = async () => {
  try {
    const id = route.params.id
    if (id) {
      loading.value = true
      const resp = await projectStore.fetchProjectById({id})
      project.value = resp.data

      Object.keys(resp.data).forEach((key) => {
        form.value[key] = resp.data[key]
      })

      backgroundSize.value = `${resp.data.progress || 0}% 100%`
    }
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

const fetchProjectAccess = async () => {
  try {
    const id = route.params.id
    if (id) {
      const resp = await projectStore.fetchProjectAccess({id})
      const user = cookies.get('task_focus_user')
      const list = []
      const ids = []
      resp.data.results.forEach((item) => {
        // if (item.user.id !== user.pk) {
          list.push(item)
          ids.push(item.user.id)
        // }
      })
      haveProjectAccess.value = list
      haveProjectAccessIds.value = ids
    }
  } catch (e) {
    catchErrors(e)
  }
}


const updateProject = async () => {
  try {
    btnLoad.value = true
    const data = {
      id: route.params.id,
      title: form.value.title,
      description: form.value.description,
      tag: form.value.tag,
      is_closed: form.value.is_closed,
      progress: form.value.progress || 0,
    }
    await projectStore.updateProject(data)
    await toast.success("Successfully project updated");
    await fetchProject()
    isEditTitle.value = false
    isEditDesc.value = false
    isEditTag.value = false
    isEditProgress.value = false
  } catch (e) {
    catchErrors(e)
  }finally {
    btnLoad.value = false
  }
}

const fetchUsers = async () => {
  try {
    const resp = await userStore.fetchUsers()
    const user = cookies.get('task_focus_user')
    users.value = resp.data.results.filter((item) => item.id !== user.pk)
  } catch (e) {
    catchErrors(e)
  }
}


// Run Functions
fetchProject()
fetchUsers()
fetchProjectAccess()

</script>
