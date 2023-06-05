<template>
  <div v-if="showModal" ref="componentModalRef" @click.self="emit('close')"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative my-6 mx-auto w-[350px]">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <!--header-->
        <div class="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 class="text-3xl font-semibold">
            Select new owner
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
            <div class="mb-2 sm:mb-4">
              <div class="mb-2">
                <label
                    class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-label"
                >
                  Select new owner
                </label>

                <select v-model="owner" placeholder="Select User"
                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                >
                  <option :value="user.id" v-for="(user) in users" :key="user.id">{{ user.first_name }}
                    {{ user.last_name }}
                  </option>
                </select>
              </div>

              <button
                  class="mt-2 bg-blueGray-800 text-white active:bg-blueGray-600 text-md font-bold px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="button"
                  @click="update"
              >
               Update
              </button>

              </div>
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

const emit = defineEmits(['close','update'])
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


const projectStore = useProjectStore()
const {cookies} = useCookies();
const toast = useToast()

// State
const componentModalRef = ref()
const loading = ref(false)
const owner = ref(null)


// Methods
const update = async () => {
  emit('update',owner.value)
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
