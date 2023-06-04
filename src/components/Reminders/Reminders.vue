<template>
  <div>
    <Loader v-if="loading"/>

    <div v-else class="reminders">
      <div class="header flex items-center gap-x-6 mb-4">
        <h2 class="font-bold text-xl block text-blueGray-700">Reminders</h2>
      </div>

      <ul>
        <li v-for="reminder in reminders" :key="reminder.id"
            class="w-full lg:w-[700px] mb-3 border border-blueGray-300 rounded-[4px] px-4 py-3"
            :class="[reminderCheck(reminder.reminder_date) === 'today' ? 'bg-red-100' : reminderCheck(reminder.reminder_date) === 'tmr' ? 'bg-orange-100' : '']"
        >
          <div class="flex items-center justify-between">
            <span class="text-blueGray-700 font-semibold">{{ convertDateTime(reminder.reminder_date) }}</span>

            <button
                v-if="!hide"
                @click="close(reminder)"
                class="bg-red-400 whitespace-nowrap text-white active:bg-blueGray-600 text-sm font-bold px-2 sm:px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
            >
              Close
            </button>
          </div>


          <div>
            <div class="mt-2">
              <span class="text-blueGray-400 font-semibold block mb-2">User: {{ fullName(reminder) }}</span>
              <div class="mb-2 text-sm text-blueGray-500">
              <span v-if="showLinks && reminder.task?.id" class="block">Task link: <router-link
                  class="underline"
                  :to="`/dashboard/task/${reminder.task.id}`">{{ reminder.task.title }}</router-link></span>
                <span v-if="showLinks && reminder.task?.project?.id" class="block">Project link: <router-link
                    class="underline"
                    :to="`/dashboard/project/${reminder.task.project.id}`">{{ reminder.task.project.title }}</router-link></span>
              </div>

              <p class="text-blueGray-500 ">{{ reminder.message }}</p>
            </div>
          </div>
        </li>
      </ul>

      <Pagination
          v-if="paginate.pagination.value.total > 1 && !loading"
          :pagination="paginate.pagination.value"
          v-model:query="paginate.query.value"
          :position="'right'"
      />
    </div>
  </div>
</template>

<script setup>
import Pagination from '../Pagination/Pagination.vue'
import {catchErrors, convertDateTime} from "../../utils";
import Loader from '../Loader/Loader.vue'
import {useTasksStore} from "../../store/tasks";
import {useToast} from "vue-toastification";
import moment from "moment";

const emit = defineEmits(['update'])
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  hide: {
    type: Boolean,
    default: false
  },
  showLinks: {
    type: Boolean,
    default: false
  },
  paginate: {
    type: Object,
    default: () => {
    }
  },
  reminders: {
    type: Array,
    default: () => []
  },
  users: {
    type: Array,
    default: () => []
  }
})

const taskStore = useTasksStore()
const toast = useToast()

// Methods
const fullName = (reminder) => {
  const findItem = props.users.find((item) => item.id === reminder.user)
  if (findItem) return findItem.first_name + ' ' + findItem.last_name

  return ''
}

const close = async (reminder) => {
  try {
    await taskStore.closeReminder({id: reminder.id})
    await toast.success('Successfully closed')
    await emit('update')
  } catch (e) {
    catchErrors(e)
  }
}

const reminderCheck = (date)=>{
  const isToday = moment(0, "HH").diff(date, "days") === 0
  const isTmr = moment(0, "HH").diff(date, "days") === -1

  if (isToday) return 'today'
  if (isTmr) return 'tmr'

  return ''
}


</script>
