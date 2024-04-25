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
              Reminder
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
                  class="block text-black-c text-xs font-semibold mb-1"
                  htmlFor="grid-date"
              >
                Date
              </label>
              <input
                  id="grid-date"
                  v-model="form.date"
                  type="datetime-local"
                  class="px-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Date"
              />
              <span class="text-xs font-medium text-red-600"
                    v-if="v$.date.$error"> {{ v$.date.$errors[0].$message }} </span>
            </div>

            <div class="relative w-full mb-4">
              <label
                  class="block text-black-c text-xs font-semibold mb-1"
                  htmlFor="grid-label"
              >
                Label
              </label>
              <input
                  id="grid-label"
                  v-model="form.label"
                  type="text"
                  class="px-3 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Label"
              />
            </div>

            <div class="relative w-full mb-4">
              <label
                  class="block text-black-c text-xs font-semibold mb-1"
                  htmlFor="grid-label"
              >
                User
              </label>
              <select v-model="form.user" placeholder="Select User"
                      class="pl-3 pr-8 py-[5px] placeholder-[#797A7B] text-[#797A7B] bg-white border border-light-bg-c rounded-[6px] text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              >
                <option :value="user.id" v-for="(user) in users" :key="user.id">{{ user.first_name }}
                  {{ user.last_name }}
                </option>
              </select>

              <span class="text-xs font-medium text-red-600"
                    v-if="v$.user.$error"> {{ v$.user.$errors[0].$message }} </span>
            </div>

            <div class="relative w-full">
              <Button
                  @on-click="createReminder"
                  :disabled="btnLoad"
                  :label="'Create'"
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
import {catchErrors} from "../../utils";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import Loader from "./../../components/Loader/Loader.vue"
import {useTasksStore} from "../../store/tasks";
import {useCookies} from "vue3-cookies";
import {useToast} from "vue-toastification";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import CloseBlackIcon from "../Svg/CloseBlackIcon.vue";
import Button from '../Button/Button.vue'

const btnLoad = ref(false);
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
  users: {
    type: Array,
    default: () => []
  },
  btnTitle: {
    type: String,
    default: ''
  },
})


const tasksStore = useTasksStore()
const {cookies} = useCookies();
const toast = useToast()


// ValidationRules
const rules = {
  date: {required},
  user: {required},
}

// State
const componentModalRef = ref()
const loading = ref(false)
const form = ref({
  date: null,
  label: '',
  user: null
})


const v$ = useVuelidate(rules, form)

watch(() => props.showModal, (val) => {
  if (val) {
    if (!cookies.get('task_focus_user')) return ''
    const user = cookies.get('task_focus_user')

    const findItem = props.users.find((item) => item.id === user.pk)
    if (findItem) form.value.user = findItem.id
  }

})

// Methods
const createReminder = async () => {
  try {
    const isValid = await v$.value.$validate();

    if (isValid) {
      btnLoad.value = true
      const data = {
        task: props.task.id,
        reminder_date: form.value.date,
        user: form.value.user,
        message: form.value.label,
      }

      await tasksStore.createReminders(data);
      await emit('update')
      await toast.success("Successfully created");
      await close()
    }
  } catch (e) {
    catchErrors(e)
  }finally {
    btnLoad.value = false
  }
}

const close = () => {
  emit('close')
  reset()
}

const reset = () => {
  form.value = {
    date: null,
    label: '',
    user: null
  }
  v$.value.$reset()
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