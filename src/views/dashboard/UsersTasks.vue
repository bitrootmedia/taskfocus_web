<template>
  <div class="main-container">
    <h2 class="font-bold text-xl block text-blueGray-700 mb-4">Users</h2>

      <DataTable :headers="headers">
        <template v-slot:tableBody>
          <tr v-if="loading">
            <td :colspan="headers.length">
              <div class="flex justify-center py-1 text-blueGray-500 font-medium">
                <Loader/>
              </div>
            </td>
          </tr>

          <template v-else>
            <tr v-if="!users.length">
              <td :colspan="headers.length">
                <p class="flex text-center px-4 justify-center py-8 text-blueGray-500 font-medium">
                  No data found
                </p>
              </td>
            </tr>

           <tbody>
            <tr v-for="element in users" :key="element.id">
             <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
               <span class="cursor-pointer" @click="toLink(`/dashboard/users-tasks/${element.id}`)">{{ element.first_name }} {{ element.last_name }}</span>
             </td>
             <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
               <span class="cursor-pointer" @click="toLink(`/dashboard/users-tasks/${element.id}`)">{{ element.username }}</span>
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
</template>

<script setup>
import Loader from "./../../components/Loader/Loader.vue"
import {computed, ref} from "vue";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import {catchErrors} from "../../utils";
import {useUserStore} from "../../store/user";
import {useCookies} from "vue3-cookies";
import DataTable from '../../components/Table/DataTable.vue'
import Pagination from '../../components/Pagination/Pagination.vue'
import {usePaginate} from "../../composables/usePaginate";

const userStore = useUserStore()
const {cookies} = useCookies();
const toast = useToast()
const router = useRouter()

//State
const loading = ref(false)
const users = ref([])
const userConfig = ref(null)


// Computed
const headers = computed(() => {
  return [
    {id: 1, label: 'Full Name', sorting: false},
    {id: 2, label: 'Username', sorting: false},
  ]
})

// Methods
const toLink = (link) => {
  router.push(link)
}

const fetchUsers = async () => {
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
    }
    const resp = await userStore.fetchUsersPage(options)
    users.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  }finally {
    loading.value = false
  }
}


const fetchUser = async () => {
  try {
    const id = cookies.get('task_focus_user').pk
    if (id) {
      const resp = await userStore.fetchCurrentUser({id})
      if (!resp.data.config.limit_queue_view.length){
        toast.info('Ask administrator to setup limit_queue_view config parameter')
      }

      userConfig.value = resp.data.config
      await fetchUsers()
    }
  } catch (e) {
    toast.error('Please ask administrator to check your settings')
  }
}

// Composables
const paginate = usePaginate(fetchUsers, null)
fetchUser()

</script>
