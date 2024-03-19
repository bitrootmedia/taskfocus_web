<template>
  <div class="main-container">
    <Loader v-if="loading" />

    <div class="content " v-else>
      <div v-if="reminders?.length">
        <Reminders
            :show-links="true"
            :paginate="paginate"
            :reminders="reminders"
            :loading="loading"
            :users="users"
            :hide="true"
            @update="fetchReminders"
        />
      </div>

      <div v-else>
        <p class="flex text-center px-4 justify-center py-8 text-black-c text-3xl font-medium">
          No data found
        </p>
      </div>
    </div>
  </div>

</template>

<script setup>
import Loader from "../../components/Loader/Loader.vue"
import {ref} from "vue";
import {catchErrors} from "../../utils";
import {useTasksStore} from "../../store/tasks";
import config from "../../config";
import {usePaginate} from "../../composables/usePaginate";
import {useUserStore} from "../../store/user";
import Reminders from '../../components/Reminders/Reminders.vue'

//State
const taskStore = useTasksStore()
const userStore = useUserStore()
const loading = ref(false)
const reminders = ref([])
const users = ref([])


// Methods
const fetchReminders = async()=>{
  try {
    loading.value = true
    const options = {
      pagination: paginate.pagination.value,
      query: paginate.query.value,
    }

    const resp = await taskStore.fetchReminders(options)
    reminders.value = resp.data.results
    paginate.updatePagination(resp)
  }catch (e) {
    catchErrors(e)
  }finally {
    loading.value = false
  }
}

const fetchUsers = async () => {
  try {
    const resp = await userStore.fetchUsers()
    users.value = resp.data.results
  } catch (e) {
    catchErrors(e)
  }
}

// Run Functions
const options = {
  pageSize: config.REMINDERS_ALL
}
const paginate = usePaginate(fetchReminders, options)
fetchReminders()
fetchUsers()

</script>
