<template>
  <div v-if="showModal" ref="componentModalRef" @click.self="emit('close')"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative my-6 mx-auto w-[350px]">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <!--header-->
        <div class="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 class="text-3xl font-semibold">
            Select Responsible
          </h3>

          <div>
            <span class="cursor-pointer" @click="emit('close')">
               <i class="fas fa-window-close mr-2 text-3xl text-blueGray-400"/>
            </span>
          </div>
        </div>
        <!--body-->

        <div class="px-6 pt-3 flex justify-end">
          <span class="cursor-pointer" @click="updateUsers">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1536 1536"><path
                fill="#94a3b8"
                d="M1511 928q0 5-1 7q-64 268-268 434.5T764 1536q-146 0-282.5-55T238 1324l-129 129q-19 19-45 19t-45-19t-19-45V960q0-26 19-45t45-19h448q26 0 45 19t19 45t-19 45l-137 137q71 66 161 102t187 36q134 0 250-65t186-179q11-17 53-117q8-23 30-23h192q13 0 22.5 9.5t9.5 22.5zm25-800v448q0 26-19 45t-45 19h-448q-26 0-45-19t-19-45t19-45l138-138Q969 256 768 256q-134 0-250 65T332 500q-11 17-53 117q-8 23-30 23H50q-13 0-22.5-9.5T18 608v-7q65-268 270-434.5T768 0q146 0 284 55.5T1297 212l130-129q19-19 45-19t45 19t19 45z"/></svg>
            </span>
        </div>

        <div class="relative px-6 pb-6 pt-2 flex-auto">
          <Loader v-if="loading"/>

          <div v-else class="content">
            <ul>
              <li v-for="user in users" :key="user.id" class="flex justify-between items-center gap-x-1 my-3">
                <span class="text-lg text-blueGray-500 font-medium">{{ user.first_name }} {{ user.last_name }}</span>
                <button
                    class="bg-emerald-600 text-white active:bg-blueGray-600 text-sm font-bold px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                    @click="update(user)"
                >
                  Assign
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
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import Loader from "./../../components/Loader/Loader.vue"
import {useProjectStore} from "../../store/project";
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";

const emit = defineEmits(['close', 'update', 'update-users'])
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    default: () => {
    }
  },
  task: {
    type: Object,
    default: () => {
    }
  },
  haveProjectAccess: {
    type: Array,
    default: () => []
  },
  haveProjectAccessIds: {
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


const {cookies} = useCookies();
const toast = useToast()

// State
const componentModalRef = ref()
const loading = ref(false)
const owner = ref(null)


//Watch
watch(()=>props.showModal,(val)=>{
  if (val) updateUsers()
})


// Methods
const updateUsers = async () => {
  try {
    loading.value = true
    await emit('update-users')
    setTimeout(() => {
      loading.value = false
    }, 400)
  } catch (e) {
  }
}


const update = async (user) => {
  emit('update', user.id)
  emit('close')
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
