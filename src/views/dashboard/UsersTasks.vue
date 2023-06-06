<template>
  <div class="main-container">

    <Loader v-if="loading"/>

    <template v-else>
      <div class="content grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div v-for="(userTask,index) in usersTasks"
             :key="index"
             class="border-2 border-blueGray-300 rounded-[4px] px-4 pt-4">
          <div class="text-center mb-4">
            <h4 class="flex justify-center items-baseline text-xl font-bold inline-flex text-blueGray-800 cursor-pointer"
                @click="toLink(`/dashboard/users-tasks/${Object.keys(userTask)[0]}`)">
              {{ userTask[Object.keys(userTask)[0]].user.first_name }} {{
                userTask[Object.keys(userTask)[0]].user.last_name
              }}
              <span class="text-sm ml-[2px] text-blueGray-500">({{userTask[Object.keys(userTask)[0]].user.username}})</span>
            </h4>
          </div>

          <p class="text-blueGray-600 font-semibold mb-3" v-if="userTask[Object.keys(userTask)[0]].currentTask?.id">
            Currently working on:
            <router-link :to="`/dashboard/task/${userTask[Object.keys(userTask)[0]].currentTask.id}`"
                         class="underline text-blue-500">{{ userTask[Object.keys(userTask)[0]].currentTask.title }}
            </router-link>
          </p>


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
                <tr v-if="!userTask[Object.keys(userTask)[0]].data.length">
                  <td :colspan="headers.length">
                    <p class="flex text-center px-4 justify-center py-8 text-blueGray-500 font-medium">
                      No data found
                    </p>
                  </td>
                </tr>

                <draggable
                    v-else
                    tag="tbody"
                    :disabled="isDragDisabled"
                    v-model="userTask[Object.keys(userTask)[0]].data"
                    item-key="id"
                    group="id"
                    @change="changeDrag($event,userTask[Object.keys(userTask)[0]])"
                >
                  <template #item="{element}">
                    <tr :class="{'cursor-move': !isDragDisabled}">
                      <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <span @click.stop="toLink(`/dashboard/project/${element.task.project?.id}`)"
                            class="cursor-pointer">{{ element.task.project?.title || '-' }}</span>
                      </td>
                      <td class="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <span @click.stop="toLink(`/dashboard/task/${element.task?.id}`)"
                            class="cursor-pointer">{{ element.task.title || '-' }}</span>
                      </td>
                    </tr>
                  </template>
                </draggable>
              </template>
            </template>
          </DataTable>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import DataTable from "./../../components/Table/DataTable.vue"
import Loader from "./../../components/Loader/Loader.vue"
import draggable from 'vuedraggable'
import {useUsersTasksStore} from "../../store/users-tasks";
import {computed, ref} from "vue";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import {usePaginate} from "../../composables/usePaginate";
import {catchErrors} from "../../utils";
import {useUserStore} from "../../store/user";
import config from "../../config"
import {useCookies} from "vue3-cookies";

const usersTasksStore = useUsersTasksStore()
const userStore = useUserStore()
const {cookies} = useCookies();
const toast = useToast()
const router = useRouter()


//State
const isDragDisabled = false
const loading = ref(false)
const usersTasks = ref([])
const users = ref([])
const userConfig = ref(null)


// Computed
const headers = computed(() => {
  return [
    {id: 1, label: 'Project', sorting: false, sortLabel: 'created_at'},
    {id: 2, label: 'Task', sorting: false, sortLabel: 'author'},
  ]
})

// Methods
const toLink = (link) => {
  router.push(link)
}

const fetchUsers = async () => {
  try {
    loading.value = true
    const resp = await userStore.fetchUsersPage()
    const users = resp.data.results

    const filterUsers = users.filter((item)=>userConfig.value.limit_queue_view.includes(item.username))
    usersTasks.value = []

    await filterUsers.map(async (item) => {
      await fetchUsersTasks(item)
    })
  } catch (e) {
    catchErrors(e)
  }
}

const changeDrag = async (e, item) => {
  try {
    const newIndex = e.moved.newIndex
    let aboveItemId = null
    let belowItemId = null

    if (newIndex !== 0) {
      const findItem = item.data.find((item, index) => index === newIndex - 1)
      aboveItemId = findItem?.id
    }

    if (newIndex !== item.data.length) {
      const nextItem = item.data.find((item, index) => index === newIndex + 1)
      belowItemId = nextItem?.id
    }

    const data = {
      id: e.moved.element.id,
      task_above_id: aboveItemId,
      user_task_queue_id: belowItemId,
    }
    await usersTasksStore.updateOrder(data)
  } catch (e) {
    catchErrors(e)
  }
}

const fetchUsersTasks = async (user) => {
  try {
    const resp = await usersTasksStore.fetchUsersTasks({id: user.id})
    const temp = []

    const obj = {
      user: user,
      data: resp.data.results,
      currentTask: await usersTasksStore.fetchWorkingTask({id: user.id})
    }


    if (temp[user.id]) temp[user.id] = [...temp[user.id], obj]
    else temp[user.id] = obj
    usersTasks.value = [...usersTasks.value, temp]
  } catch (e) {
    catchErrors(e)
  } finally {
    loading.value = false
  }
}

const fetchUser = async () => {
  try {
    const id = cookies.get('task_focus_user').pk
    if (id) {
      const resp = await userStore.fetchCurrentUser({id})
      userConfig.value =resp.data.config
      await fetchUsers()
    }
  } catch (e) {
    catchErrors(e)
  }
}

// Composables
fetchUser()

</script>
