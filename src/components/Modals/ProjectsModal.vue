<template>
  <div v-if="showModal"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative my-6 mx-auto w-[350px]">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <!--header-->
        <div class="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 class="text-3xl font-semibold">
            Projects
          </h3>

          <div>
            <span class="cursor-pointer" @click="emit('close')">
               <i class="fas fa-window-close mr-2 text-3xl text-blueGray-400"/>
            </span>
          </div>
        </div>
        <!--body-->
        <div class="relative p-6 flex-auto">
          <Loader v-if="loading"/>

          <div v-else class="content">
            <div class="relative mb-6">
              <i class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-[12px] left-[8px]"/>
              <input
                  v-model="filter.search.value"
                  type="text"
                  class="border-0 pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Search Project..."
              />
            </div>

            <ul v-if="projects.length">
              <li v-for="project in projects" :key="project.id" class="flex justify-between items-center gap-x-1 my-3">
                <span class="text-lg text-blueGray-500 font-medium">{{ project.title }}</span>
                <button
                    :class="{'bg-red-600': project.id === projectId, 'bg-emerald-600': project.id !== projectId}"
                    class="text-white active:bg-blueGray-600 text-sm font-bold px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    @click="updateProject(project.id === projectId ? null : project.id)"
                >
                  {{ project.id === projectId ? 'Remove' : 'Select' }}
                </button>
              </li>
            </ul>

            <div v-else>
              <p class="flex justify-center py-3 text-blueGray-500 font-medium">
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
import {ref} from "vue";
import Loader from "./../../components/Loader/Loader.vue"
import {useProjectStore} from "../../store/project";
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";
import {usePaginate} from "../../composables/usePaginate";
import {useFilter} from "../../composables/useFilter";
import Pagination from "./../Pagination/Pagination.vue"
import {useTasksStore} from "../../store/tasks";

const emit = defineEmits(['close','update'])
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
})


const projectStore = useProjectStore()
const taskStore = useTasksStore()
const {cookies} = useCookies();
const toast = useToast()
const projects = ref([])

// State
const loading = ref(false)


// Methods
const fetchProjects = async()=>{
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


const updateProject = async (id)=>{
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

// Composables
const paginate = usePaginate(fetchProjects,null)
const filter = useFilter(projects,fetchProjects)

fetchProjects()

</script>