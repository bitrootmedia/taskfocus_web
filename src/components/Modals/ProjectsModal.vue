<template>
  <div v-if="showModal" ref="componentModalRef"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
  @click.self="emit('close')">
    <div class="relative my-6 mx-auto w-[350px]">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <!--header-->
        <div class="py-3">
          <div class="flex items-center justify-between rounded-t p-3 border-b border-light-bg-c">
            <h3 class="text-[22px] text-black-c font-semibold">
              Projects
            </h3>

            <CloseBlackIcon class="cursor-pointer" @click="emit('close')"/>
          </div>
        </div>
        <!--body-->
        <div class="relative p-3 flex-auto">
          <Loader v-if="loading"/>

          <div v-else class="content">
            <div class="relative mb-6">
              <SearchIcon class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-1 left-2"/>
              <input
                  v-model="filter.search.value"
                  type="text"
                  class="pl-9 pr-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Search..."
              />
            </div>

            <ul v-if="projects.length">
              <li v-for="project in projects" :key="project.id" class="flex justify-between items-center gap-x-1 mb-2">
                <span class="text-md text-black-c font-semibold">{{ project?.title }}</span>
                <Button
                    @on-click="updateProject(project?.id === projectId ? null : project?.id)"
                    :label="project?.id === projectId ? 'Delete' : 'Select'"
                    :version="project?.id === projectId ? 'red-small' : 'green-small'"
                    size="small"
                />
              </li>
            </ul>

            <div v-else>
              <p class="flex justify-center pb-3 text-black-c font-medium">
                No data found
              </p>
            </div>


            <Pagination
                v-if="paginate.pagination.value.total > 1 && !loading"
                :pagination="paginate.pagination.value"
                v-model:query="paginate.query.value"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</template>

<script setup>
import {catchErrors} from "../../utils";
import {onBeforeUnmount, onMounted, ref} from "vue";
import Loader from "./../../components/Loader/Loader.vue"
import {useProjectStore} from "../../store/project";
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";
import {usePaginate} from "../../composables/usePaginate";
import {useFilter} from "../../composables/useFilter";
import Pagination from "./../Pagination/Pagination.vue"
import {useTasksStore} from "../../store/tasks";
import config from "../../config";
import CloseBlackIcon from "../Svg/CloseBlackIcon.vue";
import Button from '../Button/Button.vue'
import SearchIcon from "../Svg/SearchIcon.vue";

const emit = defineEmits(['close', 'update'])
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: Object,
    default: () => {
    }
  },
  taskId: {
    type: Object,
    default: () => {
    }
  },
  btnTitle: {
    type: String,
    default: ''
  },
})


const projectStore = useProjectStore()
const taskStore = useTasksStore()
const {cookies} = useCookies();
const toast = useToast()
const projects = ref([])
const componentModalRef = ref()


// State
const loading = ref(false)


// Methods
const fetchProjects = async () => {
  try {
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      search: filter.search.value,
    }
    const resp = await projectStore.fetchProjects(options)
    projects.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  }
}


const updateProject = async (id) => {
  try {
    const data = {
      id: props.taskId,
      project: id || null,
    }
    await taskStore.updateTask(data)
    await toast.success("Successfully project updated");
    await emit('close')
    await emit('update')
  } catch (e) {
    catchErrors(e)
  }
}

const handleClick = (e) => {
  if (e.target.innerHTML === props.btnTitle) return false

  if (!componentModalRef.value === e.target) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('click', handleClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClick)
})

// Composables
const options = {
  pageSize: config.PROJECT_POPUP
}
const paginate = usePaginate(fetchProjects, options)
const filter = useFilter(projects, fetchProjects)

fetchProjects()

</script>