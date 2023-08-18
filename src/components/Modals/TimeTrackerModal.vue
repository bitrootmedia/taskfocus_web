<template>
  <div v-if="showModal" ref="componentModalRef" @click.self="emit('close')"
       class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative my-6 mx-auto w-[350px] sm:w-[400px]">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <!--header-->
        <div class="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 class="text-3xl font-semibold">
            Time Tracker
          </h3>

          <div>
            <span class="cursor-pointer" @click="close">
               <i class="fas fa-window-close mr-2 text-3xl text-blueGray-400"/>
            </span>
          </div>
        </div>
        <!--body-->
        <div class="relative p-6 flex-auto">
          <Loader v-if="loading"/>

          <div v-else class="content">
            <div class="relative w-full mb-3">
              <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-date"
              >
                Start Date
              </label>
              <input
                  id="grid-date1"
                  v-model="form.startedDate"
                  type="datetime-local"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Start Date"
              />
            </div>

            <div class="relative w-full mb-3">
              <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-date"
              >
                Stop Date
              </label>
              <input
                  id="grid-date"
                  v-model="form.stoppedDate"
                  type="datetime-local"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Stop Date"
              />
            </div>

            <div class="relative w-full">
              <button
                  @click="updateTracker"
                  class="mt-2 bg-blueGray-800 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="button"
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
import {catchErrors, convertDateTimezone} from "../../utils";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import Loader from "./../../components/Loader/Loader.vue"
import {useTasksStore} from "../../store/tasks";
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";

const checkIn = ref(null);
const checkOut = ref(null);

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
  btnTitle: {
    type: String,
    default: ''
  },
})

const tasksStore = useTasksStore()
const {cookies} = useCookies();
const toast = useToast()


// State
const componentModalRef = ref()
const loading = ref(false)
const form = ref({
  startedDate: null,
  stoppedDate: null,
})

watch(() => props.showModal, (val) => {
  if (val) {
    form.value.startedDate = convertDateTimezone(props.task.started_at)
    form.value.stoppedDate = convertDateTimezone(props.task.stopped_at)
  }
})

// Methods
const updateTracker = async () => {
  try {
    const data = {
      id: props.task.id,
      stopped_at: form.value.stoppedDate,
      started_at: form.value.startedDate,
    }

    await tasksStore.updateTimeTracker(data);
    await emit('update')
    await toast.success("Successfully updated");
    await close()

  } catch (e) {
    catchErrors(e)
  }
}

const close = () => {
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