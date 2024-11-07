<template>
  <div class="main-container pt-6">
    <div class="header flex items-center gap-x-4">
      <div class="relative w-[250px]">
        <Input placeholder="Search" v-model:value="filter.search.value" leftIcon/>
      </div>

      <Button
          @on-click="router.push('/dashboard/create-project')"
          label="Create Project"
          size="medium"
          version="green"
      />
    </div>

    <div class="mt-4">
      <CheckBox
          id="hideClosed"
          label="Hide closed projects"
          v-model:value="hideClosed"
      />
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
