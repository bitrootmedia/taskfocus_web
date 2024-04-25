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
              Time Tracker
            </h3>

            <CloseBlackIcon class="cursor-pointer" @click="emit('close')"/>
          </div>
        </div>
        <!--body-->
        <div class="relative p-3 flex-auto">
          <Loader v-if="loading"/>

          <div v-else class="content">
            <div class="relative w-full mb-4">
              <label
                  class="block ext-black-c text-xs font-semibold mb-1"
                  htmlFor="grid-date"
              >
                Start Date
              </label>
              <input
                  id="grid-date1"
                  v-model="form.startedDate"
                  type="datetime-local"
                  class="px-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Start Date"
              />
            </div>

            <div class="relative w-full mb-4">
              <label
                  class="block ext-black-c text-xs font-semibold mb-1"
                  htmlFor="grid-date"
              >
                Stop Date
              </label>
              <input
                  id="grid-date"
                  v-model="form.stoppedDate"
                  type="datetime-local"
                  class="px-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Stop Date"
              />
            </div>

            <div class="relative w-full">
              <Button
                  @on-click="updateTracker"
                  :disabled="btnLoad"
                  :label="'Update'"
                  version="dark-small"
                  size="small"
              />
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
  btnTitle: {
    type: String,
    default: ''
  },
})

const tasksStore = useTasksStore()
const {cookies} = useCookies();
const toast = useToast()



// State
const btnLoad = ref(false);
const checkIn = ref(null);
const checkOut = ref(null);
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
    btnLoad.value = true
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
  }finally {
    btnLoad.value = false
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