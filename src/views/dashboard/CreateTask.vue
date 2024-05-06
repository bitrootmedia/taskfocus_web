<template>
  <div class="main-container pt-6">
    <h2 v-if="tempProject" class="text-md block text-blueGray-700 mb-4 sm:mb-8">Project: <b>{{ tempProject.name }}</b>
    </h2>

    <form @submit="createTask($event)">
      <div class="flex items-center items-baseline gap-x-4 mb-3">
        <div class="relative w-[250px]">
          <Input placeholder="Task Name" v-model:value="name"/>
          <span class="text-xs font-medium text-red-600" v-if="v$.name.$error"> {{
              v$.name.$errors[0].$message
            }} </span>
        </div>

        {{disabled}}
        <Button
            @on-click="createTask"
            label="Submit"
            :disabled="disabled"
            size="medium"
            version="yellow"
        />
      </div>

      <div>
        <CheckBox id="addQueue" label="Add to my queue" v-model:value="addQueue"/>

        <div v-if="addQueue" class="flex items-center gap-x-6">
          <Radio id="positionTop" label="Add to the top" v-model:value="position" version="top" name="position"/>
          <Radio id="positionBottom" label="Add to the bottom" v-model:value="position" version="bottom"
                 name="position"/>
        </div>
      </div>
    </form>

    <div class="mt-8" v-if="searchedTasks.length && name.length > 2">
      <h3 class="font-semibold text-lg text-black-c block mb-[10px]">Similar Tasks Found</h3>

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
            <tr v-if="!searchedTasks.length">
              <td :colspan="headers.length">
                <p class="flex text-center px-4 justify-center py-8 text-black-c font-medium">
                  No data found
                </p>
              </td>
            </tr>

            <tbody>
            <tr v-for="element in searchedTasks" :key="element.id">
              <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                     <span v-if="element.title" class="cursor-pointer" @click="toLink(element)">{{
                         element.title
                       }}</span>
                <span v-else>-</span>
              </td>

              <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                   <span v-if="element.project?.title" class="cursor-pointer" @click="toLink(element.project,true)">{{
                       element.project.title
                     }}</span>
                <span v-else>-</span>
              </td>

              <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                <span>{{ element.status || '-' }}</span>
              </td>
            </tr>
            </tbody>
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
import {onBeforeRouteLeave, useRoute} from 'vue-router'
import {ref, onMounted, computed, watch} from "vue";
import {catchErrors} from "../../utils";
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import {useTasksStore} from "../../store/tasks";
import DataTable from "./../../components/Table/DataTable.vue"
import Pagination from './../../components/Pagination/Pagination.vue'
import Loader from './../../components/Loader/Loader.vue'
import {usePaginate} from "../../composables/usePaginate";
import Button from '../../components/Button/Button.vue'
import Input from '../../components/Input/Input.vue'
import CheckBox from "../../components/CheckBox/CheckBox.vue";
import Radio from "../../components/Radio/Radio.vue";

const taskStore = useTasksStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

// ValidationRules
const rules = {
  name: {required},
}

// State
const loading = ref(false)
const disabled = ref(false)
const name = ref('')
const addQueue = ref(false)
const position = ref('top')
const tempProject = ref(null)
const searchedTasks = ref([])

const v$ = useVuelidate(rules, {name})


// Computed
const headers = computed(() => {
  return [
    {id: 1, label: 'Title', sorting: false},
    {id: 2, label: 'Project', sorting: false},
    {id: 3, label: 'Status', sorting: false},

  ]
})

//Watch
watch(name, (newVal, oldVal) => {
  if (newVal.length > 2) fetchSearchedTasks()
})


// Methods
const toLink = (item, isProject) => {
  const type = isProject ? 'project' : 'task'
  router.push(`/dashboard/${type}/${item.id}`)
}

const fetchSearchedTasks = async () => {
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      search: name.value,
    }
    const resp = await taskStore.fetchTasks(options)
    searchedTasks.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

const createTask = async (e) => {
  if (e) e.preventDefault()
  try {
    disabled.value = true
    const isValid = await v$.value.$validate();
    if (isValid) {
      const projectId = route.hash ? route.hash.substring(1) : ''
      const data = {
        title: name.value,
        project: projectId || tempProject.value?.id || null,

      }

      if (addQueue.value) {
        data.add_to_user_queue = addQueue.value
        data.queue_position = position.value
      }
      const resp = await taskStore.createTask(data)
      name.value = ''
      await toast.success("Task created");
      await router.push(`/dashboard/task/${resp.data.id}`)
    }
  } catch (e) {
    catchErrors(e)
  } finally {
    disabled.value = false
  }
}

onMounted(() => {
  const temp = localStorage.getItem('tempProject')
  if (temp) tempProject.value = JSON.parse(temp)
})

onBeforeRouteLeave((to, from) => {
  localStorage.removeItem('tempProject')
})


const paginate = usePaginate(fetchSearchedTasks, null)

</script>

