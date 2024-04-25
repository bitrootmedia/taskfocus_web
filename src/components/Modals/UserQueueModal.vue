<template>
  <div v-if="showModal" ref="componentModalRef" @click.self="emit('close')"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative my-6 mx-auto w-[350px] sm:w-[400px]">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <!--header-->
        <div class="py-3">
          <div class="flex items-center justify-between rounded-t p-3 border-b border-light-bg-c">
            <h3 class="text-[22px] text-black-c font-semibold">
              Manage Task Queue
            </h3>

            <CloseBlackIcon class="cursor-pointer" @click="emit('close')"/>
          </div>
        </div>

        <!--body-->
        <div class="relative p-3 flex-auto">
          <Loader v-if="loading"/>

          <div v-else class="content">
            <ul>
              <li v-for="user in users" :key="user.id" class="flex justify-between items-center gap-x-1 mb-2">
                <span class="text-[13px] text-light-c font-medium"
                      v-if="user.first_name || user.last_name">{{ user.first_name }} {{ user.last_name }}</span>
                <span class="text-[13px] text-light-c font-medium" v-else>{{ user.username }}</span>
                <Button
                    @on-click="haveTaskAccessIds.includes(user.id) ? removeUser(user) : assignUser(user)"
                    :label="haveTaskAccessIds.includes(user.id) ? 'Remove' : 'Add'"
                    :disabled="btnLoad"
                    :version="haveTaskAccessIds.includes(user.id) ? 'red-small' : 'green-small'"
                    size="small"
                />
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
import {onBeforeUnmount, onMounted, ref} from "vue";
import Loader from "./../../components/Loader/Loader.vue"
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";
import {useUsersTasksStore} from "../../store/users-tasks";
import CloseBlackIcon from "../Svg/CloseBlackIcon.vue";
import Button from '../Button/Button.vue'

const emit = defineEmits(['close', 'update'])
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
  },
  btnTitle: {
    type: String,
    default: ''
  },
})


const usersTasksStore = useUsersTasksStore()
const {cookies} = useCookies();
const toast = useToast()

// State
const btnLoad = ref(false)
const loading = ref(false)
const componentModalRef = ref()


// Methods
const assignUser = async (user) => {
  try {
    btnLoad.value = true
    const data = {
      task: props.task.id,
      user: user.id
    }

    await usersTasksStore.assignUserToQueue(data)
    toast.success("Successfully assigned");
    emit('update')
  } catch (e) {
    catchErrors(e)
  } finally {
    btnLoad.value = false
  }
}

const removeUser = async (user) => {
  try {
    btnLoad.value = true
    const findItem = props.haveTaskAccess.find((item) => item.id === user.id)

    const data = {
      task: props.task.id,
      user: findItem.id
    }
    await usersTasksStore.removeUserFromQueue(data)
    toast.success("Successfully removed");
    emit('update')
  } catch (e) {
    catchErrors(e)
  } finally {
    btnLoad.value = false
  }
}

const handleClick = (e) => {
  if (e.target.innerHTML === props.btnTitle) return false

  if (!componentModalRef.value === e.target) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('click', handleClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClick)
})

</script>