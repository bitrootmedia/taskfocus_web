<template>
  <div class="main-container">
    <div class="header flex items-center justify-between">
      <div class="relative w-2/4">
        <i class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-[12px] left-[8px]"/>
        <input
            v-model="filter.search.value"
            type="text"
            class="border-0 pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Search"
        />
      </div>

      <button
          @click="router.push('/dashboard/create-project')"
          class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
          type="button"
      >
        Create Project
      </button>
    </div>

    <div class="flex items-center mt-4">
      <input
          id="hideClosed"
          v-model="hideClosed"
          type="checkbox"
          class="border-0 flex pl-8 pr-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm ease-linear transition-all duration-150 cursor-pointer"
          placeholder="Search"
      />
      <label for="hideClosed" class="text-md text-blueGray-500 font-medium cursor-pointer ml-2 whitespace-nowrap">Hide closed projects</label>
    </div>

    <div class="content mt-4">
      <DataTable :headers="headers" @sorting="sorting">
        <template v-slot:tableBody>
          <tr v-if="loading">
            <td :colspan="headers.length">
              <div class="flex justify-center py-1 text-blueGray-500 font-medium">
                <Loader/>
              </div>
            </td>
          </tr>

          <template v-else>
            <tr v-if="!projects.length">
              <td :colspan="headers.length">
                <p class="flex text-center px-4 justify-center py-8 text-black-c font-medium">
                  No data found
                </p>
              </td>
            </tr>

            <draggable
                v-else
                tag="tbody"
                :disabled="isDragDisabled"
                v-model="projects"
                @start="drag = true"
                @end="drag = false"
                item-key="id">
              <template #item="{element}">
                <tr :class="{'cursor-move': !isDragDisabled}">
                  <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <span class="cursor-pointer" @click="toLink(element)">{{ element.title }}</span>
                  </td>
                  <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <div>
                      <span v-if="element.owner?.first_name || element.owner?.last_name">{{
                          element.owner?.first_name
                        }} {{ element.owner?.last_name }}</span>
                        <span v-else>{{ element.owner?.username }}</span>
                    </div>
                  </td>
                  <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <span>{{ element.tag || '-' }}</span>
                  </td>
                  <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <span>{{ element.progress || 0 }}%</span>
                  </td>
                </tr>
              </template>
            </draggable>
          </template>
        </template>
      </DataTable>

      <Pagination
          v-if="paginate.pagination.value.total > 1 && !loading"
          :pagination="paginate.pagination.value"
          v-model:query="paginate.query.value"
      />
    </div>

  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import {useProjectStore} from "../../store/project";
import {catchErrors} from "../../utils";
import DataTable from './../../components/Table/DataTable.vue'
import Loader from './../../components/Loader/Loader.vue'
import Pagination from "../../components/Pagination/Pagination.vue";
import {useCookies} from "vue3-cookies";
import {useRouter} from "vue-router";
import draggable from 'vuedraggable'
import {usePaginate} from "../../composables/usePaginate";
import {useFilter} from "../../composables/useFilter";

const projectStore = useProjectStore()
const {cookies} = useCookies();
const router = useRouter()

// State
const isDragDisabled = true
const headers = [
  {id: 1, label: 'Project', sorting: true, sortLabel: 'title'},
  {id: 2, label: 'Owner'},
  {id: 3, label: 'Tag'},
  {id: 4, label: 'Progress'},
]

const loading = ref(false)
let drag = ref(false)
const search = ref('')
const projects = ref([])
const hideClosed = ref(true)


watch( hideClosed, (newValue, oldValue) => {
  fetchProjects()
})


// Methods
const fetchProjects = async (label) => {
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      search: filter.search.value,
      sorting: label,
      isClosed: hideClosed.value
    }
    const resp = await projectStore.fetchProjects(options)
    projects.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

const sorting = (label) => {
  fetchProjects(label)
}

const toLink = (item) => {
  router.push(`/dashboard/project/${item.id}`)
}

// Composables
const paginate = usePaginate(fetchProjects, null)
const filter = useFilter(projects, fetchProjects)

// Run Functions
fetchProjects()

</script>