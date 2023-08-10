<template>
  <div class="main-container">
    <h2 class="font-bold text-xl block text-blueGray-700 mb-4">Users</h2>

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
    {id: 1, label: 'Full Name', sorting: true, sortLabel: 'first_name'},
    {id: 2, label: 'Username', sorting: true, sortLabel: 'username'},
  ]
})

// Methods
const toLink = (link) => {
  router.push(link)
}

const sorting = (label) => {
  fetchUsers(label)
}

const fetchUsers = async (label = null) => {
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
      sorting: label
    }
    const resp = await userStore.fetchUsersPage(options)
    console.log(resp,'resp')
    users.value = resp.data.results
    paginate.updatePagination(resp)
  } catch (e) {
    catchErrors(e)
  }finally {
    loading.value = false
  }
}



// Composables
const paginate = usePaginate(fetchUsers, null)
fetchUsers()

</script>
