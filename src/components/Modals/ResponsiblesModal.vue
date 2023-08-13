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
        <div class="relative p-6 flex-auto">
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
import {onBeforeUnmount, onMounted, ref} from "vue";
import Loader from "./../../components/Loader/Loader.vue"
import {useProjectStore} from "../../store/project";
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";

const emit = defineEmits(['close', 'update'])
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


// Methods
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
