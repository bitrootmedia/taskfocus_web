<template>
  <div v-if="showModal"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative my-6 mx-auto w-[350px] sm:w-[500px]">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <!--header-->
        <div class="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 class="text-3xl font-semibold">
            Manage Task Queue
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
            <ul>
              <li v-for="user in users" :key="user.id" class="flex justify-between items-center gap-x-1 my-3">
                <span class="text-lg text-blueGray-500 font-medium">{{ user.first_name }} {{ user.last_name }}</span>
                <button
                    :class="{'bg-red-600': haveTaskAccessIds.includes(user.id), 'bg-emerald-600':!haveTaskAccessIds.includes(user.id)}"
                    class="text-white active:bg-blueGray-600 text-sm font-bold px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    @click="haveTaskAccessIds.includes(user.id) ? removeUser(user) : assignUser(user)"
                >
                  {{ haveTaskAccessIds.includes(user.id) ? 'Remove from my queue' : 'Add to my queue' }}
                </button>
              </li>
            </ul>
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
import {useTasksStore} from "../../store/tasks";
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";
import {useUsersTasksStore} from "../../store/users-tasks";

const emit = defineEmits(['close','update'])
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: () => {
    }
  },
  haveTaskAccess: {
    type: Array,
    default: () => []
  },
  haveTaskAccessIds: {
    type: Array,
    default: () => []
  },
  users: {
    type: Array,
    default: () => []
  }
})


const usersTasksStore = useUsersTasksStore()
const {cookies} = useCookies();
const toast = useToast()

// State
const loading = ref(false)


// Methods
const assignUser = async (user) => {
  try {
    const data = {
      task: props.task.id,
      user: user.id
    }

    await usersTasksStore.assignUserToQueue(data)
    toast.success("Successfully assigned");
    emit('update')
  } catch (e) {
    catchErrors(e)
  }
}

const removeUser = async (user)=>{
  try {
    const findItem = props.haveTaskAccess.find((item)=>item.user.id === user.id)
    await usersTasksStore.removeUserFromQueue({id: findItem.id})
    toast.success("Successfully removed");
    emit('update')
  } catch (e) {
    catchErrors(e)
  }
}

</script>