<template>
  <div class="bg-white border-b border-[#E5E7E7] px-6 py-6 mb-[30px]">
    <div class="header flex flex-col justify-between mb-5 gap-y-3">
      <div class="flex items-center gap-x-3 gap-y-3">
        <div class="flex gap-x-6 w-full">
          <div class="relative w-full">
            <SearchIcon class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-1 left-2"/>
            <input
                v-model="filter.search.value"
                type="text"
                class="pl-9 pr-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Search by project"
            />
          </div>

        </div>

        <button
            @click="router.push(`/dashboard/create-project`)"
            class="whitespace-nowrap bg-orange-c flex items-center justify-center gap-x-1 px-3 py-1 text-[13px] font-medium rounded-[6px] hover:bg-orange-c-900 outline-none focus:outline-none ease-linear transition-all duration-150"
            type="button"
        >
          New Project
          <PlusIcon/>
        </button>
      </div>
    </div>

    <div class="actions flex flex-wrap justify-between items-center">
      <div class="flex flex-wrap">
        <div class="inline-flex items-center gap-x-1 mr-4">
          <CheckBox
              id="hideClosed"
              label="Hide closed projects"
              v-model:value="hideClosed"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="main-container">
    <div class="content">
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
                  <td class="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap">
                    <router-link :to="`/dashboard/project/${element.id}`" class="p-4">{{
                        element.title || '-'
                      }}
                    </router-link>
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
import Button from '../../components/Button/Button.vue'
import Input from '../../components/Input/Input.vue'
import CheckBox from '../../components/CheckBox/CheckBox.vue'
import SearchIcon from "../../components/Svg/SearchIcon.vue";
import PlusIcon from "../../components/Svg/PlusIcon.vue";
import FilterIcon from "../../components/Svg/FilterIcon.vue";

const projectStore = useProjectStore()
const {cookies} = useCookies();
const router = useRouter()

// State
const isDragDisabled = true
const headers = [
  {id: 1, label: 'Project', sorting: true, sortLabel: 'title'},
  {id: 2, label: 'Owner'},
  {id: 3, label: 'Tag'},
]

const loading = ref(true)
let drag = ref(false)
const search = ref('')
const projects = ref([])
const hideClosed = ref(true)


watch(hideClosed, (newValue, oldValue) => {
  fetchProjects()
})


// Methods
const fetchProjects = async (label) => {
  try {
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

// Composables
const paginate = usePaginate(fetchProjects, null)
const filter = useFilter(projects, fetchProjects)

// Run Functions
fetchProjects()

</script>
