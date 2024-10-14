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
              Manage Task Access
            </h3>

            <CloseBlackIcon class="cursor-pointer" @click="emit('close')"/>
          </div>
        </div>

        <!--body-->
        <div class="relative p-3 flex-auto">
          <Loader v-if="loading"/>

          <div v-else class="content">
            <div class="mb-4 flex justify-between items-center">
              <div class="relative">
                <SearchIcon class="fas fa-search mr-2 text-sm text-blueGray-300 absolute top-1 left-2"/>
                <input
                    v-model="search"
                    type="text"
                    class="pl-9 pr-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Search..."
                />
              </div>

              <Button
                  @on-click="showAll = !showAll"
                  :label="showAll ? 'Hide all users' : 'Show all users'"
                  version="white"
                  size="small"
              />
            </div>

            <ul>
              <li v-for="user in listOfUsers" :key="user.id" class="flex justify-between items-center gap-x-1 mb-2">
                <span class="text-[13px] text-light-c font-medium"
                      v-if="user.first_name || user.last_name">{{ user.first_name }} {{ user.last_name }}</span>
                <span class="text-[13px] text-light-c font-medium" v-else>{{ user.username }}</span>
                <Button
                    @on-click="haveTaskAccessIds.includes(user.id) ? removeUser(user) : assignUser(user)"
                    :label="haveTaskAccessIds.includes(user.id) ? 'Remove' : 'Assign'"
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
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import Loader from "./../../components/Loader/Loader.vue"
import {useTasksStore} from "../../store/tasks";
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";
import CloseBlackIcon from "../Svg/CloseBlackIcon.vue";
import Button from '../Button/Button.vue'
import SearchIcon from "../Svg/SearchIcon.vue";

const emit = defineEmits(['close', 'update', 'fetch-users'])
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
  allUsers: {
    type: Array,
    default: () => []
  },
  btnTitle: {
    type: String,
    default: ''
  },
})


const taskStore = useTasksStore()
const {cookies} = useCookies();
const toast = useToast()

// State
const search = ref('')
const showAll = ref(false)
const btnLoad = ref(false)
const loading = ref(false)
const componentModalRef = ref()

const listOfUsers = computed(() => {
  return showAll.value || search.length ? props.allUsers : props.users
})


//Watch
watch(search, (val) => {
  if (val.length) showAll.value = true
  emit('fetch-users', val)
})

// Methods
const assignUser = async (user) => {
  try {
    btnLoad.value = true
    const data = {
      task: props.task.id,
      user: user.id
    }

    await taskStore.assignUserToTask(data)
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
    const findItem = props.haveTaskAccess.find((item) => item.user.id === user.id)
    await taskStore.removeUserFromTask({id: findItem.id})
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
